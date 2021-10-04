<template>
<div>
  <div class="bg-black text-white  mb-5 p-4">
    <div class="row mb-5 pb-2">
      <div class="col-12"><h3>Environment Variables</h3></div>
      <div class="col-2">RISIDIO_API</div><div class="col-10">{{RISIDIO_API}}</div>
      <div class="col-2">STX Address</div><div class="col-10">{{STACKS_CONTRACT_ADDRESS}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(STACKS_CONTRACT_ADDRESS)}}</div>
      <div class="col-2">Name</div><div class="col-10">{{STACKS_CONTRACT_NAME}}</div>
      <div class="col-2">Network</div><div class="col-10">{{NETWORK}}</div>
    </div>
    <div class="row mb-5 pb-2">
      <div class="col-12"><h3>Logged In As</h3></div>
      <div class="col-2">Username</div><div class="col-10">{{profile.username}}</div>
      <div class="col-2">STX Address</div><div class="col-10">{{profile.stxAddress}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(profile.stxAddress)}}</div>
    </div>
    <div class="row mb-3" v-if="isLocal">
      <div class="col-2"><b>Mac Wallet</b></div><div class="col-10"></div>
      <div class="col-2">address</div><div class="col-10">{{mac.keyInfo.address}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(mac.keyInfo.address)}}</div>
      <div class="col-2">nonce</div><div class="col-10">{{mac.nonce}}</div>
      <div class="col-2">balance</div><div class="col-10">{{mac.balance}}</div>
    </div>
    <div class="row" v-if="isLocal">
      <div class="col-2"><b>Sky Wallet</b></div><div class="col-10"></div>
      <div class="col-2">address</div><div class="col-10">{{sky.keyInfo.address}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(sky.keyInfo.address)}}</div>
      <div class="col-2">nonce</div><div class="col-10">{{sky.nonce}}</div>
      <div class="col-2">balance</div><div class="col-10">{{sky.balance}}</div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

export default {
  name: 'Settings',
  components: {
  },
  data () {
    return {
      STACKS_CONTRACT_ADDRESS: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      STACKS_CONTRACT_NAME: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      RISIDIO_API: process.env.VUE_APP_RISIDIO_API,
      NETWORK: process.env.VUE_APP_NETWORK,
      contractBalance: -1
    }
  },
  methods: {
    b32Address: function (stxAddress) {
      const b32Address = utils.convertAddressFrom(stxAddress)
      return b32Address[0] + ' : ' + b32Address[1]
    }
  },
  computed: {
    isLocal: function () {
      return location.origin.indexOf('localhost') > -1
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    sky () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      if (!mac) {
        return {
          keyInfo: {}
        }
      }
      return mac
    },
    mac () {
      const sky = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      if (!sky) {
        return {
          keyInfo: {}
        }
      }
      return sky
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-preview {
  padding: 10px;
  height: auto;
  border: 0pt dashed rgb(146, 146, 38);
  background-color: #FCFCFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 9px #00000029;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: normal;
}
</style>
