<template>
<div>
<div v-if="registry">
  <div class="col-12"><h1>Contract Data</h1></div>
  <div class="upload-preview bg-black text-white">
    <div class="mb-5 row border-bottom mb-3 pb-2">
      <div class="col-2">Contract Id</div><div class="col-10 text-bold ">{{registry.adminContractAddress + '.' + registry.adminContractName}}</div>
      <div class="col-2">Administrator</div><div class="col-10">{{registry.administrator}}</div>
      <div class="col-2">Balance</div><div class="col-10">{{contractBalance}}</div>
      <div class="col-2">Apps Connected</div><div class="col-10">{{registry.appCounter}}</div>
    </div>
    <div class="row mb-4" v-for="(application, index) in registry.applications" :key="index">
      <div class="col-2">Contract Id</div><div class="col-10 text-bold ">{{application.contractId}}</div>
      <div class="col-2">Owner</div><div class="col-10">{{application.owner}}</div>
      <div class="col-2">App Index</div><div class="col-2">{{application.appIndex}}</div>
      <div class="col-2">Storage</div><div class="col-2">{{application.storageModel}}</div>
      <div class="col-2">Status</div><div class="col-2">{{application.status}}</div>
      <div class="col-2">administrator</div><div class="col-10">{{application.tokenContract.administrator}}</div>
      <div class="col-2">Mint Fee</div><div class="col-10">{{application.tokenContract.mintPrice}}</div>
      <div class="col-2">Mint Counter</div><div class="col-10">{{application.tokenContract.mintCounter}}</div>
    </div>
    <GaiaAssetCache v-if="showTokens"/>
  </div>
</div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'
import GaiaAssetCache from './GaiaAssetCache'

export default {
  name: 'ExploreCache',
  components: {
    GaiaAssetCache
  },
  data () {
    return {
      STACKS_CONTRACT_ADDRESS: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      STACKS_CONTRACT_NAME: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      RISIDIO_API: process.env.VUE_APP_RISIDIO_API,
      NETWORK: process.env.VUE_APP_NETWORK,
      contractBalance: -1,
      showTokens: false
    }
  },
  mounted () {
    const config = {
      contractAddress: this.STACKS_CONTRACT_ADDRESS,
      contractName: this.STACKS_CONTRACT_NAME,
      functionName: 'get-balance',
      functionArgs: []
    }
    this.$store.dispatch('rpayStacksStore/callContractReadOnly', config).then((result) => {
      this.contractBalance = result.result
    })
  },
  methods: {
    b32Address: function (stxAddress) {
      const b32Address = utils.convertAddressFrom(stxAddress)
      return b32Address[0] + ' : ' + b32Address[1]
    },
    gaiaAsset (hash) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](hash)
      return gaiaAsset
    }
  },
  computed: {
    isLocal: function () {
      return location.origin.indexOf('localhost') > -1
    },
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      return registry
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
