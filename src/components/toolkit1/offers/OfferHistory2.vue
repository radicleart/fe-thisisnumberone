<template>
    <div class="upload-preview text-small">
      <b-table striped hover class="bg-light text-dark"
        :items="values()"
        :fields="fields()">
      <template #cell(Cancel)="data">
        <span @click="cancelOffer(data)" v-html="data.value"></span>
      </template>
      </b-table>
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
    }
  },
  methods: {
    fields () {
      return ['Id', 'Email', 'Amount STX', 'Status', 'Cancel']
    },
    values () {
      let mapped = []
      if (this.dbOffers) mapped = this.dbOffers.map(function (dbOffer) { return { Id: dbOffer.id, Email: dbOffer.email, 'Amount STX': dbOffer.amount, Status: dbOffer.status, Cancel: '<a href="#">cancel</a>' } })
      return mapped
    },
    cancelOffer (data) {
      const offer = this.dbOffers[data.index]
      this.$store.dispatch('rpayPurchaseStore/cancelOffer', offer)
    },
    offerMade: function (madeData) {
      if (!madeData) return '-'
      return moment(madeData).format('DD-MM hh:mm')
    }
  },
  computed: {
    dbOffers () {
      const dbOffers = this.$store.getters[APP_CONSTANTS.KEY_ALL_OFFERS_ON_ASSET](this.assetHash)
      return dbOffers
    }
  }
}
</script>

<style>
</style>
