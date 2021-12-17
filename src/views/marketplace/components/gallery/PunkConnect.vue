<template>
<span>
  <b-link v-if="!revealing && allowReveal()" class="text-small text-warning px-2 py-0 my-0" v-b-tooltip.hover="{ variant: 'warning' }" title="Tear here to reveal your Crash Punk" @click.prevent="revealImage()"><span>reveal</span></b-link>
  <b-link v-if="revealing" class="text-small text-warning px-2 py-0 my-0" v-b-tooltip.hover="{ variant: 'warning' }" title="Takes a few moments"><span><b-icon icon="circle" animation="throb" font-scale="1"/> revealing..</span></b-link>
</span>
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
      gaiaLocation1: null,
      gaiaLocation2: null,
      revealing: false
    }
  },
  mounted () {
    const item = this.asset
    this.gaiaLocation1 = item.contractAsset.tokenInfo.metaDataUrl
    let assetPath = item.assetHash + '.json'
    if (this.loopRun.type === 'punks') {
      assetPath = item.attributes.collection + '/' + item.attributes.index + '.json'
    } else if (item.attributes.collection) {
      assetPath = item.attributes.collection + '/' + item.assetHash + '.json'
    }
    if (this.profile.gaiaHubConfig) this.gaiaLocation2 = this.profile.gaiaHubConfig.url_prefix + this.profile.gaiaHubConfig.address + '/' + assetPath
  },
  methods: {
    allowReveal () {
      if (!this.myNfts || !this.loopRun) return false
      const image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.asset)
      return this.loopRun.status === 'active' && image && image.indexOf(this.loopRun.mintImage3) > -1
    },
    revealImage () {
      this.$store.dispatch('rpayCategoryStore/fetchLoopRunForReveal', { currentRunKey: this.loopRun.currentRunKey, contractId: this.loopRun.contractId, nftIndex: this.asset.contractAsset.nftIndex }).then((loopRun) => {
        this.fixMetaData(loopRun)
      })
    },
    fixMetaData (loopRun) {
      // create but don't store - wait till the last minute to register the batch!
      // see component MintingFlow.vue
      if (!loopRun.punkImageBaseUrl) {
        this.$notify({ type: 'error', title: 'Reveal', text: 'Base url is not set - please talk to tech team!' })
        throw new Error('Expecting base url and type for the images.')
      }
      this.revealing = true
      this.$emit('update', { opcode: 'update-interim-image' })
      const image = loopRun.punkImageBaseUrl + this.asset.attributes.index + loopRun.punkImageType
      this.$store.dispatch('publicItemsStore/fetchTraits', this.asset.attributes.index).then((trait) => {
        const traits = trait.attributes
        if (trait.attributes) delete trait.attributes
        if (trait.image) delete trait.image
        if (trait.rarityScore) delete trait.rarityScore
        if (trait.normalizedRarityScore) delete trait.normalizedRarityScore
        if (trait.rank) delete trait.rank
        if (trait._id) delete trait._id
        if (trait.id) delete trait.id
        if (trait.description) delete trait.description
        this.asset.properties = trait
        this.asset.properties.traits = traits
        this.asset.attributes.imageHash = trait.imageHash
        utils.fetchBase64FromImageUrl(image, document).then((data) => {
          this.asset.attributes.artworkFile.dataUrl = data.dataURL
          this.asset.attributes.artworkFile.type = data.mimeType
          this.asset.attributes.artworkFile.fileUrl = image
          this.storeInGaia(this.asset, this.asset.attributes.artworkFile)
        })
      })
    },
    storeInGaia: function (myAsset, artworkFile) {
      this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: myAsset.assetHash, attributes: artworkFile }).then((fileData) => {
        myAsset.attributes.dataUrl = null
        if (!myAsset.attributes.collection) myAsset.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
        myAsset.attributes.collections = null
        myAsset.attributes[fileData.id] = fileData
        myAsset.image = fileData.fileUrl
        myAsset.contractId = this.loopRun.contractId
        myAsset.cryptoPunk = true
        this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((item) => {
          this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
          this.$notify({ type: 'success', title: 'Save Data', text: 'Meta data saved to gaia!' })
          if (this.gaiaLocation2 && this.gaiaLocation1 !== this.gaiaLocation2) {
            this.$notify({ type: 'warning', title: 'Asset Transferred', text: 'Asset transfer detected (transfer or purchase) we need to update the meta data url in the contract to point to the new meta data location!' })
            const contractAsset = item.contractAsset
            const data = {
              contractAddress: this.loopRun.contractId.split('.')[0],
              contractName: this.loopRun.contractId.split('.')[1],
              nftIndex: contractAsset.nftIndex,
              metaDataUrl: this.gaiaLocation2,
              sendAsSky: true
            }
            return this.$store.dispatch('rpayPurchaseStore/updateMetaDataUrl', data).then((result) => {
              this.transferring = null
              this.result = result
            }).catch((err) => {
              this.transferring = err
            })
          }
          const data = { contractId: this.loopRun.contractId, nftIndex: myAsset.contractAsset.nftIndex }
          this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', data).then(() => {
            this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then(() => {
              this.$emit('update', { opcode: 'update-image', asset: item })
              this.revealing = false
            })
          })
        }).catch(() => {
          this.$notify({ type: 'error', title: 'Save Error', text: 'Error save meta data file to gaia!' })
        })
      })
    }
  },
  computed: {
    myNfts () {
      return this.$route.name === 'my-nfts'
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    }
  }
}
</script>
<style scoped>
</style>
