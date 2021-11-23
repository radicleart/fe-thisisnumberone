<template>
<div  class="mt-5">
  <div class="">
    <div class="row mb-4">
      <div class="col-12">Transfer this NFT to another address</div>
    </div>
    <div class="row mb-4" v-if="trackingUrl">
      <div class="col-12">Transferring - <a :href="trackingUrl" target="_blank">track progress here...</a></div>
    </div>
    <div class="row mb-4" v-else-if="transferring">
      <div class="col-12">Transfer begun</div>
    </div>
    <div class="row mb-4" v-else>
      <div class="col-12 mb-3">
        <b-input-group append="ADDR">
          <b-form-input class="stx-address" id="toAddress" :state="showTransferButton" v-model="toAddress" placeholder="The recipients Stacks Wallet address"></b-form-input>
        </b-input-group>
        <p class="my-3 text-danger" v-html="errorMessage">Enter the recipients {{network}} stacks address</p>
      </div>
      <div class="col-12 text-right" v-if="showTransferButton">
        <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'danger' }" :title="'Transfer this NFT to another address - can\'t be undone!'" class="text-white mr-3" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
        <b-button variant="outline-warning" style="width: 170px;" @click="transferNft()">Transfer NFT</b-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'TransferNft',
  components: {
  },
  props: ['item', 'loopRun'],
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
      const contractAsset = this.item.contractAsset
      const data = {
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: this.loopRun.contractId.split('.')[1],
        nftIndex: contractAsset.nftIndex,
        sendAsSky: true,
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
#toAddress {
  font-size: 1.0rem !important;
}
</style>
