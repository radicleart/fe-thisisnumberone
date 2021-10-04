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
</div>
</template>

<script>
import { DateTime } from 'luxon'

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
      return DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
