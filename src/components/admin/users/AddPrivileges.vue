<template>
<div v-if="loaded">
  <div class="mb-3" role="group">
    <label for="stxAddress">STX Address :</label>
    <b-form-input
      id="stxAddress"
      v-model="stxAddress"
      :state="stxAddressState"
      aria-describedby="stxAddress-help stxAddress-feedback"
      placeholder="Enter users stx address"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="stxAddress-feedback">
      Valid STX Address
    </b-form-invalid-feedback>
  </div>
  <div class="mb-3" role="group">
    <label for="domain-name">Domain</label>
    <b-form-input
      id="domain-name"
      v-model="domain"
      :state="domainState"
      aria-describedby="domain-help domains-feedback"
      placeholder="Host where these privileges apply"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="domain-feedback">
      Enter the domain where these rules apply
    </b-form-invalid-feedback>
  </div>
  <div class="mb-3" role="group">
    <label for="privileges-name">Privileges, comma separated</label>
    <b-form-input
      id="privileges-name"
      v-model="privileges"
      readonly
      :state="privilegesState"
      aria-describedby="privileges-help privileges-feedback"
      placeholder="List of privileges"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="privileges-feedback">
      Enter the privileges this user can enact
    </b-form-invalid-feedback>
  </div>
  <div class="my-4"><b-button class="btn-sm pointer mr-3" variant="info" @click.prevent="addPrivilege(priv.name)" v-for="(priv, index) in availablePrivileges" :key="index">{{priv.name}}</b-button></div>
  <div class="my-4 text-right"><b-button class="" variant="warning" @click.prevent="saveAuthorisation()">Save</b-button></div>
</div>
<div v-else>
  <LoopbombSpinner />
</div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AddPrivileges',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      formSubmitted: false,
      loaded: false,
      result: null,
      stxAddress: null,
      domain: null,
      privileges: null
    }
  },
  watch: {
    'stxAddress' () {
      this.fetchUserAuthorisation()
    }
  },
  mounted () {
    this.loaded = true
    if (!this.domain) this.domain = location.hostname
    this.$store.dispatch('rpayPrivilegeStore/fetchAvailablePrivileges')
  },
  methods: {
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
    },
    fetchUserAuthorisation: function () {
      if (!this.stxAddress) return
      this.$store.dispatch('rpayPrivilegeStore/fetchUserAuthorisation', { stxAddress: this.stxAddress }).then((result) => {
        this.result = result
      })
    }
  },
  computed: {
    availablePrivileges () {
      return this.$store.getters[APP_CONSTANTS.KEY_AVAILABLE_PRIVILEGES]
    },
    stxAddressState () {
      if (!this.formSubmitted && !this.stxAddress) return null
      return (this.stxAddress && this.stxAddress.length > 2)
    },
    domainState () {
      if (!this.formSubmitted && !this.domain) return null
      return (this.domain && this.domain.length > 2)
    },
    privilegesState () {
      if (!this.formSubmitted && !this.privileges) return null
      return (this.privileges && this.privileges.length > 2)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
