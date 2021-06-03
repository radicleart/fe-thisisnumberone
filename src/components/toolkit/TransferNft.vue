<template>
<div  class="mt-5" id="transfer-nft">
  <div class="">
    <div class="row mb-2">
      <div class="col-12"><h5>Transfer NFT to new owner</h5></div>
    </div>
    <div class="row mb-4" v-if="trackingUrl">
      <div class="col-12">Transferring - <a :href="trackingUrl" target="_blank">track progress here...</a></div>
    </div>
    <div class="row mb-4" v-else-if="transferring">
      <div class="col-12">Transfer begun</div>
    </div>
    <div class="row mb-4" v-else>
      <div class="col-12 mb-3">
        <b-input-group append="STX ADDR">
          <b-form-input style="height: 40px;" id="toAddress" :state="showTransferButton" v-model="toAddress" placeholder="The recipients Stacks Wallet address"></b-form-input>
        </b-input-group>
        <p class="my-3 text-danger" v-html="errorMessage">Enter the recipients {{network}} stacks address</p>
      </div>
      <div class="col-12 text-right" v-if="showTransferButton">
        <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="ttTransfers" class="text-white mr-3" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
        <square-button @clickButton="transferNft()" :theme="'light'" :label1="'TRANSFER NFT'" :icon="'eye'"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SquareButton from '@/components/utils/SquareButton'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'TransferNft',
  components: {
    SquareButton
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
      return this.$store.dispatch('rpayPurchaseStore/transferAsset', data).then((result) => {
        this.transferring = null
        this.result = result
      }).catch((err) => {
        this.transferring = err
      })
    }
  },
  computed: {
    ttTransfers () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-transfers')
      return (tooltip) ? tooltip[0].text : ''
    },
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
#transfer-nft .input-group-append .input-group-text {
  width: 80px !important;
  text-align: center;
}

</style>
