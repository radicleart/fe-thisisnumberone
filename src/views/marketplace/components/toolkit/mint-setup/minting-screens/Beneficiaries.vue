<template>
<b-card-text class="mx-1">
  <div>
    <h4 class="text-bold">Royalties</h4>
    <b-row class="text-small border-bottom mt-2 pt-2">
      <b-col cols="6">
        Role
      </b-col>
      <b-col cols="3" class="text-right">
        <span v-if="!hidePrimaries">Primary Sale</span>
      </b-col>
      <b-col cols="3" class="text-right">
        Secondaries
      </b-col>
    </b-row>
    <b-row class="text-small my-2 py-2">
      <b-col cols="12" v-for="(bene, index) in beneficiaries" :key="index">
        <Beneficiary :beneficiary="bene" v-on="$listeners" :hidePrimaries="hidePrimaries" :beneficiary="bene" :index="index"/>
        <!--
        <Beneficiary v-on="$listeners" :beneficiary="beneficiaries[1]" :index="1"/>
        <Beneficiary v-on="$listeners" :beneficiary="beneficiaries[0]" :index="0"/>
        <Beneficiary v-on="$listeners" :beneficiary="beneficiaries[2]" :index="2"/>
        <Beneficiary v-on="$listeners" :beneficiary="beneficiaries[3]" :index="3"/>
        -->
      </b-col>
    </b-row>
    <b-row class="text-small border-top mt-2 pt-2">
      <b-col cols="6">Sum</b-col>
      <b-col cols="3"  class="text-right">
        <div v-if="!hidePrimaries">{{getRoyaltySum()}}%</div>
      </b-col>
      <b-col cols="3" class="text-right">
        <div>{{getRoyaltySecSum()}}%</div>
      </b-col>
    </b-row>
    <div v-if="allowEdit" class="mt-4 text-right">Add a contributer <a href="#" class="ml-2 text-two" style="font-size: 24px;" @click="addBeneficiary"><b-icon scale="1em" icon="plus-circle"/></a></div>
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
  props: ['beneficiaries', 'hidePrimaries'],
  data () {
    return {
      editions: 1,
      allowEdit: false
    }
  },
  methods: {
    addBeneficiary: function () {
      this.$emit('addNewBeneficiary')
      // this.$store.commit('rpayStore/setEditBeneficiary', null)
      // this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 102)
    },
    getRoyaltySecSum () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.secondaryRoyalty
      })
      sum = Math.round(sum * 100) / 100
      return sum
    },
    getRoyaltySum () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.royalty
      })
      sum = Math.round(sum * 100) / 100
      return sum
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
