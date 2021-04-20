<template>
<div  class="mt-3">
  <div class="upload-preview text-small">
    <div >
      <div class="row mb-4">
        <div class="col-10">Address</div><div class="col-2">Royalty</div>
      </div>
      <div class="row mb-4" v-for="(address, index) in contractAsset.beneficiaries.addresses" :key="index">
        <div v-if="getShare(index) > 0" class="col-10">{{getAddress(address)}}</div><div v-if="getShare(index) > 0" class="col-2">{{getShare(index)}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Beneficiaries',
  components: {
  },
  props: ['assetHash'],
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
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const share = contractAsset.beneficiaries.shares[index]
      if (!share) return
      return (share.value)
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    }
  }
}
</script>

<style>
</style>
