<template>
<div v-if="loaded">
  <div class="" v-for="(auth, index) in authorisations" :key="index">
    <div class="d-flex justify-content-between">
      <div><b-link :to="'/mgmnt/add-privileges?stxAddress=' + auth.stxAddress">{{auth.stxAddress}}</b-link></div>
    </div>
    <b-table striped hover class="bg-light text-dark"
      :items="values(auth)"
      :fields="fields()"
    >
    </b-table>
  </div>
</div>
<div v-else>
  <LoopbombSpinner />
</div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'

export default {
  name: 'ShowPrivileges',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      loaded: false,
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      authorisations: null,
      modalAuth: null
    }
  },
  watch: {
  },
  mounted () {
    this.$store.dispatch('rpayPrivilegeStore/fetchPrivilegesForAllUsers').then((authorisations) => {
      this.authorisations = authorisations
      this.loaded = true
    })
  },
  methods: {
    fields () {
      return ['Domain', 'Privileges']
    },
    values (auth) {
      let mapped = []
      if (auth) mapped = auth.domains.map(function (domain) { return { Domain: domain.host, Privileges: domain.privileges.join(' ') } })
      return mapped
    },
    saveAuthorisation: function () {
      if (!this.stxAddress) {
        this.$notify({ type: 'warning', title: 'Privileges', text: 'Stacks address is required!' })
        return
      }
      const auth = {
        stxAddress: this.stxAddress,
        domains: [
          {
            host: this.domain,
            privileges: (this.privileges) ? this.privileges.split(' ') : []
          }
        ]
      }
      this.$store.dispatch('rpayPrivilegeStore/saveAuthorisation', auth).then((attributes) => {
        this.result = attributes
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
