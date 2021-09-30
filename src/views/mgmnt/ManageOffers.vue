<template>
<b-container id="adminSection" class="p-5 text-black bg-white ">
  <div class="d-flex justify-content-end text-small">
    <div v-if="currentHighestOffer"><b-link class="text-success"><a :href="'mailto:' + currentHighestOffer.email">{{currentHighestOffer.amount}} STX</a></b-link></div>
    <div class="ml-4"><b-link @click.prevent="refresh">refresh</b-link></div>
  </div>
  <b-container id="adminSection" class="p-5 text-black bg-white ">
    <b-row>
      <b-col v-for="(result, index1) in getGaiaAssets" :key="index1"><b-link @click.prevent="artist = result.artist">{{result.artist}}</b-link></b-col>
    </b-row>
    <OfferHistory2 :assetHash="assetHash" />
  </b-container>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import OfferHistory2 from '@/views/marketplace/components/toolkit/offers/OfferHistory2'
import moment from 'moment'

export default {
  name: 'ManageOffers',
  components: {
    OfferHistory2
  },
  data () {
    return {
      artist: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayPurchaseStore/fetchOffers')
  },
  methods: {
    fields () {
      return ['Email', 'Amount STX']
    },
    values () {
      let mapped = []
      // const $self = this
      if (this.dbOffers) mapped = this.dbOffers.map(function (dbOffer) { return { Email: dbOffer.email, 'Amount STX': dbOffer.amount } })
      return mapped
    },
    refresh: function () {
      this.$store.dispatch('rpayPurchaseStore/fetchOffers')
    },
    offerMade: function (madeData) {
      if (!madeData) return '-'
      return moment(madeData).format('DD-MM hh:mm')
    }
  },
  computed: {
    currentHighestOffer () {
      if (!this.artist) return
      const gaiaAsset = this.getGaiaAssets.find((o) => o.artist === this.artist)
      const offer = this.$store.getters[APP_CONSTANTS.KEY_HIGHEST_OFFER_ON_ASSET](gaiaAsset.assetHash)
      return offer
    },
    assetHash () {
      if (!this.artist) return
      const gaiaAsset = this.getGaiaAssets.find((o) => o.artist === this.artist)
      return gaiaAsset.assetHash
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    },
    getGaiaAssets () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      // resultSet = resultSet.filter((o) => o.maxEditions < 10)
      return resultSet
    }
  }
}
</script>

<style>
</style>
