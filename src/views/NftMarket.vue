<template>
<div class="container" style="min-height: 85vh;" v-if="loaded">
  <div class="my-5">
    <h1 class="text-white">#1 NFT Gallery</h1>
    <div class="row mb-4" v-if="resultSet && resultSet.length > 0">
      <div v-for="(item, index) in resultSet" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <MarketableNft class="mb-2" :item="item"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MarketableNft from '@/components/items/MarketableNft'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyItems',
  components: {
    MarketableNft
  },
  data () {
    return {
      filter: 'pending',
      loaded: false
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
    this.$store.dispatch('rpayMyItemStore/fetchItems').then(() => {
      this.loaded = true
    })
  },
  methods: {
  },
  computed: {
    resultSet () { // FromIndex
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      const newAssets = []
      if (resultSet && resultSet.length > 0) {
        resultSet.forEach((ga) => {
          const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](ga.assetHash)
          if (contractAsset.nftIndex > 4) {
            ga.contractAsset = contractAsset
            newAssets.push(ga)
          }
        })
      }
      return newAssets
    }
  }
}
</script>
