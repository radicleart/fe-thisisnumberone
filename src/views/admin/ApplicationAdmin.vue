<template>
<b-container class="text-white my-5 p-4">
  <h1 class="mb-5">Application Administration</h1>
    <b-tabs left content-class="mt-3 text-small">
      <b-tab title="Cache" active>
        <Registry />
      </b-tab>
      <b-tab title="Add Privileges">
        <AddPrivileges />
      </b-tab>
    </b-tabs>
</b-container>
</template>

<script>
import AddPrivileges from '@/components/admin/users/AddPrivileges'
import Registry from '@/components/admin/Registry'

export default {
  name: 'UserAdmin',
  components: {
    AddPrivileges,
    Registry
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
