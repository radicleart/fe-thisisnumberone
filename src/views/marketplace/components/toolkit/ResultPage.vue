<template>
<b-card header-tag="header" footer-tag="footer" class="rpay-card">
  <b-card-text class="d-flex justify-content-center">
    <img height="100%" width="100%" :src="logoDone"/>
  </b-card-text>
  <b-card-text v-if="result === 'error'" class="d-flex justify-content-center">
    <div class="mb-4 text-bold text-one">Please choose a payment method</div>
  </b-card-text>
  <b-card-text v-else class="text-center mx-4">
    <div class="mb-4 text-two"><b-icon width="2em" height="2em" scale="1" icon="check-circle"></b-icon></div>
    <div class="mb-4 text-bold">Your payment is confirmed</div>
    <div class="mb-4 mx-5 row">
      <div class="text-right col-6">
        <div class="text-one"><span class="text-two" v-html="numbUnits"></span> units</div>
      </div>
      <div class="text-left col-6">
        <div class="text-one"><span class="text-two" v-html="fiatSymbol"></span> {{formattedFiat}}</div>
        <div class="text-one"><span class="text-two" v-html="currentSymbol"></span> {{currentAmount}}</div>
      </div>
    </div>
    <div class="mb-4">
      <b-button class="cp-btn-order" variant="warning" @click.prevent="doFinish()">Done</b-button>
    </div>
  </b-card-text>
  <template v-if="!result" v-slot:footer>
    <FooterView :rangeValue="getRangeValue()" @rangeEvent="rangeEvent"/>
  </template>
</b-card>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import FooterView from './FooterView'

export default {
  name: 'ResultPage',
  components: {
    FooterView
  },
  props: ['result'],
  data () {
    return {
      // logoDone: require('@/assets/img/womanonbitcoin.svg'),
      logoDone: 'https://images.prismic.io/risidio-journal/9ad5b59c-d19d-4339-bb2e-3856e41e067b_womanleanbitcoin.png?auto=compress,format'
    }
  },
  mounted () {
  },
  methods: {
    doFinish () {
      const configuration = this.configuration
      this.$emit('rpayEvent', { opcode: configuration.payment.paymentOption + '-payment-end' })
    },
    rangeEvent (displayCard) {
      this.$store.commit('rpayStore/setDisplayCard', displayCard)
    },
    getRangeValue () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      if (displayCard === 100) return 0
      else if (displayCard === 102) return 1
      else if (displayCard === 104) return 2
    }
  },
  computed: {
    numbUnits () {
      const configuration = this.configuration
      return configuration.payment.creditAttributes.start
    },
    formattedFiat () {
      const configuration = this.configuration
      const amountFiat = (configuration.payment) ? configuration.payment.amountFiat : '0'
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      })
      const ffiat = formatter.formatToParts(amountFiat) /* $2,500.00 */
      return ffiat[1].value + '.' + ffiat[3].value
    },
    fiatSymbol () {
      const configuration = this.configuration
      const fc = (configuration.payment) ? configuration.payment.currency : '???'
      if (fc === 'EUR') {
        return '&euro;'
      } else if (fc === 'GBP') {
        return '&pound;'
      } else {
        return '&dollar;'
      }
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
          return configuration.payment.amountEth
        } else if (paymentOption === 'stacks') {
          return configuration.payment.amountStx
        } else {
          return configuration.payment.amountBtc
        }
      }
      return 0
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
