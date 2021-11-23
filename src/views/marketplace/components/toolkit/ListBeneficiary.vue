<template>
<div>
  <b-row class="mb-2" v-if="beneficiary">
    <b-col cols="6" v-if="beneficiary.role">
      <span style="cursor: pointer;" href="#" @click.prevent="showBeneficiary = !showBeneficiary">
        <b-icon icon="chevron-down" v-if="showBeneficiary"/> <b-icon icon="chevron-right" v-else/> {{beneficiary.role}}
      </span>
      <div v-if="allowEdit">
        <a href="#" @click="editBeneficiary()"><b-icon icon="pencil"/></a>
        <a class="ml-2 text-danger" href="#" @click="removeBeneficiary()"><b-icon icon="trash"/></a>
      </div>
    </b-col>
    <b-col cols="6" v-else>
      <span style="cursor: pointer;" href="#">
        {{beneficiary.chainAddress}}
      </span>
    </b-col>
    <b-col cols="3" class="text-left">
      <div v-if="!hidePrimaries">{{displayPrimary()}}%</div>
    </b-col>
    <b-col cols="3" class="text-left">
      <div class="">{{displaySecondary()}}%</div>
    </b-col>
    <b-col cols="11" class="py-2 mt-1 my-2 ml-3" v-if="showBeneficiary">
      <b-row v-if="index === 0">
        <b-col>Seller Address</b-col>
      </b-row>
      <b-row v-else-if="index === 1">
        <b-col>{{profile.stxAddress}}</b-col>
      </b-row>
      <b-row v-else>
        <b-col>{{beneficiary.chainAddress}}</b-col>
      </b-row>
      <!--
      <b-row v-if="beneficiary.email">
        <b-col md="3" sm="12">Email</b-col>
        <b-col md="9" sm="12" class="">{{beneficiary.email}}</b-col>
      </b-row>
      -->
    </b-col>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'ListBeneficiary',
  components: {
  },
  props: ['beneficiary', 'index', 'hidePrimaries'],
  data () {
    return {
      showBeneficiary: false,
      allowEdit: false
    }
  },
  methods: {
    chainAddress: function () {
      return this.beneficiary.chainAddress.substring(0, 5) + '...' + this.beneficiary.chainAddress.substring(this.beneficiary.chainAddress.length - 5)
    },
    displayPrimary: function () {
      const num = this.beneficiary.royalty
      return parseFloat(num).toFixed(2)
    },
    displaySecondary: function () {
      const num = this.beneficiary.secondaryRoyalty
      return parseFloat(num).toFixed(2)
    },
    displayAddress: function () {
      return this.beneficiary.role
      // return this.beneficiary.chainAddress.substring(0, 5) + '...' + this.beneficiary.chainAddress.substring(this.beneficiary.chainAddress.length - 5)
    },
    editBeneficiary: function () {
      this.$emit('editBeneficiary', this.beneficiary)
    },
    removeBeneficiary: function () {
      this.$emit('removeBeneficiary', this.beneficiary)
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
