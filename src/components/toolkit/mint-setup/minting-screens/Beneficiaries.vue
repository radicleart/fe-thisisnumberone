<template>
<b-card-text class="mx-4">
  <div class="mb-3" role="group">
    <b-form v-on:submit.prevent inline>
      <label class="sr-only" for="chain-address">Editions</label>
      <b-input-group prepend="Editions" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input
          style="border-radius: none !important;"
          id="chain-address"
          v-model="editions"
          :state="editionsState"
          aria-describedby="editions-help editions-feedback"
          placeholder="Enter number of NFT editions to mint"
          trim
        ></b-form-input>
      </b-input-group>
      <b-form-invalid-feedback id="editions-feedback">
        Enter at least 3 letters
      </b-form-invalid-feedback>
    </b-form>
  </div>
  <div class="upload-preview">
    <h2 class="text-bold">Royalties</h2>
    <span v-for="(beneficiary, index) in beneficiaries" :key="index">
      <beneficiary v-on="$listeners" :beneficiary="beneficiary"/>
    </span>
    <div class="mt-4 text-right">Add a contributer <a href="#" class="ml-2 text-two" style="font-size: 24px;" @click="addBeneficiary"><b-icon scale="1em" icon="plus-circle"/></a></div>
  </div>
</b-card-text>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Beneficiary from './Beneficiary'

export default {
  name: 'Beneficiaries',
  components: {
    Beneficiary
  },
  props: ['beneficiaries'],
  data () {
    return {
      editions: 9
    }
  },
  watch: {
    'editions' () {
      this.updateEditions()
    }
  },
  methods: {
    addBeneficiary: function () {
      this.$emit('addNewBeneficiary')
      // this.$store.commit('rpayStore/setEditBeneficiary', null)
      // this.$store.commit('rpayStore/setDisplayCard', 102)
    },
    updateEditions: function () {
      if (!this.editions || this.editions < 1) {
        this.editions = 100
      }
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      configuration.gaiaAsset.editions = this.editions
      this.$store.commit('rpayStore/addConfiguration', configuration)
      configuration.opcode = 'stx-update-mint-data'
      window.eventBus.$emit('rpayEvent', configuration)
    }
  },
  computed: {
    editionsState () {
      // if (!this.editions) return null
      return (this.editions > 0)
    }
  }
}
</script>
<style lang="scss" scoped>
#rpay-pay-card .form-control {
  border-radius: none;
}
</style>
