<template>
<div v-if="loaded">
  <!--
  <AddressLookup v-if="childPage === 'addressLookup'"/>
  -->
  <Contracts v-if="!childPage || childPage === 'contracts'"/>
  <ContractForm v-if="childPage === 'contractForm'"/>
  <BuildCache v-if="childPage === 'buildCache'"/>
  <ExploreCache v-if="childPage === 'exploreCache'"/>
  <CacheFilters v-if="childPage === 'cacheFilters'"/>
  <Faucet v-if="childPage === 'faucet'"/>
  <Settings v-if="childPage === 'settings'"/>
</div>
</template>

<script>
import Settings from './components/registry/Settings'
import Faucet from './components/registry/Faucet'
import ContractForm from './components/registry/ContractForm'
import Contracts from './components/registry/Contracts'
import CacheFilters from './components/registry/CacheFilters'
// import AddressLookup from './components/registry/AddressLookup'
import BuildCache from './components/registry/BuildCache'
import ExploreCache from './components/registry/ExploreCache'

export default {
  name: 'ManageRegistry',
  components: {
    Settings,
    ContractForm,
    Contracts,
    Faucet,
    CacheFilters,
    ExploreCache,
    BuildCache
    // AddressLookup
  },
  data () {
    return {
      childPage: null,
      loaded: false
    }
  },
  watch: {
    '$route' () {
      this.childPage = this.$route.params.section
      this.componentKey++
    }
  },
  mounted () {
    this.childPage = this.$route.params.section
    this.loaded = true
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
