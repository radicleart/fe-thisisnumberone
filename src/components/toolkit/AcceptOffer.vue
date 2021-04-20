<template>
<div  class="mt-3">
  <div class="row">
    <div class="col-12">{{item.name}}</div>
  </div>
  <div class="upload-preview">
    <div class="row mb-4">
      <div class="col-4">Amount</div>
      <div class="col-8">{{offerAmount(offerData.offer.amount)}}</div>
      <div class="col-4">Made</div>
      <div class="col-8">{{offerMade(offerData.offer.madeDate)}}</div>
      <div class="col-12 my-4">Accepting this offer will transfer ownership of the artwork
        <br/><a href="#" @click.prevent="showTransferButton = !showTransferButton">click here to confirm this what you want to do.</a>
      </div>
      <div class="col-4"></div>
      <div class="col-8" v-if="showTransferButton">
        <b-button style="width: 200px;" class="square-btn" @click.prevent="acceptOffer()">ACCEPT OFFER</b-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'AcceptOffer',
  components: {
  },
  props: ['item', 'offerData'],
  data: function () {
    return {
      result: null,
      showTransferButton: false
    }
  },
  methods: {
    acceptOffer: function () {
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        sendAsSky: true,
        nftIndex: this.offerData.nftIndex,
        offerIndex: this.offerData.offerIndex,
        owner: this.offerData.owner,
        recipient: this.offerData.offer.offerer
      }
      return this.$store.dispatch('rpayStacksStore/acceptOffer', data).then((result) => {
        this.result = result
      })
    },
    offerAmount: function (amount) {
      return (amount)
    },
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM-YY hh:mm')
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    }
  }
}
</script>

<style>
</style>
