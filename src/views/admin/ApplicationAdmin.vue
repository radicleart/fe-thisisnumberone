<template>
<b-container class="text-white my-5 p-4" v-if="loaded">
  <h1 class="mb-5">Application Administration</h1>
  <b-tabs v-model="tabIndex" small card left content-class="mt-3 text-small">
    <b-tab title="Cache">
      <Registry />
    </b-tab>
    <b-tab title="Show Privileges">
      <ShowPrivileges />
    </b-tab>
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
import ExhibitRequests from '@/components/admin/users/ExhibitRequests'
import ShowPrivileges from '@/components/admin/users/ShowPrivileges'
import AddPrivileges from '@/components/admin/users/AddPrivileges'
import Registry from '@/components/admin/cache/Registry'

export default {
  name: 'UserAdmin',
  components: {
    AddPrivileges,
    ShowPrivileges,
    ExhibitRequests,
    Registry
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
    } else if (this.$route.name === 'add-privileges') {
      this.tabIndex = 2
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
