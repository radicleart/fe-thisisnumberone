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
      <datetime type="datetime" input-id="biddingEndTime1" v-model="biddingEndTime">
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
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SellAuction',
  components: {
    Datetime
  },
  props: ['submitData'],
  watch: {
    'biddingEndTime' () {
      this.updateBiddingEndTime()
    }
  },
  data () {
    return {
      biddingEndTime: null,
      errorMessage: null,
      loading: true,
      saleType: 2,
      incrementPrice: 1,
      buyNowOrStartingPrice: 0,
      reservePrice: 0
    }
  },
  mounted () {
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
    this.buyNowOrStartingPrice = configuration.gaiaAsset.saleData.buyNowOrStartingPrice
    this.incrementPrice = configuration.gaiaAsset.saleData.incrementPrice
    this.reservePrice = configuration.gaiaAsset.saleData.reservePrice
    if (configuration.gaiaAsset.saleData && configuration.gaiaAsset.saleData.biddingEndTime) {
      let loaclEndM = moment(configuration.gaiaAsset.saleData.biddingEndTime)
      if (loaclEndM.isBefore(moment({}))) {
        loaclEndM = moment({}).add(2, 'days')
      }
      const loaclEnd = loaclEndM.format()
      this.biddingEndTime = loaclEnd
    } else {
      const dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.biddingEndTime = dd.format()
    }
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 2 })
    this.loading = false
  },
  methods: {
    updateBuyNowOrStartingPrice: function () {
      this.$emit('updateSaleDataInfo', { moneyField: true, field: 'buyNowOrStartingPrice', value: this.buyNowOrStartingPrice })
    },
    updateReservePrice: function () {
      this.$emit('updateSaleDataInfo', { moneyField: true, field: 'reservePrice', value: this.reservePrice })
    },
    updateIncrementPrice: function () {
      this.$emit('updateSaleDataInfo', { moneyField: true, field: 'incrementPrice', value: this.incrementPrice })
    },
    updateBiddingEndTime: function () {
      const localTime = moment(this.biddingEndTime).valueOf()
      this.$emit('updateSaleDataInfo', { field: 'biddingEndTime', value: localTime })
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
