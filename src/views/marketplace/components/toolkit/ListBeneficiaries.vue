<template>
<div class="mt-3">
  <div v-if="item.contractAsset.beneficiaries">
    <b-row class="mb-2 text-success">
      <b-col cols="8">Address</b-col>
      <b-col cols="2">Primary</b-col>
      <b-col cols="2">Secondary</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="8"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="item.contractAsset.beneficiaries.addresses[1].valueHex">Minter/Maker</span></b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.shares[1].value}}</b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.secondaries[1].value}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="8"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="'STX Address of the secondary buyer/owner owner'">Secondary Buyer/Owner</span></b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.shares[0].value}}</b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.secondaries[0].value}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="8"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="item.contractAsset.beneficiaries.addresses[2].valueHex">Number One Project</span></b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.shares[2].value}}</b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.secondaries[2].value}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="8"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="item.contractAsset.beneficiaries.addresses[3].valueHex">Marketplace Project</span></b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.shares[3].value}}</b-col>
      <b-col cols="2">{{item.contractAsset.beneficiaries.secondaries[3].value}}</b-col>
    </b-row>
    <!--
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="item.contractAsset.beneficiaries[1]" :index="1"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="item.contractAsset.beneficiaries[0]" :index="0"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="item.contractAsset.beneficiaries[2]" :index="2"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="item.contractAsset.beneficiaries[3]" :index="3"/>
      <div v-for="(beneficiary, index) in item.beneficiaries" :key="index">
      <Beneficiary :beneficiary="beneficiary" :contractAsset="item.contractAsset" :index="index"/>
    </div>
    -->
  </div>
  <div v-else>
    <p>Royalties are set by the first edition of the series.</p>
  </div>
</div>
</template>

<script>
// import Beneficiary from '@/views/marketplace/components/toolkit/mint-setup/minting-screens/Beneficiary'

export default {
  name: 'ListBeneficiaries',
  components: {
    // Beneficiary
  },
  props: ['item'],
  data: function () {
    return {
      toAddress: null,
      errorMessage: null
    }
  },
  methods: {
    getAddress: function (address) {
      if (!address) return
      return (address.valueHex)
    },
    showShare: function (index) {
      const contractAsset = this.item.contractAsset
      const secondary = contractAsset.beneficiaries.secondaries[index]
      const share = contractAsset.beneficiaries.shares[index]
      // if (!share) return
      return (share.value > 0 || secondary.value > 0)
    },
    getShare: function (index) {
      const contractAsset = this.item.contractAsset
      const share = contractAsset.beneficiaries.shares[index]
      if (!share) return
      return (share.value)
    },
    getSecondary: function (index) {
      const contractAsset = this.item.contractAsset
      const share = contractAsset.beneficiaries.secondaries[index]
      if (!share) return
      return (share.value)
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
