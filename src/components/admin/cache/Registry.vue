<template>
<div>
<div class="upload-preview bg-info text-white  my-5 p-4">
  <b-button class="btn-action mr-3" variant="warning" @click="buildCache">Build Cache</b-button>
  <b-button class="btn-action mr-3" variant="warning" @click="buildSearchIndex">Build Search Index</b-button>
</div>
  <b-tabs card left content-class="mt-3">
    <b-tab title="Transfers" active>
      <LocalhostTransfers />
    </b-tab>
    <b-tab title="Token Cache" active>
      <TokenList />
    </b-tab>
    <b-tab title="Token Filters">
      <TokenFilterList />
    </b-tab>
    <b-tab title="Address Lookup">
      <AddressLookup />
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
import LocalhostTransfers from './LocalhostTransfers'
import TokenList from './TokenList'
import TokenFilterList from './TokenFilterList'
import AddressLookup from './AddressLookup'

export default {
  name: 'Registry',
  components: {
    TokenList,
    LocalhostTransfers,
    TokenFilterList,
    AddressLookup
  },
  data () {
    return {
    }
  },
  mounted () {
    const config = {
      contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      functionName: 'get-balance',
      functionArgs: []
    }
    this.$store.dispatch('rpayStacksStore/callContractReadOnly', config).then((result) => {
      this.contractBalance = result.result
    })
  },
  methods: {
    buildSearchIndex: function () {
      this.$store.dispatch('assetGeneralStore/buildSearchIndex').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    buildCache: function () {
      this.$store.dispatch('assetGeneralStore/buildCache').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
