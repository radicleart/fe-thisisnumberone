<template>
<section class="" id="section-minting" v-if="myNft">
  <div class="mt-3" v-if="myNft.contractAsset.owner !== profile.stxAddress">
    {{message}}
  </div>
  <b-container class="my-5 pt-5">
    <b-row style="min-height: 40vh" >
      <b-col md="4" sm="12" align-self="start" class=" text-center">
        <div  class="bg-white" style="width:100%;">
          <media-item :videoOptions="videoOptions" :dims="dims" :attributes="myNft.attributes" :targetItem="'artworkFile'"/>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="mb-4 text-white">
        <h1 class="mb-3">{{myNft.name}}</h1>
        <h2>{{myNft.artist}}</h2>
        <p class="border-bottom pb-4" style="font-size: 1.2rem;">{{myNft.contractAsset.owner}}</p>
        <div class="w-100">
          <p class="pt-4 text-small" v-html="preserveWhiteSpace(myNft.description)"></p>
        </div>
        <TransferNft :myNft="myNft" />
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
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: false,
        poster: (this.myNft.attributes.coverImage) ? this.myNft.attributes.coverImage.fileUrl : null,
        sources: [
          { src: this.myNft.attributes.artworkFile.fileUrl, type: this.myNft.attributes.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    myNft () {
      const purchased = this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      if (purchased && purchased.length > 0) {
        return purchased.find((o) => o.assetHash === this.assetHash)
      }
      return null
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>

<style scoped>
</style>
