<template>
<section class="" id="section-minting" v-if="contractAsset">
  <div class="mt-3" v-if="contractAsset.owner !== profile.stxAddress">
    {{message}}
  </div>
  <b-container class="my-5 pt-5" v-if="item">
    <b-row style="min-height: 40vh" >
      <b-col md="4" sm="12" align-self="start" class=" text-center">
        <div  class="bg-white" style="width:100%;">
          <media-item :videoOptions="videoOptions" :dims="dims" :nftMedia="item.nftMedia" :targetItem="'artworkFile'"/>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="mb-4 text-white">
        <h1 class="mb-3">{{item.name}}</h1>
        <h2>{{item.artist}}</h2>
        <p class="border-bottom pb-4" style="font-size: 1.2rem;">{{owner}}</p>
        <div class="w-100">
          <p class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        </div>
        <TransferNft :assetHash="item.assetHash" />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import TransferNft from '@/components/toolkit/TransferNft'
import MediaItem from '@/components/utils/MediaItem'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'NftPreview',
  components: {
    TransferNft,
    MediaItem
  },
  data: function () {
    return {
      dims: { width: 768, height: 432 },
      showHash: false,
      assetHash: null,
      message: 'Not allowed - no NFT available...'
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    // this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash)
  },
  methods: {
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">' + content + '</span>'
    },
    targetItem: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](item)
    }
  },
  computed: {
    videoOptions () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: false,
        poster: (item.nftMedia.coverImage) ? item.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: item.nftMedia.artworkFile.fileUrl, type: item.nftMedia.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    owner () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return (contractAsset) ? contractAsset.owner : ''
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    item () {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      return gaiaAsset
    },
    nftMedia () {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      return gaiaAsset.nftMedia
    }
  }
}
</script>

<style scoped>
</style>
