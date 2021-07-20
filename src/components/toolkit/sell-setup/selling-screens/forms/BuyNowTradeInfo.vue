<template>
<div class="row">
  <div class="col-12 mb-5">
    <div class="mb-5">
      <h3>Sale Type: Buy Now</h3>
    </div>
    <div role="group">
      <label for="input-live"><span class="">Buy Now Price (STX)</span></label>
      <b-input-group>
        <b-form-input @keyup="toDecimals()" type="number" @change="updateBuyNowOrStartingPrice" v-model="buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div><p class="text-danger" v-html="errorMessage"></p></div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

export default {
  name: 'SellBuyNow',
  components: {
  },
  props: ['saleData'],
  watch: {
  },
  data () {
    return {
      buyNowOrStartingPrice: 0,
      errorMessage: null
    }
  },
  mounted () {
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
    this.buyNowOrStartingPrice = configuration.gaiaAsset.saleData.buyNowOrStartingPrice
    this.$emit('updateSaleDataInfo', { moneyField: true, field: 'reservePrice', value: 0 })
    this.$emit('updateSaleDataInfo', { moneyField: true, field: 'incrementPrice', value: 0 })
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 1 })
  },
  methods: {
    toDecimals: function () {
      this.buyNowOrStartingPrice = utils.toDecimals(this.buyNowOrStartingPrice)
    },
    updateBuyNowOrStartingPrice: function () {
      this.$emit('updateSaleDataInfo', { moneyField: true, field: 'buyNowOrStartingPrice', value: this.buyNowOrStartingPrice })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
