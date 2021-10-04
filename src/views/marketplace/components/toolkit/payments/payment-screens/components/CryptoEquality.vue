<template>
<b-card-text>
  <span class="mr-1 rd-text" v-html="currentSymbol"></span>
  <input readonly="true" class="rd-input" id="input-horizontal2" :value="currentAmount" placeholder="$$$"/>
  <b-icon class="rd-text ml-2" width="15px" height="15px" icon="equals"/>
  <input readonly="true" class="total-amount-fiat rd-input" id="input-horizontal3" :value="amountFiat" placeholder="$$$"/>
  <span class="rd-text ml-2">{{fiatCurrency}}</span>
</b-card-text>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CryptoEquality',
  components: {
  },
  data () {
    return {
    }
  },
  props: ['paymentOption', 'configuration'],
  mounted () {
  },
  methods: {
  },
  computed: {
    currentSymbol () {
      if (this.paymentOption === 'ethereum') {
        return 'Ξ'
      } else if (this.paymentOption === 'stacks') {
        return '&#931;'
      } else {
        return '&#8383;'
      }
    },
    amountFiat () {
      const paymentChallenge = this.$store.getters[APP_CONSTANTS.KEY_INVOICE]
      return (paymentChallenge.xchange) ? paymentChallenge.xchange.amountFiat : '0'
    },
    fiatCurrency () {
      const paymentChallenge = this.$store.getters[APP_CONSTANTS.KEY_INVOICE]
      return (paymentChallenge.xchange) ? paymentChallenge.xchange.fiatCurrency : '???'
    },
    currentAmount () {
      const paymentChallenge = this.$store.getters[APP_CONSTANTS.KEY_INVOICE]
      if (paymentChallenge.xchange) {
        if (this.paymentOption === 'ethereum') {
          return paymentChallenge.xchange.amountEth
        } else if (this.paymentOption === 'stacks') {
          return paymentChallenge.xchange.amountStx
        } else {
          return paymentChallenge.xchange.amountBtc
        }
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
