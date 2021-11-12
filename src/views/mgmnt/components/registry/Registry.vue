<template>
<div id="my-nft-tabs">
  <b-tabs card left content-class="">
    <b-tab title="Token Cache" active>
      <TokenList />
    </b-tab>
    <b-tab title="Cache Actions">
      <div class="mt-5 text-center">
        <b-button class="mb-4 w-50 btn-action mr-3" variant="warning" @click="buildCache">Build Cache</b-button>
      </div>
      <div class="text-center">
        <b-button class="mb-4 w-50 btn-action mr-3" variant="warning" @click="buildSearchIndex">Build Search Index</b-button>
      </div>
      <div class="text-center">
        <b-button class="mb-4 w-50 btn-action mr-3" variant="warning" @click="clearCache">Clear Cache</b-button>
      </div>
      <div class="text-center">
        <b-button class="mb-4 w-50 btn-action mr-3" variant="warning" @click="clearSearchIndex">Clear Search Index</b-button>
      </div>
    </b-tab>
    <b-tab title="Faucet">
      <Faucet />
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
import Faucet from './Faucet'
import TokenList from './TokenList'
import TokenFilterList from './TokenFilterList'
import AddressLookup from './AddressLookup'

export default {
  name: 'Registry',
  components: {
    TokenList,
    Faucet,
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
      this.$store.dispatch('rpayManageCacheStore/buildSearchIndex').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    buildCache: function () {
      this.$store.dispatch('rpayManageCacheStore/buildCache').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearSearchIndex: function () {
      this.$store.dispatch('rpayManageCacheStore/clearSearchIndex').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearCache: function () {
      this.$store.dispatch('rpayManageCacheStore/clearCache').then((result) => {
        this.$notify({ type: 'success', title: 'clear indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'clear indexing', text: err })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
