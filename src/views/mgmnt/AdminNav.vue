<template>
<b-nav vertical class="text-dark" justified>
  <b-nav-item to="/mgmnt/registry">Registry</b-nav-item>
  <b-nav-item to="/mgmnt/manage-privileges">Privileges</b-nav-item>
  <b-nav-item to="/mgmnt/exhibit-requests">Requests</b-nav-item>
  <b-nav-item to="/mgmnt/manage-collections">Collections</b-nav-item>
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
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
