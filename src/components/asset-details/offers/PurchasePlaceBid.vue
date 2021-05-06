<template>
<div v-if="buyNowDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{buyNowDialog[0].text}}</h1>
      <h4 class="mb-5">{{buyNowDialog[1].text}} <b>{{fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="4" sm="12">
      <p v-if="buyNowDialog[2]">{{buyNowDialog[2].text}}</p>
      <p v-if="buyNowDialog[3]">{{buyNowDialog[3].text}}
      </p>
    </b-col>
    <b-col md="5" sm="6" style="border-right: 1pt solid #000;">
      <div>
        <h3>
          <span v-if="contractAsset.bidCounter > 0" class="">Current Bid: </span>
          <span v-else class="">Opening Bid: </span>
          <span class="">{{currentBidAmount}}</span> STX
        </h3>
      </div>
      <div class="text-small">
        <rates-listing :message="''" :amount="currentBidAmount"/>
      </div>
    </b-col>
    <b-col md="2" sm="4" class="text-small" style="border-left: 1pt solid #000;">
      <div>{{rateMessage()}}</div>
    </b-col>
  </b-row>
  <action-row :buttonLabel="'BID: ' + nextBidAmount + ' STX'" @clickButton="$emit('placeBid')" :svgImage="hammer"/>
</div>
</template>

<script>
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'
import RatesListing from '@/components/toolkit/RatesListing'

export default {
  name: 'PurchaseBuyNow',
  components: {
    ActionRow,
    RatesListing
  },
  props: ['contractAsset'],
  data () {
    return {
      hammer: require('@/assets/img/auction.svg'),
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      return 'Place a bid for ' + this.nextBidAmount + ' STX'
    }
  },
  computed: {
    currentBidAmount () {
      const currentBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](this.contractAsset)
      return currentBid.amount
    },
    nextBidAmount () {
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      return nextBid.amount
    },
    reserveMet () {
      const currentBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](this.contractAsset)
      return currentBid.reserveMet
    },
    buyNowDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('place-bid')
      return dialog
    },
    fbet () {
      return this.$store.getters[APP_CONSTANTS.KEY_FORMATTED_BIDDING_END_TIME](this.contractAsset)
    }
  }
}
</script>
<style lang="scss" scoped>
.input-group-text {
  background: #fff;
  color: #000;
}
</style>
