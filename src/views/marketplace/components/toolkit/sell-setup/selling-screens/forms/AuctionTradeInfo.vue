<template>
<div class="row mt-5" v-if="!loading">
  <div class="col-12 mb-3">
    <div class="mb-5">
      <h3>Sale Type: Bidding</h3>
    </div>
    <div role="group">
      <label for="input-live"><span class="text2">Starting Price</span></label>
      <b-input-group>
        <b-form-input @change="updateBuyNowOrStartingPrice" v-model="mySaleData.buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6">
    <div role="group">
      <label for="input-live"><span class="text2">Reserve Price</span></label>
      <b-input-group class="mb-3">
        <b-form-input @change="updateReservePrice" v-model="mySaleData.reservePrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6">
    <div role="group">
      <label for="input-live"><span class="text2">Increment</span></label>
      <b-input-group class="mb-3">
        <b-form-input @change="updateIncrementPrice" v-model="mySaleData.incrementPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-12 mb-3">
    <div role="group">
      <label for="input-live"><span class="text2">Bidding Ends</span></label>
      <datetime type="datetime" input-id="biddingEndTime1" v-model="mySaleData.biddingEndTime">
        <input @change="updateBiddingEndTime" id="biddingEndTime" style="border-radius: 24px !important;">
      </datetime>
      <!-- {{getLongTime()}} -->
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'

export default {
  name: 'SellAuction',
  components: {
    Datetime
  },
  props: ['contractAsset', 'submitData'],
  watch: {
    'biddingEndTime' () {
      this.updateBiddingEndTime()
    }
  },
  data () {
    return {
      mySaleData: {
        biddingEndTime: null,
        incrementPrice: 1,
        buyNowOrStartingPrice: 0,
        reservePrice: 0
      },
      loading: true,
      saleType: 2,
      errorMessage: null
    }
  },
  mounted () {
    this.buyNowOrStartingPrice = this.contractAsset.saleData.buyNowOrStartingPrice
    this.incrementPrice = this.contractAsset.saleData.incrementPrice
    this.reservePrice = this.contractAsset.saleData.reservePrice
    if (this.contractAsset.saleData && this.contractAsset.saleData.biddingEndTime) {
      let loaclEndM = moment(this.contractAsset.saleData.biddingEndTime)
      if (loaclEndM.isBefore(moment({}))) {
        loaclEndM = moment({}).add(2, 'days')
      }
      const loaclEnd = loaclEndM.format()
      this.mySaleData.biddingEndTime = loaclEnd
    } else {
      const dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.mySaleData.biddingEndTime = dd.format()
    }
    this.contractAsset.saleData = this.mySaleData
    this.loading = false
  },
  methods: {
    updateBuyNowOrStartingPrice: function () {
      this.contractAsset.saleData.buyNowOrStartingPrice = parseInt(this.buyNowOrStartingPrice)
    },
    updateReservePrice: function () {
      this.contractAsset.saleData.reservePrice = parseInt(this.reservePrice)
    },
    updateIncrementPrice: function () {
      this.contractAsset.saleData.incrementPrice = parseInt(this.incrementPrice)
    },
    updateBiddingEndTime: function () {
      const localTime = moment(this.biddingEndTime).valueOf()
      this.contractAsset.saleData.biddingEndTime = localTime
    },
    checkEndTime () {
      const now = moment().unix()
      const diff = this.biddingEndTime - now
      return diff > 0
    },
    getLongTime () {
      return moment(this.biddingEndTime).valueOf()
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
