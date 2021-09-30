<template>
<b-container class="text-white my-5 p-4" v-if="loaded">
  <h1 class="mb-5">Application Administration</h1>
  <b-row align-h="center" :style="'min-height: 80vh'">
    <b-col lg="4" sm="4">
      <AdminNav/>
    </b-col>
    <b-col lg="5" sm="10">
    </b-col>
  </b-row>


  <b-tabs v-model="tabIndex" justified card left content-class="mt-3 text-small">
    <b-tab title="Add Privileges">
      <AddPrivileges />
    </b-tab>
    <b-tab title="Exhibit Requests">
      <ExhibitRequests />
    </b-tab>
  </b-tabs>
</b-container>
</template>

<script>
import AdminNav from '@/views/mgmnt/AdminNav'
import ExhibitRequests from '@/views/mgmnt/components/users/ExhibitRequests'
import AddPrivileges from '@/views/mgmnt/components/users/AddPrivileges'

export default {
  name: 'ApplicationAdmin',
  components: {
    AdminNav,
    AddPrivileges,
    ExhibitRequests
  },
  data () {
    return {
      tabIndex: 0,
      loaded: false
    }
  },
  mounted () {
    this.$store.dispatch('rpayPrivilegeStore/fetchAvailablePrivileges')
    if (this.$route.name === 'exhibit-requests') {
      this.tabIndex = 3
    } else if (this.$route.name === 'manage-privileges') {
      this.tabIndex = 2
    } else if (this.$route.name === 'manage-loopruns' || this.$route.name === 'manage-looprun') {
      this.tabIndex = 4
    }
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
