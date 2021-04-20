<template>
<div  class="mt-3">
  <div class="">
    <div class="row mb-4" v-if="trackingUrl">
      <div class="col-12">Transferring - <a :href="trackingUrl" target="_blank">track progress here...</a></div>
    </div>
    <div class="row mb-4" v-else-if="transferring">
      <div class="col-12">Transfer begun</div>
    </div>
    <div class="row mb-4" v-else>
      <div class="col-12">
        <b-input-group append="ADDR">
          <b-form-input id="toAddress" :state="showTransferButton" v-model="toAddress" placeholder="valid stacks address"></b-form-input>
        </b-input-group>
        <p class="text-small text-info">Enter the recipients {{network}} stacks address</p>
        <p class="text-small text-danger" v-html="errorMessage">Enter the recipients {{network}} stacks address</p>
      </div>
      <div class="col-12 text-right" v-if="showTransferButton">
        <b-button style="width: 200px;" class="square-btn" @click.prevent="transferNft()">Transfer NFT</b-button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12"><b-alert show variant="danger"><u>About Transferring NFTs</u><br/>once transferred you will no longer have any control over this asset - this can't be undone</b-alert></div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'TransferNft',
  components: {
  },
  props: ['assetHash'],
  data: function () {
    return {
      toAddress: null,
      errorMessage: null,
      network: NETWORK,
      result: {},
      transferring: false
    }
  },
  methods: {
    transferNft: function () {
      this.transferring = 'transfer started...'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        nftIndex: contractAsset.nftIndex,
        owner: contractAsset.owner,
        recipient: this.toAddress
      }
      return this.$store.dispatch('rpayStacksStore/transferAsset', data).then((result) => {
        this.transferring = null
        this.result = result
      }).catch((err) => {
        this.transferring = err
      })
    }
  },
  computed: {
    showTransferButton () {
      return (this.toAddress && this.toAddress.length > 10)
    },
    trackingUrl () {
      if (!this.result || !this.result.txId) return
      return this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.result.txId)
    }
  }
}
</script>

<style>
</style>
