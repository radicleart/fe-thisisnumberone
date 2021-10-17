<template>
<b-card-text class="mx-1">
  <div>
    <h4 class="text-bold">Royalties</h4>
    <b-row class="text-small border-bottom mt-2 pt-2">
      <b-col cols="4">
        Role
      </b-col>
      <b-col cols="3" class="text-right">
        <span v-if="type === 'mint'">NFT Mint/Purchase</span>
      </b-col>
      <b-col cols="3" class="text-right">
        <span v-if="type === 'sale'">Primary Sale</span>
      </b-col>
      <b-col cols="3" class="text-right" v-if="type === 'sale'">
        Secondary Sales
      </b-col>
    </b-row>
    <b-row class="text-small my-2 py-2">
      <b-col cols="12">
        <div v-for="(beneficiary, index) in beneficiaries" :key="index">
          <Royalty :type="type" v-on="$listeners" :beneficiary="beneficiary" :index="index"/>
        </div>
      </b-col>
    </b-row>
    <b-row class="text-small border-top mt-2 pt-2">
      <b-col cols="4">Sum</b-col>
      <b-col cols="3"  class="text-right">
        <div>{{getRoyaltySum()}}%</div>
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
import Royalty from './Royalty'

export default {
  name: 'Royalties',
  components: {
    Royalty
  },
  props: ['beneficiaries', 'type'],
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
