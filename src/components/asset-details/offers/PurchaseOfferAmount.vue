<template>
<div v-if="!loading">
  <b-row>
    <b-col cols="12" class="mb-5">
      <h1 class="mb-4">{{makeOfferDialog[0].text}}</h1>
      <h4><span class="mr-3">{{makeOfferDialog[1].text}}</span> <b>{{offerData.fbet}}</b></h4>
    </b-col>
  </b-row>
  <b-row class="row mt-2">
    <b-col md="4" sm="12">
      <p>{{makeOfferDialog[3].text}}</p>
    </b-col>
    <b-col md="6" sm="6">
      <div>
        <label for="input-live"><span class="text-small">Type Amount (in STX)</span></label>
      </div>
      <div>
        <b-input-group size="lg" append="STX">
          <b-form-input type="number" id="offer" :state="offerState" v-model="offerAmount" placeholder="Enter amount in STX tokens"></b-form-input>
        </b-input-group>
        <p class="text-small text-danger" v-html="errorMessage"></p>
      </div>
      <div class="d-flex justify-content-start">
        <div class="text-small" style="width: 50px;">
          <b>STX</b> =
        </div>
        <div class="text-small">
          <rates-listing :message="rateMessage()" :amount="offerAmount"/>
        </div>
      </div>
    </b-col>
    <b-col md="2" sm="4" class="text-small" style="border-left: 1pt solid #000;">
      <div>{{rateMessage()}}</div>
      <div>{{minimumOffer}} STX</div>
    </b-col>
  </b-row>
  <action-row :buttonLabel="'NEXT'" @clickButton="next"/>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RatesListing from '@/components/toolkit/RatesListing'
import ActionRow from '@/components/utils/ActionRow'

export default {
  name: 'PurchaseOfferAmount',
  components: {
    RatesListing,
    ActionRow
  },
  props: ['offerData'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      minimumOffer: 0,
      errorMessage: null,
      offerAmount: 0
    }
  },
  mounted () {
    this.minimumOffer = this.offerData.minimumOffer
    this.offerAmount = this.offerData.offerAmount
    this.$emit('updateSaleDataInfo', { field: 'saleType', value: 3 })
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      // return 'Offers above ' + this.minimumOffer + ' STX will be considered'
      return 'Minimum Offer'
    },
    next: function () {
      this.errorMessage = null
      if (this.offerAmount < this.minimumOffer) {
        this.errorMessage = 'Offers above ' + this.minimumOffer + ' STX will be considered'
        return
      }
      this.$emit('collectEmail', { offerAmount: this.offerAmount })
    },
    checkAndConvertToDecimals: function () {
      if (this.offerAmount < this.minimumOffer) {
        // this.offerAmount = this.minimumOffer
      }
      if (this.offerAmount !== 0) this.offerAmount = Math.round(this.offerAmount * 100) / 100
    },
    updateOfferAmount: function () {
      if (this.offerAmount < this.minimumOffer) {
        this.offerAmount = this.minimumOffer
      }
    }
  },
  computed: {
    makeOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('make-offer')
      return dialog
    },
    gaiaAsset () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return configuration.gaiaAsset
    },
    offerState () {
      return (this.offerAmount >= this.minimumOffer)
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
