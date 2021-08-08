<template>
<div class=" text-small mx-5 mt-4">
  <div class="row text-small">
    <div class="col-2">Sale Type</div><div class="col-2">{{contractAsset.saleData.saleType}}</div>
    <div class="col-2">Cycle</div><div class="col-2">{{contractAsset.saleData.saleCycleIndex}}</div>
    <div class="col-2">Amount</div><div class="col-2">{{contractAsset.saleData.buyNowOrStartingPrice}}</div>
    <div class="col-2">Reserve</div><div class="col-2">{{contractAsset.saleData.reservePrice}}</div>
    <div class="col-2">Increment</div><div class="col-2">{{contractAsset.saleData.incrementPrice}}</div>
    <div class="col-2">biddingEndTime</div><div class="col-2">{{appTimestamp(contractAsset.saleData.biddingEndTime)}}</div>
  </div>
  <div class="row text-small text-right">
    <div class="col-12">
      <a class="text-white mr-5" href="#" @click.prevent="closeBidding(1)">Transfer & Close</a>
      <a class="text-white" href="#" @click.prevent="closeBidding(2)">Refund & Close</a>
    </div>
  </div>
  <div class=" text-small">
    <b-table striped hover class="bg-light text-dark"
      :items="valuesAll()"
      :fields="fields()"
    >
    </b-table>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'BidHistory',
  components: {
  },
  props: ['item'],
  data: function () {
    return {
      dbOffers: null
    }
  },
  methods: {
    fields () {
      return ['Bidder', 'Amount', 'Made', 'Cycle']
    },
    values () {
      let mapped = []
      const $self = this
      if (this.contractAsset.cycledBidHistory) mapped = this.contractAsset.cycledBidHistory.map(function (bid) { return { Bidder: bid.bidder, Amount: bid.amount, Made: $self.appTimestamp(bid.appTimestamp), Cycle: bid.saleCycle } })
      return mapped
    },
    valuesAll () {
      let mapped = []
      const $self = this
      mapped = this.contractAsset.bidHistory.map(function (bid) { return { Bidder: bid.bidder, Amount: bid.amount, Made: $self.appTimestamp(bid.appTimestamp), Cycle: bid.saleCycle } })
      return mapped
    },
    closeBidding: function (closeType) {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        nftIndex: contractAsset.nftIndex,
        closeType: closeType,
        functionName: 'close-bidding'
      }
      this.$store.dispatch('rpayPurchaseStore/closeBidding', data).then((result) => {
        this.result = result
      })
    },
    winner: function (bid) {
      return bid
    },
    appTimestamp: function (madeData) {
      return moment(madeData * 1000).format('DD-MM hh:mm')
    }
  },
  computed: {
    contractAsset () {
      return this.item.contractAsset
    }
  }
}
</script>

<style>
</style>
