<template>
<div class="">
  <div class="row text-small mb-4" v-for="(offer, index1) in contractAsset.offerHistory" :key="index1">
    <div class="col-2">Offerer</div>
    <div class="col-10">{{offer.offerer}}</div>
    <div class="col-2">Amount</div>
    <div class="col-10">{{offer.amount}} STX</div>
    <div class="col-2">Made</div>
    <div class="col-10">{{offerMade(offer.appTimestamp)}}</div>
    <div class="col-2"></div>
  </div>
  <div class="row text-small mb-4" v-for="(dbOffer, index) in dbOffers" :key="index">
    <div class="col-2">Offerer</div>
    <div class="col-10">{{dbOffer.offerer}}</div>
    <div class="col-2">Amount</div>
    <div class="col-10">{{dbOffer.amount}} STX</div>
    <div class="col-2">Made</div>
    <div class="col-10">{{offerMade(dbOffer.appTimestamp)}}</div>
    <div class="col-2"></div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'OfferHistory',
  components: {
  },
  props: ['assetHash'],
  data: function () {
    return {
      dbOffers: null
    }
  },
  mounted () {
    this.$store.dispatch('assetGeneralStore/fetchOffers').then((dbOffers) => {
      this.dbOffers = dbOffers
    })
  },
  methods: {
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM hh:mm')
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    }
  }
}
</script>

<style>
</style>
