<template>
<b-card-text class="mx-4">
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
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
