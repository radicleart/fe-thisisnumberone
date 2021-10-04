<template>
<div class="row">
  <div class="col-12 mb-5">
    <div role="group">
      <label for="input-live"><span class="text-white">Buy Now Price (STX)</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div><p class="text-danger" v-html="errorMessage"></p></div>
</div>
</template>

<script>
import utils from '@/services/utils'

export default {
  name: 'SellBuyNow',
  components: {
  },
  props: ['contractAsset'],
  watch: {
    'buyNowOrStartingPrice' () {
      this.$emit('updateAmount', this.buyNowOrStartingPrice)
    }
  },
  data () {
    return {
      buyNowOrStartingPrice: 0,
      errorMessage: null
    }
  },
  mounted () {
    this.buyNowOrStartingPrice = this.contractAsset.saleData.buyNowOrStartingPrice
    this.contractAsset.saleData.reservePrice = 0
    this.contractAsset.saleData.incrementPrice = 0
    this.contractAsset.saleData.saleType = 1
  },
  methods: {
    toDecimals: function () {
      this.buyNowOrStartingPrice = utils.toDecimals(this.buyNowOrStartingPrice)
    },
    updateBuyNowOrStartingPrice: function () {
      // this.contractAsset.saleData.buyNowOrStartingPrice = parseInt(this.buyNowOrStartingPrice)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
