<template>
<div v-if="makeOfferDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{makeOfferDialog[0].text}}</h1>
      <h4 class="mb-5">{{makeOfferDialog[1].text}} <b>{{offerData.fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col align-v="stretch" md="4" sm="12">
      <h2>{{makeOfferDialog[2].text}}</h2>
      <p v-if="makeOfferDialog[3]">{{makeOfferDialog[3].text}}</p>
      <p v-if="makeOfferDialog[4]">{{makeOfferDialog[4].text}}</p>
      <p v-if="makeOfferDialog[5]">{{makeOfferDialog[5].text}}</p>
      <div class="mt-5"><a href="#" @click.prevent="back()"><b-icon icon="chevron-left"/> Back</a></div>
    </b-col>
    <b-col md="5" sm="6" style="border-right: 1pt solid #000;">
      <div><p v-if="makeOfferDialog[4]">{{makeOfferDialog[4].text}}</p></div>
      <div><b-link @click="registerByEmail"><b-icon icon="chevron-right"/> Skip connect to wallet - register by email</b-link></div>
    </b-col>
    <rates-listing :message="rateMessage()" :amount="minimumOffer"/>
  </b-row>
  <b-row>
    <b-col cols="12">
      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <div class="" style="width: 70%; border-bottom: 1pt solid #000000;"></div>
          <div class="mr-4" style="position: relative; top: 25px;">
            <square-button :theme="'dark'" :colorOnHover="'dark'" @clickButton="connect()" :label1="'CONNECT TO WALLET'" :icon="'power'" :usePixelBg="true"/>
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
import RatesListing from '@/components/toolkit/RatesListing'

export default {
  name: 'PurchaseOfferAmount',
  components: {
    SquareButton,
    RatesListing
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
    rateMessage: function () {
      return 'Offers above ' + this.minimumOffer + ' STX will be considered'
    },
    back: function () {
      this.$emit('backStep')
    },
    registerByEmail: function () {
      this.$emit('registerByEmail')
    },
    connect: function () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        this.$emit('registerByConnect')
      } else {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$emit('registerByConnect')
        })
      }
      const $self = this
      this.timer1 = setInterval(function () {
        const profile = $self.$store.getters[APP_CONSTANTS.KEY_PROFILE]
        if (profile.loggedIn) $self.$emit('registerByConnect')
      }, 1500)
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
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    makeOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('login-to-offer')
      return dialog
    },
    gaiaAsset () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return configuration.gaiaAsset
    },
    offerState () {
      return (this.offerAmount >= this.minimumOffer)
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
