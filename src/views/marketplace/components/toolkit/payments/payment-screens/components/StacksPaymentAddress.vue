<template>
<div class="mx-5 mt-4 d-flex flex-column align-items-center">
  <div v-if="installBrowserFlow">
    <div class="text-center ">
      <span><b-button class="cp-btn-order" variant="outline-danger"><a style="text-decoration: none;" target="_blank" href="https://www.hiro.so/wallet/install-web">Install stacks wallet</a></b-button></span>
    </div>
    <div class="text-center mt-5">
      <div>Install the Stacks Web Wallet, create an account, transfer some STX then reload this page!</div>
      <div class="mt-3">Need help? <a href="https://www.youtube.com/watch?v=oVEddTQ-95k" target="_blank">Check out our videos</a></div>
    </div>
  </div>
  <div v-else>
    <div title="Make Payment">
      <div class="text-center" v-if="desktopWalletSupported">
        <canvas ref="lndQrcode"></canvas>
      </div>
    </div>
    <div class="mb-2 text-center" v-if="desktopWalletSupported">
      <a href="#" @click.prevent="copyAddress()">
        <span ref="myPaymentAddress" class="text-bold text-two mr-2">Copy the address</span>
      </a>
      <b-icon class="text-two" width="20px" height="20px" icon="file-earmark"/>
    </div>
    <div class="mt-5 text-center">
      <b-button class="cp-btn-order" variant="warning" @click.prevent="sendPayment()">{{buttonLabel}}</b-button>
    </div>
    <div class="my-3 text-center">
      <span class="text-small text-danger">{{errorMessage}}</span>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode'
import { APP_CONSTANTS } from '@/app-constants'

const STACKS_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'StacksPaymentAddress',
  components: {
  },
  props: ['desktopWalletSupported', 'configuration'],
  data () {
    return {
      webWalletNeeded: false,
      errorMessage: null,
      installBrowserFlow: false,
      waitingMessage: 'Open Connect Wallet to proceed (sending transactions to the stacks network takes a minute or so...)'
    }
  },
  watch: {
  },
  mounted () {
    this.addQrCode()
  },
  methods: {
    doLogin () {
      this.$store.dispatch('rpayStacksStore/startLogin').then(() => {
        this.errorMessage = 'Error found'
        this.loading = false
      })
    },
    sendPayment () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN, stxAddress: profile.stxAddress }, { root: true })
          this.transfer()
        }).catch((err) => {
          console.log(err)
          // https://www.hiro.so/wallet/install-web
          this.installBrowserFlow = true
          this.webWalletNeeded = true
        })
      } else {
        this.transfer()
      }
    },
    transfer () {
      const configuration = this.configuration
      this.loading = true
      this.waitingMessage = 'Processing Payment'
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        numbCredits: configuration.payment.creditAttributes.start,
        status: 10,
        opcode: 'stx-crypto-payment-success',
        currency: configuration.payment.currency,
        amountFiat: Number(configuration.payment.amountFiat) * 100, // store in cents and pennies
        amountStx: configuration.payment.amountStx,
        amountBtc: configuration.payment.amountBtc,
        sendingAddress: profile.stxAddress,
        paymentAddress: configuration.payment.stxPaymentAddress
      }
      this.$store.dispatch('rpayStacksStore/makeTransferBlockstack', { amountStx: configuration.payment.amountStx, recipient: configuration.payment.stxPaymentAddress }).then((result) => {
        this.waitingMessage = 'Processed Payment'
        this.loading = false
        if (result && result.result) data.txId = result.result.txId
        this.$emit('rpayEvent', data)
        this.$store.commit('rpayStore/setDisplayCard', 104)
      }).catch((e) => {
        this.$store.dispatch('rpayStacksStore/makeTransferRisidio', { amountStx: configuration.payment.amountStx, recipient: configuration.payment.stxPaymentAddress }).then((result) => {
          this.waitingMessage = 'Processed Payment'
          this.loading = false
          data.txId = result.txId
          this.$emit('rpayEvent', data)
          this.$store.commit('rpayStore/setDisplayCard', 104)
        }).catch((e) => {
          this.errorMessage = 'Unable to transfer funds at the moment - please try later or choose an alternate payment method'
          this.$store.commit('rpayStore/setDisplayCard', 104)
          this.loading = false
        })
      })
    },
    paymentUri () {
      return STACKS_PAYMENT_ADDRESS
    },
    addQrCode () {
      const element = this.$refs.lndQrcode
      const paymentUri = this.paymentUri()
      QRCode.toCanvas(
        element, paymentUri, { errorCorrectionLevel: 'H' },
        function () {})
    },
    copyAddress () {
      const tempInput = document.createElement('input')
      tempInput.value = STACKS_PAYMENT_ADDRESS
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      // const flasher = document.getElementById('flash-me')
      const flasher = this.$refs.lndQrcode
      flasher.classList.add('flasher')
      setTimeout(function () {
        flasher.classList.remove('flasher')
      }, 1000)
    }
  },
  computed: {
    buttonLabel: function () {
      if (this.webWalletNeeded) return 'Install Stacks Wallet'
      return 'Send ' + this.currentAmount
    },
    currentSymbol () {
      const paymentOption = this.configuration.payment.paymentOption
      if (paymentOption === 'ethereum') {
        return 'Ξ'
      } else if (paymentOption === 'stacks') {
        return '&#931;'
      } else {
        return '&#8383;' // '&#x20BF;' // '&#8383;'
      }
    },
    currentAmount () {
      const configuration = this.configuration
      const paymentOption = this.configuration.payment.paymentOption
      if (configuration && configuration.payment.amountBtc) {
        if (paymentOption === 'ethereum') {
          return configuration.payment.amountEth + ' ETH'
        } else if (paymentOption === 'stacks') {
          return configuration.payment.amountStx + ' STX'
        } else {
          return configuration.payment.amountBtc + ' BTC'
        }
      }
      return 0
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile) ? profile.loggedIn : false
    },
    paymentAddress () {
      return STACKS_PAYMENT_ADDRESS
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-content {
  padding-top: 0px;
}
</style>
