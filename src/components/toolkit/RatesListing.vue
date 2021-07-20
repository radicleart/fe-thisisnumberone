<template>
<span class="text-small">
    <span v-for="(rate, index) in rates" :key="index" class="">
      <span style="min-width: 100px;" class="text-right mr-4">
        {{rate.value}} <span style="font-weight: 600">{{rate.text}}</span>
      </span>
      <div class="w-100" v-if="index === 2 || index === 5"></div>
    </span>
</span>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

export default {
  name: 'RatesListing',
  components: {
  },
  props: ['message', 'amount'],
  data () {
    return {
      loading: true,
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
        value: utils.toDecimals(stxToBtc * this.amount, 100000)
      })
      const stxToETh = tickerRates[0].stxPrice / tickerRates[0].ethPrice
      options.push({
        text: 'ETH',
        value: utils.toDecimals(stxToETh * this.amount, 100000)
      })
      tickerRates.forEach((rate) => {
        options.push({
          text: rate.currency,
          value: utils.toDecimals(rate.stxPrice * this.amount)
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
