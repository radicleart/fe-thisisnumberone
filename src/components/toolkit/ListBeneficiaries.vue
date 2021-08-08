<template>
<div  class="mt-3">
  <div v-if="item.contractAsset.beneficiaries">
    <b-row class="mb-4">
      <b-col cols="10">Address</b-col><b-col cols="2">Royalty</b-col>
    </b-row>
    <b-row class="mb-4" v-for="(address, index) in item.contractAsset.beneficiaries.addresses" :key="index">
      <b-col v-if="getShare(index) > 0" md="10" sm="12">{{getAddress(address)}}</b-col>
      <b-col v-if="getShare(index) > 0" md="2" sm="12">{{getShare(index)}}</b-col>
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
    getShare: function (index) {
      const contractAsset = this.item.contractAsset
      const share = contractAsset.beneficiaries.shares[index]
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
