<template>
<div class="row mt-5" v-if="!loading">
  <div class="col-12 mb-3">
    <div class="mb-5">
      <h3>Sale Type: Bidding</h3>
    </div>
    <div role="group">
      <label for="input-live"><span class="text2">Starting Price</span></label>
      <b-input-group>
        <b-form-input @change="updateBuyNowOrStartingPrice" v-model="buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6">
    <div role="group">
      <label for="input-live"><span class="text2">Reserve Price</span></label>
      <b-input-group class="mb-3">
        <b-form-input @change="updateReservePrice" v-model="reservePrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6">
    <div role="group">
      <label for="input-live"><span class="text2">Increment</span></label>
      <b-input-group class="mb-3">
        <b-form-input @change="updateIncrementPrice" v-model="incrementPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-12 mb-3">
    <div role="group">
      <label for="input-live"><span class="text2">Bidding Ends</span></label>
      <datetime format="DD-MM-YYYY h:m:s" width="300px" v-model="biddingEndTime"></datetime>
    </div>
  </div>
</div>
</template>

<script>
import datetime from 'vuejs-datetimepicker'
import { DateTime } from 'luxon'

export default {
  name: 'AuctionTradeInfo',
  components: {
    datetime
  },
  props: ['contractAsset'],
  data () {
    return {
      biddingEndTime: '',
      errorMessage: null,
      loading: true,
      saleType: 2,
      incrementPrice: 1,
      buyNowOrStartingPrice: 0,
      reservePrice: 0
    }
  },
  mounted () {
    this.buyNowOrStartingPrice = this.contractAsset.saleData.buyNowOrStartingPrice
    this.reservePrice = this.contractAsset.saleData.reservePrice
    this.incrementPrice = this.contractAsset.saleData.incrementPrice
    this.saleType = 2
    const now = DateTime.now()
    if (this.contractAsset.saleData.biddingEndTime && this.contractAsset.saleData.biddingEndTime > 0) {
      this.biddingEndTime = now.setZone('Europe/Paris').plus({ weeks: 6 }).endOf('day').toLocaleString(DateTime.DATETIME)
    } else {
    }
    this.biddingEndTime = now.setZone('Europe/Paris').plus({ weeks: 2 }).endOf('day').toFormat('yy/MM/dd')
    this.loading = false
  },
  methods: {
    updateBuyNowOrStartingPrice: function () {
      // this.$emit('updateSaleDataInfo', { moneyField: true, field: 'buyNowOrStartingPrice', value: this.buyNowOrStartingPrice })
      this.contractAsset.saleData.buyNowOrStartingPrice = Number(this.buyNowOrStartingPrice)
    },
    updateReservePrice: function () {
      // this.$emit('updateSaleDataInfo', { moneyField: true, field: 'reservePrice', value: this.reservePrice })
      this.contractAsset.saleData.reservePrice = Number(this.reservePrice)
    },
    updateIncrementPrice: function () {
      // this.$emit('updateSaleDataInfo', { moneyField: true, field: 'incrementPrice', value: this.incrementPrice })
      this.contractAsset.saleData.incrementPrice = Number(this.incrementPrice)
    },
    updateBiddingEndTime: function () {
      const localTime = this.biddingEndTime
      // this.$emit('updateSaleDataInfo', { field: 'biddingEndTime', value: localTime })
      this.contractAsset.saleData.biddingEndTime = this.biddingEndTime
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
