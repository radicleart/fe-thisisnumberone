<template>
<div>
  <b-row class="mb-2" v-if="beneficiary">
    <b-col cols="4">
      <span style="cursor: pointer;" href="#" @click.prevent="showBeneficiary = !showBeneficiary">
        <b-icon icon="chevron-down" v-if="showBeneficiary"/> <b-icon icon="chevron-right" v-else/>{{chainAddress()}} - {{beneficiary.role}}
      </span>
    </b-col>
    <b-col cols="3" class="text-right">
      <div class="">{{displayPrimary()}}%</div>
    </b-col>
    <b-col cols="3" class="text-right" v-if="type === 'sale'">
      <div class="">{{displaySecondary()}}%</div>
    </b-col>
    <b-col cols="2" v-if="allowEdit">
      <a href="#" @click="editBeneficiary()"><b-icon icon="pencil"/></a>
      <a class="ml-2 text-danger" href="#" @click="delBeneficiary()"><b-icon icon="trash"/></a>
    </b-col>
    <b-col v-if="showBeneficiary" cols="11" class="bg-light py-2 mt-1 my-2 ml-3">
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
  name: 'Royalty',
  components: {
  },
  props: ['beneficiary', 'index', 'contractAsset', 'type'],
  data () {
    return {
      showBeneficiary: false,
      allowEdit: true
    }
  },
  methods: {
    chainAddress: function () {
      if (this.contractAsset) {
        return this.contractAsset.beneficiaries.addresses[this.index].substring(0, 5) + '...' + this.contractAsset.beneficiaries.addresses[this.index].substring(this.contractAsset.beneficiaries.addresses[this.index].length - 5)
      }
      if (!this.beneficiary.chainAddress) return this.beneficiary.username
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
      this.$emit('update', { opcode: 'editBeneficiary', type: this.type, beneficiary: this.beneficiary })
    },
    delBeneficiary: function () {
      this.$emit('update', { opcode: 'delBeneficiary', beneficiary: this.beneficiary, type: this.type })
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
