<template>
  <b-modal size="lg" id="asset-offer-modal">
    <div class="mb-3" role="group">
      <label for="email">Make an Offer on this Artwork</label>
      <b-form-text id="email-help">Please enter an amount</b-form-text>
      <b-form-input
        id="amount"
        v-model="amount"
        :state="validAmount"
        aria-describedby="amount-help amount-feedback"
        placeholder="Enter amount"
        trim
      ></b-form-input>
      <b-form-invalid-feedback id="amount-feedback">
        Enter email
      </b-form-invalid-feedback>
    </div>
    <template #modal-header>
    </template>
    <template #modal-footer>
      <div class="w-100 d-flex justify-content-between">
        <div class="mr-3 w-75 border-top"></div>
        <div class="w-25" style="position: relative; top: -20px;"><b-button @click="purchase()" variant="light">SUBMIT</b-button></div>
      </div>
    </template>
  </b-modal>
</template>

<script>

export default {
  name: 'AssetOfferModal',
  components: {
  },
  props: ['gaiaAsset'],
  data () {
    return {
      amount: null,
      message: null
    }
  },
  methods: {
    purchase: function () {
      this.$store.dispatch('assetGeneralStore/registerPurchase', { amount: this.amount }).then((result) => {
        this.message = result
      })
    }
  },
  computed: {
    validAmount () {
      return this.amount > 0
    }
  }
}
</script>
<style lang="scss" >
</style>
