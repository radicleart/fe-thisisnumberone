<template>
<div v-if="buyNowDialog">
  <b-row>
    <b-col cols="12">
      <h1>{{buyNowDialog[0].text}}</h1>
      <h4 class="mb-5">{{buyNowDialog[1].text}} <b>{{fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="4" sm="12">
      <p v-if="buyNowDialog[2]">{{buyNowDialog[2].text}}</p>
      <p v-if="buyNowDialog[3]">{{buyNowDialog[3].text}}
      </p>
    </b-col>
    <b-col md="8" sm="12" style="border-right: 1pt solid #000;">
      <div>
        <h3><span class="mr-5 text-black">Buy Now</span> {{contractAsset.saleData.buyNowOrStartingPrice}} STX</h3>
      </div>
      <div class="d-flex justify-content-start">
        <div class="text-small" style="width: 50px;">
          <b>STX</b> =
        </div>
        <div class="text-small">
          <rates-listing :message="''" :amount="contractAsset.saleData.buyNowOrStartingPrice"/>
        </div>
      </div>
    </b-col>
  </b-row>
  <action-row :eventName="buyNow" :buttonLabel="'BUY NOW'"/>
</div>
</template>

<script>
import RatesListing from '@/components/toolkit/RatesListing'
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PurchaseBuyNow',
  components: {
    ActionRow,
    RatesListing
  },
  props: ['contractAsset'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      return 'Buy now for' + this.contractAsset.saleData.buyNowOrStartingPrice + ' STX'
    }
  },
  computed: {
    buyNowDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('buy-now')
      return dialog
    },
    fbet () {
      return this.$store.getters[APP_CONSTANTS.KEY_FORMATTED_BIDDING_END_TIME](this.contractAsset)
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
