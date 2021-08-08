<template>
<div v-if="!registry">
  <p>No applciation registry detected - are the contracts deployed?</p>
</div>
<div v-else>
  <div class="upload-preview bg-info text-white  my-5 p-4" v-if="registry">
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
    <div class="row mb-3">
      <div class="col-2"><b>Mac Wallet</b></div><div class="col-10"></div>
      <div class="col-2">address</div><div class="col-10">{{mac.keyInfo.address}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(mac.keyInfo.address)}}</div>
      <div class="col-2">nonce</div><div class="col-10">{{mac.nonce}}</div>
      <div class="col-2">balance</div><div class="col-10">{{mac.balance}}</div>
    </div>
    <div class="row">
      <div class="col-2"><b>Sky Wallet</b></div><div class="col-10"></div>
      <div class="col-2">address</div><div class="col-10">{{sky.keyInfo.address}}</div>
      <div class="col-2">b32 address</div><div class="col-10">{{b32Address(sky.keyInfo.address)}}</div>
      <div class="col-2">nonce</div><div class="col-10">{{sky.nonce}}</div>
      <div class="col-2">balance</div><div class="col-10">{{sky.balance}}</div>
    </div>
  </div>
  <div class="upload-preview bg-info text-white my-5 p-4" v-if="registry">
    <div class="row border-bottom mb-3 pb-2">
      <div class="col-12"><h3>Contract Data</h3></div>
      <div class="col-2">Administrator</div><div class="col-10">{{registry.administrator}}</div>
      <div class="col-2">Balance</div><div class="col-10">{{contractBalance}}</div>
      <div class="col-2">Admin Contract Address</div><div class="col-10">{{registry.adminContractAddress}}</div>
      <div class="col-2">Admin Contract Name</div><div class="col-10">{{registry.adminContractName}}</div>
      <div class="col-2">Apps Connected</div><div class="col-10">{{registry.appCounter}}</div>
    </div>
    <div class="row border-bottom" v-for="(application, index) in registry.applications" :key="index">
      <div class="col-2">Contract Id</div><div class="col-10">{{application.contractId}}</div>
      <div class="col-2">Owner</div><div class="col-10">{{application.owner}}</div>
      <div class="col-2">App Index</div><div class="col-10">{{application.appIndex}}</div>
      <div class="col-2">Storage</div><div class="col-10">{{application.storageModel}}</div>
      <div class="col-2">Status</div><div class="col-10">{{application.status}}</div>
      <div class="row mx-5 my-5" v-if="application.tokenContract">
        <div class="col-2">Token Contract</div><div class="col-10 text-bold">{{application.tokenContract.tokenSymbol}} - {{application.tokenContract.tokenName}}</div>
        <div class="col-2">Base URL</div><div class="col-10">{{application.tokenContract.baseTokenUri}}</div>
        <div class="col-2">administrator</div><div class="col-10">{{application.tokenContract.administrator}}</div>
        <div class="col-2">Platform Fee</div><div class="col-10">{{application.tokenContract.platformFee}}</div>
        <div class="col-2">Mint Fee</div><div class="col-10">{{application.tokenContract.mintPrice}}</div>
      </div>
    </div>
    <GaiaAssetCache />
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'
import GaiaAssetCache from './GaiaAssetCache'

export default {
  name: 'TokenList',
  components: {
    GaiaAssetCache
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
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      if (!registry) return {}
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
