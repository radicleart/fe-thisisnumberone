<template>
<div class="row">
  <div class="col-md-12 col-xs-12">
    <div class="w-100 mb-3" role="group">
      <label for="status-name">Contract Status</label>
      <b-form-select id="status-name" v-model="status" :options="statusEnum"></b-form-select>
      <b-form-text class="text-warning" id="status-help">Status is active=0, inactive=1, disabled=2.</b-form-text>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div class="my-3">
        <b-button class="mr-3" variant="light" @click.prevent="this.$emit('update', { opcode: 'cancel' })">Cancel</b-button>
        <b-button class="mr-3" variant="info" @click.prevent="saveProject()">Save</b-button>
      </div>
    </div>
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
  name: 'ContractStatusManager',
  components: {
  },
  props: ['contractId'],
  data () {
    return {
      statusEnum: [0, 1, 2],
      status: 0,
      project: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayProjectStore/fetchProjectByContractId', this.contractId).then((project) => {
      this.project = Object.assign(this.project, project)
      this.loaded = true
    })
  },
  methods: {
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
    saveProject (project) {
      project.updated = new Date().getTime()
      this.$store.dispatch('rpayProjectStore/saveProject', { project: project, imageData: null }).then(() => {
        this.$notify({ type: 'success', title: 'Projects', text: 'Project has been saved.' })
      })
    },
    connectApplication (data, project) {
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        project.status = 'connected'
        if (result) project.txId = result.txId
        this.saveProject(project)
        this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to find contract on blobkchain.' })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to find contract on blobkchain.' })
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
