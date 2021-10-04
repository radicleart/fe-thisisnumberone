<template>
<b-card-text class="text-center mx-4 border-bottom mb-5">
  <!--
  <div class="mb-3 d-flex justify-content-center">
    <img width="30%" class="rpay-sq-logo" :src="logo"/>
  </div>
  -->
  <h1 class="text-pay-h1">Payment Method</h1>
  <p class="mt-4 text-message">Choose preferred payment option</p>
  <div class="border-bottom mt-4 mb-4 mx-0 d-flex justify-content-center text-small">
    <span v-for="(option) in fiatOptions()" :key="option.value" class="mb-3">
      <b-button :disabled="(option.disabled)" class="btn-pay" @click="changePaymentOption(option.value)" :variant="payBtnVariant(option)">
        <span><img width="15px" class="mr-2" :src="cardImg(option.value)"/> <span v-if="option.value === 'fiat'">Card</span><span v-else>{{option.value}}</span></span>
      </b-button>
    </span>
  </div>
  <div class="mx-0 d-flex justify-content-center text-small">
    <span v-for="(option) in cryptoOptions()" :key="option.value" class="mb-3">
      <b-button :disabled="(option.disabled)" class="btn-pay mb-2" @click="changePaymentOption(option.value)" :variant="payBtnVariant(option)">
        <span>
          <img width="15px" class="mr-2" :src="cardImg(option.value)"/></span>
          <span>{{option.value}}</span>
      </b-button>
    </span>
  </div>
</b-card-text>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CryptoOptions',
  components: {
  },
  props: ['configuration'],
  data () {
    return {
      selected: 'bitcoin',
      cardEthereumImg: require('@/assets/img/payments/ethereum.png'),
      cardBitcoinImg: require('@/assets/img/payments/bitcoin.png'),
      cardLightningImg: require('@/assets/img/payments/lightning.png'),
      cardFiatImg: require('@/assets/img/payments/credit-card.png'),
      cardPaypalImg: require('@/assets/img/payments/paypal.png'),
      logoSq: 'https://images.prismic.io/risidio-journal/6da1afe7-fb24-4cff-be77-144d4354f41d_square.png?auto=compress,format',
      logoOn: 'https://images.prismic.io/risidio-journal/65a893ce-421d-45bf-b883-8cb77fda2763_Sans-titre-1+%283%29.png?auto=compress,format',
      logoEth: 'https://images.prismic.io/risidio-journal/6b859d7d-c60e-470f-994c-ab2ae1bff130_eht.png?auto=compress,format',
      logoStx: 'https://images.prismic.io/risidio-journal/fc57a581-b1d3-4c2b-9481-cee2f38c3437_stacks.png?auto=compress,format'
    }
  },
  mounted () {
    const paymentOption = this.configuration.payment.paymentOption
    this.selected = paymentOption
  },
  methods: {
    cardImg (method) {
      if (method === 'fiat') {
        return this.cardFiatImg
      } else if (method === 'paypal') {
        return this.cardPaypalImg
      } else if (method === 'ethereum') {
        return this.cardEthereumImg
      } else if (method === 'lightning') {
        return this.cardLightningImg
      } else if (method === 'bitcoin') {
        return this.cardBitcoinImg
      } else {
        return this.cardFiatImg
      }
    },
    payBtnVariant (option) {
      if (option.disabled) {
        return 'outline-light'
      }
      if (option.value === this.selected) {
        return 'outline-warning'
      } else {
        return 'warning'
      }
    },
    fiatOptions () {
      const options = this.$store.getters[APP_CONSTANTS.KEY_PAYMENT_OPTIONS]
      return options.filter((o) => o.value === 'fiat' || o.value === 'paypal')
    },
    cryptoOptions () {
      const options = this.$store.getters[APP_CONSTANTS.KEY_PAYMENT_OPTIONS]
      return options.filter((o) => o.value !== 'fiat' && o.value !== 'paypal')
    },
    changePaymentOption: function (method) {
      if (this.configuration.payment.paymentOption === method) {
        this.configuration.payment.paymentOption = null
        this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 102)
      } else {
        this.configuration.payment.paymentOption = method
        this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 104)
      }
      this.$emit('rpayEvent', { opcode: 'change-payment-method' })
    }
  },
  computed: {
    sufficientFunds () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      return (wallet && wallet.accountInfo.balance >= (this.configuration.payment.amountStx * 4))
    },
    currentOption () {
      const paymentOption = this.configuration.payment.paymentOption
      return paymentOption
    },
    logo () {
      const paymentOption = this.configuration.payment.paymentOption
      let logo = this.logoSq
      if (paymentOption === 'stacks') {
        logo = this.logoStx
      } else if (paymentOption === 'ethereum') {
        logo = this.logoEth
      } else if (paymentOption === 'lightning' || paymentOption === 'bitcoin') {
        logo = this.logoOn
      }
      return logo
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
