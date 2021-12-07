<template>
<div class="" v-if="allowRevealImage()">
  <div class="text-center mb-3">
    <span class="pointer text-danger" @click="revealImage()">tear and claim your punk!</span>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PunkConnect',
  components: {
  },
  props: ['asset', 'loopRun'],
  data () {
    return {
    }
  },
  methods: {
    revealImage () {
      this.$store.dispatch('rpayCategoryStore/fetchLoopRunForReveal', { currentRunKey: this.loopRun.currentRunKey, contractId: this.loopRun.contractId, nftIndex: this.asset.contractAsset.nftIndex }).then((loopRun) => {
        this.fixMetaData(loopRun)
      })
    },
    allowRevealImage () {
      const image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.asset)
      return this.loopRun.status === 'active' && image && image.indexOf(this.loopRun.mintImage3) > -1
    },
    // https://res.cloudinary.com/mijo-enterprises/image/upload/v1635240308/collections/artists/artist1/set3/907.png
    // https://res.cloudinary.com/mijo-enterprises/image/upload/v1635240326/collections/artists/artist1/set3/
    fixMetaData (loopRun) {
      // create but don't store - wait till the last minute to register the batch!
      // see component MintingFlow.vue
      if (!loopRun.punkImageBaseUrl) {
        throw new Error('Expecting base url and type for the images.')
      }
      const image = loopRun.punkImageBaseUrl + this.asset.attributes.index + loopRun.punkImageType
      utils.fetchBase64FromImageUrl(image, document).then((data) => {
        // this.asset.attributes.imageFrom = image
        this.asset.attributes.imageHash = utils.buildHash(data.dataURL)
        this.asset.attributes.artworkFile.dataUrl = data.dataURL
        this.asset.attributes.artworkFile.type = data.mimeType
        this.asset.attributes.artworkFile.fileUrl = image
        this.storeInGaia(this.asset, this.asset.attributes.artworkFile)
      })
    },
    storeInGaia: function (myAsset, artworkFile) {
      this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: myAsset.assetHash, attributes: artworkFile }).then((fileData) => {
        myAsset.attributes.dataUrl = null
        if (!myAsset.attributes.collection) myAsset.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
        myAsset.attributes.collections = null
        myAsset.attributes[fileData.id] = fileData
        myAsset.image = fileData.fileUrl
        myAsset.projectId = this.loopRun.contractId
        myAsset.cryptoPunk = true
        this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((item) => {
          this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
          this.$notify({ type: 'success', title: 'Save Data', text: 'Meta data saved to gaia!' })
          const data = { contractId: this.loopRun.contractId, nftIndex: myAsset.contractAsset.nftIndex }
          this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', data).then(() => {
            this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then(() => {
              this.$emit('updateImage', item)
            })
          })
        }).catch(() => {
          this.$notify({ type: 'error', title: 'Save Error', text: 'Error save meta data file to gaia!' })
        })
      })
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
<style scoped>
</style>
