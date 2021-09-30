<template>
<div class="">
  <div class="row text-small mb-4" v-for="(offer, index1) in item.contractAsset.offerHistory" :key="index1">
    <div class="col-2">Offerer</div>
    <div class="col-10">{{offer.offerer}}</div>
    <div class="col-2">Amount</div>
    <div class="col-10">{{offer.amount}} STX</div>
    <div class="col-2">Made</div>
    <div class="col-10">{{offerMade(offer.appTimestamp)}}</div>
    <div class="col-2"></div>
  </div>
  <!--
  <div class="row text-small mb-4" v-for="(dbOffer, index) in dbOffers" :key="index">
    <div class="col-2">Offerer</div>
    <div class="col-10">{{dbOffer.offerer}}</div>
    <div class="col-2">Amount</div>
    <div class="col-10">{{dbOffer.amount}} STX</div>
    <div class="col-2">Made</div>
    <div class="col-10">{{offerMade(dbOffer.appTimestamp)}}</div>
    <div class="col-2"></div>
  </div>
  -->
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OfferHistory',
  components: {
  },
  props: ['item'],
  data: function () {
    return {
      dbOffers: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayPurchaseStore/fetchOffers').then((dbOffers) => {
      this.dbOffers = dbOffers
    })
  },
  methods: {
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM hh:mm')
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
