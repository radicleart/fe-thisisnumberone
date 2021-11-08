<template>
<div class="mt-3" v-if="!loading">
    <b-row class="mb-2 text-success">
      <b-col cols="6">Address</b-col>
      <b-col cols="2">Primary</b-col>
      <b-col cols="2">Secondary</b-col>
    </b-row>
  <div v-if="itemBeneficiaries">
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="'STX Address of the secondary buyer/owner owner'">Secondary Buyer/Owner</span></b-col>
      <b-col cols="2">{{itemBeneficiaries.shares[0].value}}</b-col>
      <b-col cols="2">{{itemBeneficiaries.secondaries[0].value}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="itemBeneficiaries.addresses[1].valueHex">Maker</span></b-col>
      <b-col cols="2">{{itemBeneficiaries.shares[1].value}}</b-col>
      <b-col cols="2">{{itemBeneficiaries.secondaries[1].value}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="itemBeneficiaries.addresses[2].valueHex">Artist</span></b-col>
      <b-col cols="2">{{itemBeneficiaries.shares[2].value}}</b-col>
      <b-col cols="2">{{itemBeneficiaries.secondaries[2].value}}</b-col>
    </b-row>
    <b-row class="mb-2" v-if="itemBeneficiaries && itemBeneficiaries.shares[3]">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="itemBeneficiaries.addresses[3].valueHex">Marketplace</span></b-col>
      <b-col cols="2">{{itemBeneficiaries.shares[3].value}}</b-col>
      <b-col cols="2">{{itemBeneficiaries.secondaries[3].value}}</b-col>
    </b-row>
    <!--
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="itemBeneficiaries[1]" :index="1"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="itemBeneficiaries[0]" :index="0"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="itemBeneficiaries[2]" :index="2"/>
    <Beneficiary v-on="$listeners" :contractAsset="item.contractAsset" :beneficiary="itemBeneficiaries[3]" :index="3"/>
      <div v-for="(beneficiary, index) in item.itemBeneficiaries" :key="index">
      <Beneficiary :beneficiary="beneficiary" :contractAsset="item.contractAsset" :index="index"/>
    </div>
    -->
  </div>
  <div v-else-if="beneficiaries">
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="'STX Address of the secondary buyer/owner owner'">Secondary Buyer/Owner</span></b-col>
      <b-col cols="2">{{beneficiaries[0].royalty}}</b-col>
      <b-col cols="2">{{beneficiaries[0].secondaryRoyalty}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="beneficiaries[1].chainAddress">Maker</span></b-col>
      <b-col cols="2">{{beneficiaries[1].royalty}}</b-col>
      <b-col cols="2">{{beneficiaries[1].secondaryRoyalty}}</b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="beneficiaries[2].chainAddress">Artist</span></b-col>
      <b-col cols="2">{{beneficiaries[2].royalty}}</b-col>
      <b-col cols="2">{{beneficiaries[2].secondaryRoyalty}}</b-col>
    </b-row>
    <b-row class="mb-2" v-if="itemBeneficiaries && itemBeneficiaries.shares[3]">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="itemBeneficiaries.addresses[3].valueHex">Marketplace</span></b-col>
      <b-col cols="2">{{itemBeneficiaries.shares[3].value}}</b-col>
      <b-col cols="2">{{itemBeneficiaries.secondaries[3].value}}</b-col>
    </b-row>
  </div>
  <div v-else>
    <p>Royalties are set by the first edition of the series.</p>
  </div>
</div>
</template>

<script>

export default {
  name: 'ListBeneficiaries',
  components: {
    // Beneficiary
  },
  props: ['item', 'loopRun'],
  data: function () {
    return {
      loading: true,
      toAddress: null,
      errorMessage: null,
      beneficiaries: null,
      itemBeneficiaries: null
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
