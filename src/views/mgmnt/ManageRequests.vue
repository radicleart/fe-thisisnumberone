<template>
<div class="text-white">
  <h1 class="mb-4 text-white">Manage Artwork Requests</h1>
  <ExhibitRequests />
</div>
</template>

<script>
import ExhibitRequests from '@/views/mgmnt/components/users/ExhibitRequests'

export default {
  name: 'ManageRequests',
  components: {
    ExhibitRequests
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
