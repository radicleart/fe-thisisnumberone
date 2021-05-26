<template>
<div v-if="!loading">
  <b-row>
    <b-col cols="12" class="mb-5">
      <h1 class="mb-4">{{makeOfferDialog[0].text}}</h1>
      <h4 v-if="saleType === 2"><span class="mr-3">Auction finishes</span> <b>{{offerData.fbet}}</b></h4>
      <h4 v-else><span class="mr-3">{{makeOfferDialog[1].text}}</span> <b>{{offerData.fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="4" sm="12">
      <p v-html="makeOfferDialog[3].text"></p>
    </b-col>
    <b-col md="6" sm="6">
      <div>
        <label for="input-live"><span class="text-small">Your Offer in STX (must be more than current offer)</span></label>
      </div>
      <div>
        <b-input-group size="lg">
          <b-form-input v-on:keyup="changeAmount" type="number" id="offer" :state="offerState" v-model="offerAmount" placeholder="Enter amount"></b-form-input>
          <!--
            <b-dropdown style="max-width: 60px; height: 44px; top: -6px; font-size: 1.6rem;" variant="outline-success" id="dropdown-1" :text="currency" class="m-2">
            <b-dropdown-item @click="changeCurrency('USD')">USD</b-dropdown-item>
            <b-dropdown-item @click="changeCurrency('EUR')">EUR</b-dropdown-item>
            <b-dropdown-item @click="changeCurrency('GBP')">GBP</b-dropdown-item>
            <b-dropdown-item @click="changeCurrency('JPY')">JPY</b-dropdown-item>
          </b-dropdown>
          -->
        </b-input-group>
        <p class="text-small text-danger" v-html="errorMessage"></p>
      </div>
      <rates-listing :message="rateMessage()" :amount="offerAmount"/>
    </b-col>
    <b-col md="2" sm="4" class="text-small" style="border-left: 1pt solid #000;">
      <div>{{rateMessage()}}</div>
      <div style="font-weight: 700;">{{offerData.minimumOffer}}  <span class="text-warning">STX</span></div>
      <div style="font-weight: 700;">{{offerData.amountUsdFmt}} <span class="text-warning">USD</span></div>
    </b-col>
  </b-row>
  <action-row :buttonLabel="'Next'" @clickButton="next"/>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RatesListing from '@/components/toolkit/RatesListing'
import ActionRow from '@/components/utils/ActionRow'
import utils from '@/services/utils'

export default {
  name: 'PurchaseOfferAmount',
  components: {
    RatesListing,
    ActionRow
  },
  props: ['offerData'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      minimumOffer: 0,
      errorMessage: null,
      currency: 'USD',
      offerAmountFiat: 0,
      offerAmount: 0
    }
  },
  mounted () {
    this.minimumOffer = this.offerData.minimumOffer
    this.offerAmount = this.offerData.offerAmount + 500
    if (this.offerData.offerAmount > 20000) {
      this.offerAmount = this.offerData.offerAmount + 1000
    }
    this.offerAmountFiat = utils.toDecimals(this.currentRate.stxPrice * this.offerData.offerAmount)
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 3 })
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      // return 'Offers above ' + this.minimumOffer + ' STX will be considered'
      return 'Current Offer'
    },
    changeAmount: function () {
      // this.offerAmount = utils.toDecimals(this.offerAmountFiat / this.currentRate.stxPrice)
    },
    changeCurrency: function (currency) {
      this.currency = currency
      this.offerAmount = utils.toDecimals(this.offerAmountFiat / this.currentRate.stxPrice)
    },
    next: function () {
      this.errorMessage = null
      if (this.offerAmount <= this.minimumOffer) {
        this.errorMessage = 'Offers above ' + this.minimumOffer + ' STX will be considered'
        return
      }
      this.$emit('collectEmail', { offerAmount: this.offerAmount })
    }
  },
  computed: {
    currentRate () {
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      const rate = tickerRates.find((o) => o.currency === this.currency)
      return rate
    },
    makeOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('make-offer')
      return dialog
    },
    gaiaAsset () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return configuration.gaiaAsset
    },
    saleType () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset.saleData.saleType
    },
    offerState () {
      return (this.offerAmount > this.minimumOffer)
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
