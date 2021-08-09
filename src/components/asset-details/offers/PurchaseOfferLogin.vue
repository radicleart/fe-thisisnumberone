<template>
<div v-if="makeOfferDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{makeOfferDialog[0].text}}</h1>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col align-v="stretch" md="12" sm="12">
      <p v-if="makeOfferDialog[1]">{{makeOfferDialog[1].text}}</p>
      <p v-if="makeOfferDialog[2]">{{makeOfferDialog[2].text}}</p>
      <p v-if="makeOfferDialog[3]">{{makeOfferDialog[3].text}}</p>
      <p v-if="makeOfferDialog[4]">{{makeOfferDialog[4].text}}</p>
      <div class="mt-5"><b-link href="#" @click.prevent="$emit('backStep')"><b-icon icon="chevron-left"/> Back</b-link></div>
    </b-col>
  </b-row>
  <ActionRow :buttonLabel2="'Send via email'" :buttonLabel="buttonLabel()" @clickButton="connect"/>
</div>
</template>

<script>
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PurchaseOfferLogin',
  components: {
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
      offerAmount: 0,
      defaultRate: null,
      webWalletNeeded: false
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
    buttonLabel: function () {
      if (this.webWalletNeeded) return 'Install Stacks Wallet'
      return 'Send via Stacks Wallet'
    },
    back: function () {
      this.$emit('backStep')
    },
    registerByEmail: function () {
      this.$emit('registerByEmail')
    },
    connect: function (data) {
      if (data === 'Send via email') {
        this.registerByEmail()
        return
      } else if (data === 'Install Stacks Wallet') {
        window.open(
          this.webWalletLink,
          '_blank'
        )
        return
      }
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        this.$emit('registerByConnect')
      } else {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$emit('registerByConnect')
        }).catch((err) => {
          console.log(err)
          // https://www.hiro.so/wallet/install-web
          this.webWalletNeeded = true
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
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    makeOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('login-to-offer')
      return dialog
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
