<template>
<div  class="mt-3">
  <div class="row">
    <!-- <div class="col-12 mb-4">Reserve price: {{fromMicroAmount()}} STX</div> -->
    <div class="col-12">Enter the recipients {{network}} stacks address <br/> <b-alert show variant="danger">once transferred you will no longer have any control over this asset - this can't be undone</b-alert></div>
  </div>
  <div class="upload-preview">
    <div class="row mb-4">
      <div class="col-12">
        <b-input-group size="sm" append="ADDR">
          <b-form-input id="toAddress" :state="showTransferButton" v-model="toAddress" placeholder="valid stacks address"></b-form-input>
        </b-input-group>
        <p class="text-small text-danger" v-html="errorMessage"></p>
      </div>
      <div class="col-12 text-right" v-if="showTransferButton">
        <b-button style="width: 200px;" class="square-btn" @click.prevent="transferNft()">Transfer NFT</b-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

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
      network: NETWORK
    }
  },
  methods: {
    fromMicroAmount: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return utils.fromMicroAmount(contractAsset.saleData.reservePrice)
    },
    transferNft: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        nftIndex: contractAsset.nftIndex,
        owner: contractAsset.owner,
        recipient: this.toAddress
      }
      return this.$store.dispatch('rpayStacksStore/transferAsset', data).then((result) => {
        this.result = result
      })
    }
  },
  computed: {
    showTransferButton () {
      return (this.toAddress && this.toAddress.length > 10)
    }
  }
}
</script>

<style>
</style>
