<template>
<div v-if="myNft && myNft.nftMedia" class="mt-1">
  <b-link router-tag="a" :to="assetUrl">
    <media-item :videoOptions="videoOptions" :dims="dims" :nftMedia="myNft.nftMedia" :targetItem="targetItem()"/>
  </b-link>
  <div class="text-white">
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="">
        <b-link router-tag="a" :to="assetUrl">{{myNft.name}}</b-link>
      </div>
      <div class=""><b-link router-tag="a" :to="assetUrl">Ed. {{myNft.contractAsset.tokenInfo.edition}} / {{myNft.contractAsset.tokenInfo.maxEditions}}</b-link></div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'SingleNft',
  components: {
    MediaItem
  },
  props: ['myNft'],
  data () {
    return {
      dims: { width: 360, height: 360 }
    }
  },
  methods: {
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.myNft)
    }
  },
  computed: {
    videoOptions () {
      let file = this.myNft.nftMedia.artworkFile
      if (!file) {
        file = this.myNft.nftMedia.artworkClip
      }
      if (!file) return {}
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: false,
        assetHash: this.myNft.assetHash,
        autoplay: false,
        muted: true,
        controls: false,
        showMeta: false,
        aspectRatio: '1:1',
        poster: (this.myNft.nftMedia.coverImage) ? this.myNft.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: file.fileUrl, type: file.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    assetUrl () {
      return '/nft-preview/' + this.myNft.assetHash
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #fff;
}
</style>
