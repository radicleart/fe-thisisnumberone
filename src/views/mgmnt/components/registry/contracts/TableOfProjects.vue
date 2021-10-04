<template>
<div>
  <div class="mt-5">
    <h2>Projects in the Pipeline</h2>
    <p>Projects which are not connected to the registry. They may or may not have a
      deployed contract.
    </p>
    <b-table striped hover :items="pvalues()" :fields="pfields()" class="mt-3 bg-light text-dark">
      <template #cell(Actions)="data">
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Update record">
          <a @click.prevent="updateProject(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="pencil-square"/></a>
        </span>
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Connect to Blockchain">
          <a @click.prevent="connectProject(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="plus-square"/></a>
        </span>
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Lookup the contract source code on the blockchain">
          <!-- <a @click.prevent="deleteProject(data)" class="text-danger mr-2" href="#" target="_blank"><b-icon icon="x-circle"/></a> -->
          <a @click.prevent="lookupContract(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="question-square"/></a>
        </span>
      </template>
    </b-table>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import {
  intCV,
  bufferCV,
  standardPrincipalCV
} from '@stacks/transactions'

const REGISTRY_CONTRACT_ADDRESS = process.env.VUE_APP_REGISTRY_CONTRACT_ADDRESS
const REGISTRY_CONTRACT_NAME = process.env.VUE_APP_REGISTRY_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'TableOfProjects',
  components: {
  },
  data () {
    return {
      projects: [],
      registry: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
      this.registry = registry
    })
    this.$store.dispatch('rpayProjectStore/fetchProjectsByStatus', 'deployment').then((projects) => {
      this.projects = projects
    })
  },
  methods: {
    pfields () {
      return ['Contract', 'Title', 'Status', 'Actions']
    },
    pvalues () {
      let mapped = []
      mapped = this.projects.map(function (project) {
        return {
          Contract: project.contractId.split('.')[1],
          Title: project.title,
          Status: project.status,
          Actions: null
        }
      })
      return mapped
    },
    updateProject: function (data) {
      const contractId = this.projects[data.index].contractId
      this.$emit('update', { opcode: 'project-update', contractId: contractId })
    },
    deleteProject: function (data) {
      const contractId = this.projects[data.index].contractId
      this.$store.dispatch('rpayProjectStore/deleteProjectByContractId', contractId).then((projects) => {
        this.projects = projects
      })
    },
    lookupContract (data) {
      const contractId = this.projects[data.index].contractId
      this.$store.dispatch('rpayStacksStore/lookupContractInterface', contractId).then((data) => {
        this.contractInterface = data
        this.$notify({ type: 'success', title: 'Contract Found', text: 'The contract is fully deployed.' })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to find contract on blobkchain.' })
      })
    },
    connectProject (pdata) {
      const project = this.projects[pdata.index]
      this.$store.dispatch('rpayStacksStore/lookupContractInterface', project.contractId).then((cdata) => {
        if (!cdata) {
          this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to connect project as there is no contract on blobkchain.' })
        } else {
          const functionArgs = [standardPrincipalCV(project.owner), bufferCV(Buffer.from(project.contractId)), intCV(0)]
          const data = {
            contractAddress: REGISTRY_CONTRACT_ADDRESS,
            contractName: REGISTRY_CONTRACT_NAME,
            functionName: 'register-app',
            functionArgs: functionArgs,
            eventCode: 'connect-application'
          }
          this.connectApplication(data, project) // $emit('updateEventCode', data)
          this.$notify({ type: 'success', title: 'Contract Found', text: project.contractId + ' is fully deployed.' })
        }
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to connect project as there is no contract on blobkchain.' })
      })
    },
    updateApp: function (pdata) {
      const appCounter = this.registry.applications[pdata.index].appCounter
      const status = this.registry.applications[pdata.index].status
      const contractId = this.registry.applications[pdata.index].contractId
      const project = this.projects.find((o) => o.contractId === contractId)
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
      const functionArgs = [intCV(appCounter), standardPrincipalCV(owner), bufferCV(Buffer.from(contractId)), intCV(0), intCV(status)]
      const data = {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        contractName: REGISTRY_CONTRACT_NAME,
        functionName: 'update-app',
        functionArgs: functionArgs,
        eventCode: 'connect-application'
      }
      this.connectApplication(data, project) // $emit('updateEventCode', data)
    },
    connectApplication (data, project) {
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        project.status = 'connected'
        if (result) project.txId = result.txId
        this.saveProject(project)
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Application is now connected to the Stacks blockchain.')
      }).catch(() => {
        data.action = 'inc-nonce'
        this.$store.commit('setModalMessage', 'Incrementing nonce and trying again.')
        this.$store.dispatch(method, data).then((result) => {
          this.result = result
          project.status = 'connected'
          if (result) project.txId = result.txId
          this.saveProject(project)
          this.$root.$emit('bv::hide::modal', 'waiting-modal')
          this.$root.$emit('bv::show::modal', 'success-modal')
          this.$store.commit('setModalMessage', 'Application is now connected to the Stacks blockchain.')
        }).catch((error) => {
          this.result = error
          this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
        })
      })
    },
    saveProject (project) {
      project.updated = new Date().getTime()
      this.$store.dispatch('rpayProjectStore/saveProject', { project: project, imageData: null }).then(() => {
        this.$notify({ type: 'success', title: 'Projects', text: 'Project has been saved.' })
      })
    },
    changeApplicationStatus (status) {
      const application = this.application
      const functionArgs = [intCV(application.appIndex), intCV(status)]
      const data = {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        contractName: REGISTRY_CONTRACT_NAME,
        functionName: 'set-app-status',
        functionArgs: functionArgs,
        eventCode: 'disable-application'
      }
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Application status has been changed to ' + status + ' on the Stacks blockchain.')
      }).catch((error) => {
        this.result = error
        this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
