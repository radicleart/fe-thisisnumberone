<template>
<b-card-text class="mx-4">
  <b-row>
    <b-col cols="6">
      <label for="editions">Editions <a class="fs-16" v-b-tooltip.hover="{ variant: 'light' }" :title="'Set the number of editions to allow users to mint'" href="#"><b-icon icon="question-circle"/></a></label>
        <b-form-input
          id="editions"
          v-model="item.editions"
          @blur="updateItem"
          :state="itemEditionsState"
          aria-describedby="editions-help editions-feedback"
          placeholder="Number of editions to mint"
          trim
        ></b-form-input>
      <b-form-invalid-feedback id="editions-feedback">
        How many editions of this NFT do you want to allow? At least 1 - at most 100
      </b-form-invalid-feedback>
    </b-col>
    <b-col cols="6">
      <label for="editions">Edition Cost <a class="fs-16" v-b-tooltip.hover="{ variant: 'light' }" :title="'Set the cost for a user to mint a new edition - you can change this price at any time'" href="#"><b-icon icon="question-circle"/></a></label>
        <b-form-input
          id="editionCost"
          @blur="updateItem"
          v-model="item.editionCost"
          :state="itemEditionCostState"
          aria-describedby="edition-cost-help editions-feedback"
          placeholder="Cost in STX"
          trim
        ></b-form-input>
      <b-form-invalid-feedback id="edition-cost-feedback">
        Cost of minting an edition (STX) - the amount is split between the royalties
      </b-form-invalid-feedback>
    </b-col>
  </b-row>
  <div class="upload-preview">
    <h2 class="text-bold">Royalties <a class="fs-16" v-b-tooltip.hover="{ variant: 'light' }" :title="'The first sale splits the payment between the following addresses - on secondary sale the pay is reduced to 10% of these amounts'" href="#"><b-icon icon="question-circle"/></a></h2>
    <span v-for="(beneficiary, index) in beneficiaries" :key="index">
      <beneficiary v-on="$listeners" :beneficiary="beneficiary"/>
    </span>
    <div style="font-size: 1.6rem;" class="mt-3 py-3 border-top d-flex justify-content-between">
      <div></div>
      <div class=" d-flex justify-content-between">
        <div class="mr-5">{{getRoyaltySum()}} %</div>
        <div style="width: 40px;">
        </div>
      </div>
    </div>
    <div class="mt-4 text-right"><a href="#" class="ml-2 text-two text-warning" style="font-size: 1.4rem; font-weight: 700;" @click="addBeneficiary">include more royalties <b-icon class="ml-2" scale="1em" icon="plus-circle"/></a></div>
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
  props: ['beneficiaries', 'item'],
  data () {
    return {
      formSubmitted: false
    }
  },
  watch: {
    'item.editions' () {
      // this.updateItem()
    }
  },
  methods: {
    addBeneficiary: function () {
      this.$emit('addNewBeneficiary')
      // this.$store.commit('rpayStore/setEditBeneficiary', null)
      // this.$store.commit('rpayStore/setDisplayCard', 102)
    },
    getRoyaltySum () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.royalty
      })
      sum = Math.round(sum * 100) / 100
      return sum.toFixed(2)
    },
    updateItem: function () {
      if (!this.item.editions || this.item.editions < 1) {
        this.item.editions = 1
      }
      if (!this.item.editionCost || this.item.editionCost < 0) {
        this.item.editionCost = 0
      }
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      this.item.editions = Number(this.item.editions)
      this.item.editionCost = Number(this.item.editionCost)
      configuration.gaiaAsset = this.item // .editionCost = Number(this.item.editionCost)
      this.$store.commit('rpayStore/addConfiguration', configuration)
      configuration.opcode = 'stx-update-mint-data'
      window.eventBus.$emit('rpayEvent', configuration)
    }
  },
  computed: {
    itemEditionsState () {
      if (!this.formSubmitted && !this.item.editions) return null
      return (this.item.editions > 0 && this.item.editions < 101)
    },
    itemEditionCostState () {
      if (!this.formSubmitted && !this.item.editionCost) return null
      return (this.item.editionCost >= 0)
    }
  }
}
</script>
<style lang="scss" scoped>
#rpay-pay-card .form-control {
  border-radius: none;
}
</style>
