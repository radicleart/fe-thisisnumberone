<template>
<b-card-text class="mt-2 mx-2" style="min-height: 15rem;">
  <div class="mx-2" v-if="!showSaleData">
    <div class="">
      <div class="mt-4">
        <b-button class="w-100" @click="changeSellingOption(0)" :variant="(contractAsset.saleData.saleType === 0) ? 'warning' : 'light'"><span>Not On Sale</span></b-button>
      </div>
      <div class="mt-4">
        <b-button class="w-100" @click="changeSellingOption(1)" :variant="(contractAsset.saleData.saleType === 1) ? 'warning' : 'light'"><span>Sell</span></b-button>
      </div>
    </div>
    <div class="">
      <div class="mt-5 mx-5">
        <NotForSale :contractAsset="contractAsset" v-if="contractAsset.saleData.saleType === 0" v-on="$listeners"/>
        <BuyNowTradeInfo :contractAsset="contractAsset" v-if="contractAsset.saleData.saleType === 1" v-on="$listeners"/>
        <AuctionTradeInfo :contractAsset="contractAsset" v-else-if="contractAsset.saleData.saleType === 2" v-on="$listeners"/>
        <OfferTradeInfo :contractAsset="contractAsset" v-else-if="contractAsset.saleData.saleType === 3" v-on="$listeners"/>
      </div>
      <div class="text-center mt-5 text-white">
        Save to update your Marketplace data
      </div>
    </div>
  </div>
</b-card-text>
</template>

<script>
import AuctionTradeInfo from './forms/AuctionTradeInfo'
import BuyNowTradeInfo from './forms/BuyNowTradeInfo'
import NotForSale from './forms/NotForSale'

export default {
  name: 'SellingOptions',
  components: {
    BuyNowTradeInfo,
    AuctionTradeInfo,
    NotForSale
  },
  props: ['contractAsset'],
  data () {
    return {
      showSaleData: false
    }
  },
  methods: {
    changeSellingOption: function (saleType) {
      this.contractAsset.saleData.saleType = saleType
      if (saleType === 0) {
        this.contractAsset.saleData.buyNowOrStartingPrice = 0
        this.contractAsset.saleData.reservePrice = 0
        this.contractAsset.saleData.reservePrice = 0
        this.contractAsset.saleData.incrementPrice = 0
      }
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
