<template>
  <b-modal size="lg" id="asset-offer-modal">
    <div class="mb-3" role="group">
      <label for="email">Make an Offer on this Artwork</label>
      <b-form-text id="email-help">Please enter an email address to receive updates</b-form-text>
      <b-form-input
        id="email"
        v-model="email"
        :state="validEmail"
        aria-describedby="email-help email-feedback"
        placeholder="Enter email address"
        trim
      ></b-form-input>
      <b-form-invalid-feedback id="email-feedback">
        Enter email
      </b-form-invalid-feedback>
    </div>
    <template #modal-header>
    </template>
    <template #modal-footer>
      <div class="w-100 d-flex justify-content-between">
        <div class="mr-3 w-75 border-top"></div>
        <div class="w-25" style="position: relative; top: -20px;"><b-button @click="registerForUpdates()" variant="light">SUBMIT</b-button></div>
      </div>
    </template>
  </b-modal>
</template>

<script>

export default {
  name: 'AssetOfferModal',
  components: {
  },
  data () {
    return {
      email: null,
      message: null
    }
  },
  methods: {
    isValid: function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },
    registerForUpdates: function () {
      if (!this.isValid()) return
      this.$store.dispatch('assetGeneralStore/registerForUpdates', { email: this.email }).then((result) => {
        this.message = result
      })
    }
  },
  computed: {
    validEmail () {
      return this.email && this.isValid()
    },
    updateMessage () {
      return ''
    }
  }
}
</script>
<style lang="scss" >
</style>
