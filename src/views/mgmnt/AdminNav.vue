<template>
<b-nav vertical class="text-dark" justified>
  <b-nav-item to="/mgmnt">Registry</b-nav-item>
  <ul>
    <!--
    <li><b-nav-item to="/mgmnt/registry/addressLookup" :class="getClass('addressLookup')">Addresses</b-nav-item></li>
    -->
    <li><b-nav-item to="/mgmnt/registry/contracts" :class="getClass('contracts')">Contracts</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/deployContract" :class="getClass('deployContract')">Deploy Contract</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/buildCache" :class="getClass('buildCache')">Build Cache</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/contractForm" :class="getClass('contractForm')">Contract Update</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/exploreCache" :class="getClass('exploreCache')">Explore Cache</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/cacheFilters" :class="getClass('cacheFilters')">Cache Filters</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/faucet" :class="getClass('faucet')">Faucet</b-nav-item></li>
    <li><b-nav-item to="/mgmnt/registry/settings" :class="getClass('settings')">Settings</b-nav-item></li>
  </ul>
  <b-nav-item to="/mgmnt/manage-privileges">Privileges</b-nav-item>
  <b-nav-item to="/mgmnt/exhibit-requests">Requests</b-nav-item>
  <b-nav-item to="/mgmnt/manage-collections">Collections</b-nav-item>
  <b-nav-item to="/mgmnt/manage-offers">Offers</b-nav-item>
</b-nav>
</template>

<script>

export default {
  name: 'AdminNav',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    getClass (key) {
      return (this.$route.params.section === key) ? 'text-info' : 'text-white'
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
