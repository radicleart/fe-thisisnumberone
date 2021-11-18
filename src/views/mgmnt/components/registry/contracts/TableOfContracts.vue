<template>
<div>
  <h2>Connected Projects</h2>
  <p>Projects for which the contract is deployed and the contract
    is connected to the Number One Registry</p>
  <div class="mt-5">
    <b-table striped hover :items="values()" :fields="fields()" class="mt-3 bg-light text-dark">
      <template #cell(Contract)="data">
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Contract details in the blockchain explorer">
          <a class="text-info mr-2" :href="transactionUrl(data)" target="_blank">{{data.value}}</a>
        </span>
      </template>
      <template #cell(Actions)="data">
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Update the meta data for this project">
          <a @click.prevent="updateContractMeta(data)" class="text-info mr-2" href="#"><b-icon icon="pencil-square"/></a>
          <a @click.prevent="openContractManager(data)" class="text-info mr-2" href="#"><b-icon icon="pencil-circle"/></a>
        </span>
      </template>
    </b-table>
  </div>
</div>
</template>

<script>
export default {
  name: 'TableOfContracts',
  components: {
  },
  data () {
    return {
      registry: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
      this.registry = registry
    })
  },
  methods: {
    fields () {
      return ['Contract', 'Title', 'Symbol', 'Owner', 'App Index', 'Status', 'Actions']
    },
    values () {
      let mapped = []
      if (!this.registry) return mapped
      const $self = this
      mapped = this.registry.applications.map(function (application) {
        return {
          Contract: application.contractId.split('.')[1],
          Title: application.tokenContract.tokenName,
          Symbol: application.tokenContract.tokenSymbol,
          Owner: $self.truncat(application.owner),
          'App Index': application.appIndex,
          Administrator: $self.truncat(application.tokenContract.administrator),
          Counter: application.tokenContract.mintCounter,
          // Price: application.tokenContract.mintPrice,
          Status: application.status,
          Actions: null
        }
      })
      return mapped
    },
    openContractManager: function (data) {
      const contractId = this.registry.applications[data.index].contractId
      this.$emit('update', { opcode: 'open-contract-manager', contractId: contractId })
    },
    updateContractMeta: function (data) {
      const contractId = this.registry.applications[data.index].contractId
      this.$emit('update', { opcode: 'project-update', contractId: contractId })
    },
    transactionUrl: function (data) {
      const txId = this.registry.applications[data.index].contractId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    truncat (address) {
      return '..' + address.substring(address.length - 6)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
