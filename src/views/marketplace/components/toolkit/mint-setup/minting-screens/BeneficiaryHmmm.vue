<template>
<div>
  <b-row class="mb-2" v-if="beneficiary">
    <b-col cols="6">
      <span style="cursor: pointer;" href="#" @click.prevent="showBeneficiary = !showBeneficiary">
        <b-icon icon="chevron-down" v-if="showBeneficiary"/> <b-icon icon="chevron-right" v-else/> {{beneficiary.role}}
      </span>
      <div v-if="allowEdit">
        <a href="#" @click="editBeneficiary()"><b-icon icon="pencil"/></a>
        <a class="ml-2 text-danger" href="#" @click="removeBeneficiary()"><b-icon icon="trash"/></a>
      </div>
    </b-col>
    <b-col cols="3" class="text-right">
      <div v-if="!hidePrimaries">{{displayPrimary()}}%</div>
    </b-col>
    <b-col cols="3" class="text-right">
      <div class="">{{displaySecondary()}}%</div>
    </b-col>
    <b-col cols="11" class="py-2 mt-1 my-2 ml-3" v-if="showBeneficiary">
      <b-row v-if="index === 0">
        <b-col md="3" sm="12">Address</b-col>
        <b-col md="9" sm="12" class="">Seller Address</b-col>
      </b-row>
      <b-row v-else-if="index === 1">
        <b-col md="3" sm="12">Address</b-col>
        <b-col md="9" sm="12" class="">{{profile.stxAddress}}</b-col>
      </b-row>
      <b-row v-else>
        <b-col md="3" sm="12">Address</b-col>
        <b-col md="9" sm="12" class="">{{beneficiary.chainAddress}}</b-col>
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
  name: 'Beneficiary',
  components: {
  },
  props: ['beneficiary', 'index', 'contractAsset', 'hidePrimaries'],
  data () {
    return {
      showBeneficiary: false,
      allowEdit: false
    }
  },
  methods: {
    chainAddress: function () {
      if (this.contractAsset) {
        return this.contractAsset.beneficiaries.addresses[this.index].substring(0, 5) + '...' + this.contractAsset.beneficiaries.addresses[this.index].substring(this.contractAsset.beneficiaries.addresses[this.index].length - 5)
      }
      if (this.beneficiary.username) return this.beneficiary.username
      return this.beneficiary.chainAddress.substring(0, 5) + '...' + this.beneficiary.chainAddress.substring(this.beneficiary.chainAddress.length - 5)
    },
    displayPrimary: function () {
      let num = 0
      if (this.contractAsset) {
        num = this.contractAsset.beneficiaries.shares[this.index].value
      } else {
        num = this.beneficiary.royalty
      }
      return parseFloat(num).toFixed(2)
    },
    displaySecondary: function () {
      let num = 0
      if (this.contractAsset) {
        num = this.contractAsset.beneficiaries.secondaries[this.index].value
      } else {
        num = this.beneficiary.secondaryRoyalty
      }
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
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      return application
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
