<template>
<div v-if="buyNowDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{buyNowDialog[0].text}}</h1>
      <h4 class="mb-5">{{buyNowDialog[1].text}} <b>{{fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="6" sm="12" v-if="buyNowDialog[3]">
      <p v-html="buyNowDialog[3].text"></p>
    </b-col>
    <b-col md="6" sm="12" v-else>
      <p v-if="buyNowDialog[2]">{{buyNowDialog[2].text}}</p>
      <p v-if="buyNowDialog[3]">{{buyNowDialog[3].text}}
      </p>
    </b-col>
    <b-col md="6" sm="12" style="">
      <div>
        <h1>
          <span v-if="isOpeneningBid" class="">Place Bid: </span>
          <span v-else class="">Place Bid: </span>
          <span class="">{{currentBidAmountFmt}}</span> STX
        </h1>
      </div>
      <div class="text-small">
        <rates-listing :message="''" :amount="currentBidAmount"/>
      </div>
    </b-col>
  </b-row>
  <ActionRow :buttonLabel="'BID: ' + nextBidAmountFmt + ' STX'" @clickButton="$emit('placeBid')" :svgImage="hammer"/>
</div>
</template>

<script>
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'
import RatesListing from '@/views/marketplace/components/toolkit/RatesListing'

export default {
  name: 'PurchasePlaceBid',
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
      return 'Place a bid for ' + this.nextBidAmountFmt + ' STX'
    }
  },
  computed: {
    currentBidAmountFmt () {
      const bid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      // const currentBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](this.contractAsset)
      return bid.amountFmt
    },
    currentBidAmount () {
      const bid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      // const currentBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](this.contractAsset)
      return bid.amount
    },
    nextBidAmountFmt () {
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      if (this.isOpeneningBid) {
        return this.currentBidAmountFmt
      }
      return nextBid.amountFmt
    },
    isOpeneningBid () {
      // simple case - no bids ever
      if (this.contractAsset.bidCounter === 0 || !this.contractAsset.bidHistory || this.contractAsset.bidHistory.length === 0) {
        return true
      }
      // less simple case - start of a new sale cycle
      const index = this.contractAsset.bidHistory.findIndex((o) => o.saleCycle === this.contractAsset.saleData.saleCycleIndex)
      return index === -1
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
