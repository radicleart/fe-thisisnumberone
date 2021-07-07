<template>
<div v-if="item && item.attributes" class="mt-1">
  <div @click="routeTo()"><media-item :videoOptions="videoOptions" :dims="dims" :attributes="item.attributes" :targetItem="targetItem()"/></div>
  <div class="text-white">
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="">
        <b-link router-tag="a" :to="assetUrl">{{item.name}}</b-link>
      </div>
      <div class=""><b-link router-tag="a" :to="assetUrl">Ed. {{myNft.tokenInfo.edition}} / {{myNft.tokenInfo.maxEditions}}</b-link></div>
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
      dims: { width: 360, height: 360 },
      assetHash: null
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.myNft.tokenInfo.assetHash
    // this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash)
  },
  methods: {
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.item)
    },
    routeTo: function () {
      this.$router.push(this.assetUrl)
    }
  },
  computed: {
    videoOptions () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      let file = item.attributes.artworkFile
      if (!file) {
        file = item.attributes.artworkClip
      }
      if (!file) return {}
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: false,
        assetHash: this.assetHash,
        autoplay: false,
        muted: true,
        controls: false,
        showMeta: false,
        aspectRatio: '1:1',
        poster: (item.attributes.coverImage) ? item.attributes.coverImage.fileUrl : null,
        sources: [
          { src: file.fileUrl, type: file.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      return item
    },
    assetUrl () {
      return '/nft-preview/' + this.assetHash
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #fff;
}
</style>
