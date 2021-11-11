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
      this.fixMetaData()
    },
    allowRevealImage () {
      const image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.asset)
      return this.loopRun.status === 'active' && image && image.indexOf(this.loopRun.mintImage3) > -1
    },
    fixMetaData () {
      // create but don't store - wait till the last minute to register the batch!
      // see component MintingFlow.vue
      if (!this.loopRun.punkImageBaseUrl) {
        throw new Error('Expecting base url and type for the images.')
      }
      const image = this.loopRun.punkImageBaseUrl + this.asset.attributes.index + this.loopRun.punkImageType
      utils.fetchBase64FromImageUrl(image, document).then((data) => {
        this.asset.attributes.artworkFile.dataUrl = data.dataURL
        this.asset.attributes.artworkFile.type = data.mimeType
        this.asset.attributes.artworkFile.fileUrl = image
        this.storeInGaia(this.asset, this.asset.attributes.artworkFile)
      })
    },
    storeInGaia: function (myAsset, artworkFile) {
      this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: myAsset.assetHash, attributes: artworkFile }).then((attributes) => {
        attributes.dataUrl = null
        myAsset.attributes[attributes.id] = attributes
        myAsset.image = myAsset.attributes[attributes.id].fileUrl
        myAsset.projectId = this.loopRun.contractId
        myAsset.cryptoPunk = true
        this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then(() => {
          this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
          this.$notify({ type: 'success', title: 'Save Data', text: 'Meta data saved to gaia!' })
          const data = { contractId: this.loopRun.contractId, nftIndex: myAsset.contractAsset.nftIndex }
          this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', data).then(() => {
            this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then((item) => {
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
