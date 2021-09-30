<template>
<div class="text-white">
  <Registry />
</div>
</template>

<script>
import Registry from '@/views/mgmnt/components/cache/Registry'

export default {
  name: 'ManageCache',
  components: {
    Registry
  },
  data () {
    return {
    }
  },
  mounted () {
    const config = {
      contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      functionName: 'get-balance',
      functionArgs: []
    }
    this.$store.dispatch('rpayStacksStore/callContractReadOnly', config).then((result) => {
      this.contractBalance = result.result
    })
  },
  methods: {
    buildSearchIndex: function () {
      this.$store.dispatch('assetGeneralStore/buildSearchIndex').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    buildCache: function () {
      this.$store.dispatch('assetGeneralStore/buildCache').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearSearchIndex: function () {
      this.$store.dispatch('assetGeneralStore/clearSearchIndex').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearCache: function () {
      this.$store.dispatch('assetGeneralStore/clearCache').then((result) => {
        this.$notify({ type: 'success', title: 'clear indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'clear indexing', text: err })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
