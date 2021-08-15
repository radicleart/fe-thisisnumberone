<template>
<b-card-text class="text-center mx-4" v-if="editingNetwork">
  <div class="text-center text-bold">Select a network</div>
  <div class="mt-3 mx-5">
    <span v-for="(option, index) in networks" :key="index">
      <b-button @click="changeNetwork(option.network)" variant="warning" :class="(preferredNetwork === option.network) ? 'no-option-on mb-4' : 'no-option-off mb-4'"><span>{{option.network}}</span></b-button>
    </span>
  </div>
  <div class="text-small text-left">
    <p>Contract Address: {{network.contractAddress}}</p>
    <p>Contract Name: {{network.contractName}}</p>
    <p>Minting Function: {{network.functionName}}</p>
  </div>
</b-card-text>
<b-card-text class="text-center mx-4" v-else>
  <div class="text-center text-bold">{{preferredNetwork}}  <a v-if="allowEdit && networks.length > 1" href="#" class="text-info" @click.prevent="editNetwork()"><b-icon icon="pencil"/></a></div>
</b-card-text>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'NetworkOptions',
  components: {
  },
  props: ['allowEdit'],
  data () {
    return {
      editingNetwork: false
    }
  },
  methods: {
    changeNetwork: function (method) {
      this.$store.commit(APP_CONSTANTS.SET_PREFERRED_NETWORK_VALUE, method)
      this.editingNetwork = false
    },
    editNetwork: function () {
      this.editingNetwork = true
    }
  },
  computed: {
    networks: function () {
      const networks = this.$store.getters[APP_CONSTANTS.KEY_ENABLED_NETWORKS]
      return networks
    },
    preferredNetwork () {
      const preferredNetwork = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      return preferredNetwork.network
    },
    network () {
      const preferredNetwork = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      return preferredNetwork
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
