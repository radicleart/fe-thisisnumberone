<template>
<div class="mt-3" v-if="!loading">
    <b-row class="mb-2 text-success">
      <b-col cols="6">Address</b-col>
      <b-col cols="3">Primary</b-col>
      <b-col cols="3">Secondary</b-col>
    </b-row>
  <div v-if="beneficiaries">
    <!--
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="'STX Address of the secondary buyer/owner owner'">Secondary Buyer/Owner</span></b-col>
      <b-col cols="3">{{beneficiaries[0].royalty}}</b-col>
      <b-col cols="3">{{beneficiaries[0].secondaryRoyalty}}</b-col>
    </b-row>
    -->
    <div v-for="(beneficiary, index) in beneficiaries" :key="index">
      <Beneficiary :beneficiary="beneficiary" :contractAsset="item.contractAsset" :index="index"/>
    </div>
  </div>
  <div v-else>
    <p>Royalties are set by the first edition of the series.</p>
  </div>
</div>
</template>

<script>
import Beneficiary from '@/views/marketplace/components/toolkit/mint-setup/minting-screens/Beneficiary'

export default {
  name: 'ListBeneficiaries',
  components: {
    Beneficiary
  },
  props: ['item', 'loopRun'],
  data: function () {
    return {
      loading: true,
      toAddress: null,
      errorMessage: null,
      beneficiaries: null
    }
  },
  mounted () {
    let currentRunKey = this.item.currentRunKey
    if (!currentRunKey) {
      currentRunKey = this.loopRun.currentRunKey
    }
    if (currentRunKey.indexOf('/') > -1) {
      currentRunKey = currentRunKey.split('/')[0]
    }
    this.itemBeneficiaries = this.item.contractAsset.beneficiaries
    this.$store.dispatch('rpayCategoryStore/fetchRoyalties', currentRunKey).then((royalties) => {
      // this.minteficaries = royalties.mintRoyalties
      this.beneficiaries = royalties.saleRoyalties
      this.loading = false
    })
  },
  methods: {
    roundRoyalty: function (roughRoy) {
      return Math.round(roughRoy * 100) / 100
    },
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
