<template>
<div v-if="!loading">
  <b-row>
    <b-col cols="12">
      <h1>{{makeOfferDialog[0].text}}</h1>
      <h4 class="mb-5">{{makeOfferDialog[1].text}} <b>{{offerData.fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="4" sm="12">
      <h2>{{makeOfferDialog[2].text}}</h2>
      <p>{{makeOfferDialog[3].text}}
      </p>
    </b-col>
    <b-col md="5" sm="6" style="border-right: 1pt solid #000;">
      <div>
        <label for="input-live"><span class="">Type Amount (in STX)</span></label>
      </div>
      <div>
        <b-input-group size="lg" append="STX">
          <b-form-input id="offer" :state="offerState" v-model="offerAmount" placeholder="Enter amount in STX tokens"></b-form-input>
        </b-input-group>
        <p class="text-small text-danger" v-html="errorMessage"></p>
      </div>
    </b-col>
    <b-col md="3" sm="6" style="font-size: 0.8em;">
      <div class="mb-3 pb-3 border-bottom">Offers above {{minimumOffer}} STX will be considered</div>
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
            <square-button :theme="'dark'" @clickButton="next()" :label1="'NEXT'" :svgImage="icon" :usePixelBg="true"/>
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
  name: 'PurchaseOfferAmount',
  components: {
    SquareButton
  },
  props: ['offerData'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      minimumOffer: 0,
      errorMessage: null,
      offerAmount: 0,
      defaultRate: null
    }
  },
  mounted () {
    const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
    this.defaultRate = tickerRates[0].currency
    this.minimumOffer = this.offerData.minimumOffer
    this.offerAmount = this.offerData.offerAmount
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 3 })
    this.loading = false
  },
  methods: {
    stxSymbol: function () {
      return '&#931;'
    },
    next: function () {
      this.errorMessage = null
      if (this.offerAmount < this.minimumOffer) {
        this.errorMessage = 'Offers above ' + this.minimumOffer + ' STX will be considered'
        return
      }
      this.$emit('collectEmail', { offerAmount: this.offerAmount })
    },
    checkAndConvertToDecimals: function () {
      if (this.offerAmount < this.minimumOffer) {
        // this.offerAmount = this.minimumOffer
      }
      if (this.offerAmount !== 0) this.offerAmount = Math.round(this.offerAmount * 100) / 100
    },
    updateOfferAmount: function () {
      if (this.offerAmount < this.minimumOffer) {
        this.offerAmount = this.minimumOffer
      }
    }
  },
  computed: {
    makeOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('make-offer')
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
    offerState () {
      return (this.offerAmount >= this.minimumOffer)
    },
    rates () {
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      const options = []
      const stxToBtc = tickerRates[0].stxPrice / tickerRates[0].last
      options.push({
        text: 'BTC',
        value: utils.toDecimals(stxToBtc * this.offerAmount, 100000)
      })
      const stxToETh = tickerRates[0].stxPrice / tickerRates[0].ethPrice
      options.push({
        text: 'ETH',
        value: utils.toDecimals(stxToETh * this.offerAmount, 100000)
      })
      tickerRates.forEach((rate) => {
        options.push({
          text: rate.currency,
          value: utils.toDecimals(rate.stxPrice * this.offerAmount)
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
