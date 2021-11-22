<template>
<div>
</div>
</template>

<script>

export default {
  name: 'MetaData',
  data: function () {
    return {
    }
  },
  mounted () {
    const nftIndex = Number(this.$route.params.nftIndex) || 0
    let contractId = this.$route.params.contractId
    if (!contractId) {
      contractId = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME
    }
    this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', { contractId: contractId, nftIndex: nftIndex }).then((asset) => {
      window.location.replace(asset.contractAsset.tokenInfo.metaDataUrl)
    })
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
