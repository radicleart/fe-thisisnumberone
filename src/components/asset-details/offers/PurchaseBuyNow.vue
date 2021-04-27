<template>
<div v-if="buyNowDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{buyNowDialog[0].text}}</h1>
      <h4 class="mb-5">{{buyNowDialog[1].text}} <b>{{offerData.fbet}}</b></h4>
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
        <h3><span class="mr-5 text-black">Buy Now</span> {{saleData.buyNowOrStartingPrice}} STX</h3>
      </div>
    </b-col>
    <b-col md="3" sm="6" style="font-size: 0.8em;">
      <div class="mb-3 pb-3 border-bottom">Buy now for {{saleData.buyNowOrStartingPrice}} STX</div>
      <div class="pl-0">
        <div v-for="(rate, index) in rates" :key="index" class="border-bottom py-1 d-flex justify-content-between">
          <div style="min-width: 100px;" class="text-right mr-4">{{rate.value}}</div>
          <div style="min-width: 100px;">{{rate.text}}</div>
        </div>
      </div>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <div class="" style="width: 79%; border-bottom: 1pt solid #000000;"></div>
          <div style="position: relative; top: 25px;">
            <square-button :theme="'dark'" @clickButton="$emit('buyNow')" :label1="'BUY NOW'" :svgImage="icon" :usePixelBg="true"/>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</div>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

export default {
  name: 'PurchaseBuyNow',
  components: {
    SquareButton
  },
  props: ['saleData', 'offerData'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null
    }
  },
  mounted () {
    const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
    this.defaultRate = tickerRates[0].currency
    this.loading = false
  },
  methods: {
    stxSymbol: function () {
      return '&#931;'
    }
  },
  computed: {
    buyNowDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('buy-now')
      return dialog
    },
    gaiaAsset () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return configuration.gaiaAsset
    },
    rateOptions () {
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      const options = []
      tickerRates.forEach((rate) => {
        options.push({
          text: rate.currency,
          value: rate.currency
        })
      })
      return options
    },
    rates () {
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      const options = []
      const stxToBtc = tickerRates[0].stxPrice / tickerRates[0].last
      options.push({
        text: 'BTC',
        value: utils.toDecimals(stxToBtc * this.saleData.buyNowOrStartingPrice, 100000)
      })
      const stxToETh = tickerRates[0].stxPrice / tickerRates[0].ethPrice
      options.push({
        text: 'ETH',
        value: utils.toDecimals(stxToETh * this.saleData.buyNowOrStartingPrice, 100000)
      })
      tickerRates.forEach((rate) => {
        options.push({
          text: rate.currency,
          value: utils.toDecimals(rate.stxPrice * this.saleData.buyNowOrStartingPrice)
        })
      })
      return options
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
