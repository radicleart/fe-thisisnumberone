<template>
<div class="my-3 d-flex justify-content-end" style="font-size: 1.4rem;">
  <div class="">
        <div class="">
          <div style="" class="text-right mr-4">
            {{(amount) ? Number(amount).toLocaleString() : 0}} <span style="font-weight: 600">STX</span>
          </div>
        </div>
        <div v-for="(rate, index) in rates" :key="index" class="">
          <div style="" class="text-right mr-4">
            {{rate.value}} <span style="font-weight: 600">{{rate.text}}</span>
          </div>
        </div>
  </div>
</div>
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
      if (!this.amount) return options
      const stxToBtc = tickerRates[0].stxPrice / tickerRates[0].last
      options.push({
        text: 'BTC',
        value: utils.toDecimals(stxToBtc * this.amount, 100000)
      })
      /**
      const stxToETh = tickerRates[0].stxPrice / tickerRates[0].ethPrice
      options.push({
        text: 'ETH',
        value: utils.toDecimals(stxToETh * this.amount, 100000)
      })
      **/
      tickerRates.forEach((rate) => {
        if (rate.currency !== 'CNY') {
          options.push({
            text: rate.currency,
            value: Number(utils.toDecimals(rate.stxPrice * this.amount)).toLocaleString()
          })
        }
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
