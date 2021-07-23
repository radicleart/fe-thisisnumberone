<template>
<div v-if="loaded">
  <div class="" v-for="(auth, index) in authorisations" :key="index">
    <div class="d-flex justify-content-between">
      <div>{{auth.stxAddress}}</div>
      <div><b-link variant="info" @click.prevent="openPrivilegeModal(auth)">add privilege</b-link></div>
    </div>
    <b-table striped hover class="bg-light text-dark"
      :items="values(auth)"
      :fields="fields()"
    >
    </b-table>
  </div>
  <b-modal id="privilege-modal">
    <b-row>
      <b-col cols="12">
        <div class="my-4"><b-button class="btn-sm pointer mr-3" variant="info" @click="addPrivilege(priv.name)" v-for="(priv, index) in availablePrivileges" :key="index">{{priv.name}}</b-button></div>
        <div class="my-4 text-right"><b-button class="" variant="warning" @click="saveAuthorisation()">Save</b-button></div>
      </b-col>
    </b-row>
    <template #modal-header="{ close }">
      <div class=" text-warning w-100 d-flex justify-content-end">
        <b-button size="sm" variant="white" @click="close()"  class="m-0 p-1 text-dark" style="max-width: 30px !important; max-height: 30px !important;">
          <img :src="cross" class="filter-black" alt="close" style="max-width: 20px !important; max-height: 20px !important;"/>
        </b-button>
      </div>
    </template>
    <template #modal-footer class="text-center">
      <div class="w-100">
      </div>
    </template>
  </b-modal>
</div>
<div v-else>
  <LoopbombSpinner />
</div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import { APP_CONSTANTS } from '@/app-constants'

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
    openPrivilegeModal (auth) {
      this.modalAuth = auth
      this.$bvModal.show('privilege-modal')
    },
    fields () {
      return ['Domain', 'Privileges']
    },
    values (auth) {
      let mapped = []
      if (auth) mapped = auth.domains.map(function (domain) { return { Domain: domain.host, Privileges: domain.privileges.join(' ') } })
      return mapped
    },
    addPrivilege: function (priv) {
      if (!this.privileges) this.privileges = priv
      else if (this.privileges.indexOf(priv) === -1) {
        this.privileges += ' ' + priv
      } else if (this.privileges.indexOf(' ' + priv) > -1) {
        this.privileges = this.privileges.replace(' ' + priv, '')
      } else {
        this.privileges = this.privileges.replace(priv, '')
      }
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
    availablePrivileges () {
      const ap = this.$store.getters[APP_CONSTANTS.KEY_AVAILABLE_PRIVILEGES]
      return ap
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
