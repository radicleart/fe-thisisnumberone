<template>
<div class="row" v-if="!loading">
  <div class="col-12 mb-5">
    <div class="mb-5">
      <h3>Sale Type: {{saleDataDesc()}}</h3>
    </div>
    <div class="col-12 mb-5">
      <div role="group">
        <label for="input-live"><span class="text2">Reserve Price</span></label>
        <b-input-group class="mb-3">
          <b-form-input @keyup="toDecimals('reservePrice')" @change="updateReservePrice" v-model="reservePrice" class="input" placeholder="STX"></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="col-12 mb-3">
      <div role="group">
        <label for="input-live"><span class="text2">Offers End</span></label>
        <datetime type="datetime" input-id="biddingEndTime1" v-model="biddingEndTime">
          <input @change="updateBiddingEndTime()" id="biddingEndTime" style="border-radius: 24px !important;">
        </datetime>
        <!-- {{getLongTime()}} -->
      </div>
    </div>
    <div><p class="text-danger" v-html="errorMessage"></p></div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import { Datetime } from 'vue-datetime'

export default {
  name: 'OfferTradeInfo',
  components: {
    Datetime
  },
  watch: {
    'biddingEndTime' () {
      this.updateBiddingEndTime()
    }
  },
  data () {
    return {
      loading: true,
      offerAmount: 0,
      errorMessage: null,
      reservePrice: 0,
      biddingEndTime: null,
      saleType: 3
    }
  },
  mounted () {
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
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
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 3 })
    this.loading = false
  },
  methods: {
    toDecimals: function () {
      if (this.reservePrice !== 0) this.reservePrice = Math.round(this.reservePrice * 100) / 100
    },
    saleDataDesc: function () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return (!configuration.gaiaAsset.offerCounter) ? 'Make Offer' : configuration.gaiaAsset.offerCounter + ' Offers Made'
    },
    updateBiddingEndTime: function () {
      const localTime = moment(this.biddingEndTime).valueOf()
      this.$emit('updateSaleDataInfo', { field: 'biddingEndTime', value: localTime })
    },
    updateReservePrice: function () {
      this.$emit('updateSaleDataInfo', { moneyField: true, field: 'reservePrice', value: this.reservePrice })
    }
  },
  computed: {
    gaiaAsset () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return configuration.gaiaAsset
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
