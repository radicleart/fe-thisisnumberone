<template>
<div v-if="!registry">
  <h1>Deploy Registry Contract</h1>
  <p class="mt-4">The registry contract is located in github repo 'clarity-market':</p>
  <p>Clone this and navigate to the <span class="text-info">contracts/appmap.clar</span> contract</p>
  <p> Once the registry contract is deployed you'll be able to deploy and connect
    your NFT contracts</p>
  <div class="row">
    <div class="col-12">
      <DeployContractFromFile />
    </div>
  </div>
</div>
<div v-else>
  <h1>Projects and Contract Data</h1>
  <p class="mt-4">Once the registry contract, located in github repo '<span class="text-info">clarity-market:/contracts/appmap.clar</span>',
  is deployed, NFT contracts can be deployed and then connected to the registry.</p>
  <p>This screen allows project meta data to be defined and the corresponding contracts
    to be deployed.
  </p>
  <p>Projects can be either fully connected (contract is deployed and registered, see
    appmap.clar) or in the 'pipeline' meaning either the contract has not yet been deployed,
    is currently deploying or has not yet been connected to the registry. The status of
    a project is either in 'deployment' or fully 'connected' to reflect these states.
  </p>
  <p>Note this is not the same as the status of a project in the contract - the status field in
    the contract represents the state of the project in the marketplace; enabled, disabled
    or detached.
  </p>
  <div class="upload-preview text-white my-5 p-4" v-if="registry" >
    <div class="mb-5 row">
      <div class="col-12"></div>
      <div class="col-2">Registry</div><div class="col-10">{{registry.adminContractAddress}}.{{registry.adminContractName}}</div>
      <div class="col-2">Apps</div><div class="col-10">{{registry.appCounter}}</div>
      <!-- <div class="col-2">Logged in as</div><div class="col-10">{{profile.stxAddress}}</div> -->
      <div v-if="!hasRegistry" class="col-12"><a class="pointer text-white" @click.prevent="showRegistryDeploy = !showRegistryDeploy">deploy registry</a></div>
    </div>
    <b-tabs
      active-nav-item-class="font-weight-bold text-uppercase text-danger"
      active-tab-class="font-weight-bold text-white"
      content-class="mt-3"
      justified bg-variant="warning" v-model="tabIndex" small card left>
      <b-tab title="Projects" active lazy>
        <div v-if="showRegistryDeploy">
          <DeployContractFromFile />
        </div>
        <div v-else>
          <TableOfContracts @update="update"/>
          <TableOfProjects @update="update"/>
        </div>
      </b-tab>
      <b-tab title="New Project" lazy>
        <ProjectForm :contractId="contractId" @update="update"/>
      </b-tab>
      <b-tab title="Deploy Contract" lazy v-if="showDeployTab">
        <DeployProjectContract :project="targetProject" @update="update"/>
      </b-tab>
    </b-tabs>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import DeployContractFromFile from './contracts/DeployContractFromFile.vue'
import DeployProjectContract from './contracts/DeployProjectContract.vue'
import ProjectForm from './contracts/ProjectForm.vue'
import TableOfContracts from './contracts/TableOfContracts.vue'
import TableOfProjects from './contracts/TableOfProjects.vue'

export default {
  name: 'TokenList',
  components: {
    DeployContractFromFile,
    ProjectForm,
    TableOfProjects,
    DeployProjectContract,
    TableOfContracts
  },
  data () {
    return {
      tabIndex: 0,
      targetProject: null,
      contractId: null,
      registry: null,
      showRegistryDeploy: false,
      showDeployTab: false,
      showContractManager: false
    }
  },
  mounted () {
    this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
      this.registry = registry
    })
  },
  methods: {
    update (data) {
      if (data.opcode === 'cancel' || data.opcode === 'project-saved') {
        this.showContractManager = false
        this.tabIndex = 0
      } else if (data.opcode === 'project-update') {
        this.tabIndex = 1
        this.contractId = data.contractId
      } else if (data.opcode === 'open-deploy') {
        this.showDeployTab = true
        this.tabIndex = 2
        this.targetProject = data.project
      } else if (data.opcode === 'open-contract-manager') {
        this.contractId = data.contractId
        this.showContractManager = true
      }
    }
  },
  computed: {
    hasRegistry: function () {
      return this.registry && this.registry.adminContractAddress
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
.btn {
  width: inherit;
}
.upload-preview {
  padding: 10px;
  height: auto;
  border: 0pt dashed rgb(146, 146, 38);
  background-color: #FCFCFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 9px #00000029;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: normal;
}
</style>
