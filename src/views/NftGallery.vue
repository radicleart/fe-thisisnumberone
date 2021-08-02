<template>
<div class="container" v-if="resultSet && resultSet.length > 0">
  <div class="my-5">
    <h1 class="text-white">#1 NFT Gallery</h1>
    <div class="row mb-4">
      <div v-for="(item, index) in resultSet" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <GalleryNft class="mb-2" :item="item"/>
      </div>
    </div>
  </div>
</div>
<div class="container" style="min-height: 85vh;" v-else>
  <b-container class="text-white mt-5">
    <h1>No Gallery NFTs</h1>
    <p>Our Gallery is coming online soon - please come back soon...</p>
  </b-container>
</div>
</template>

<script>
import GalleryNft from '@/components/marketplace/GalleryNft'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'NftGallery',
  components: {
    GalleryNft
  },
  data () {
    return {
      resultSet: [],
      loaded: false
    }
  },
  mounted () {
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((results) => {
        this.fetchContractAssets(results)
      })
    },
    fetchContractAssets (results) {
      const newAssets = []
      if (results && results.length > 0) {
        results.forEach((ga) => {
          const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](ga.assetHash)
          ga.contractAsset = contractAsset
          newAssets.push(ga)
        })
      }
      this.resultSet = newAssets
      this.loaded = true
    }
  },
  computed: {
  }
}
</script>
