<template>
<div class="mt-1 mx-4 text-center">
  <div v-if="item && item.attributes">
    <MediaItemGeneral :classes="'item-image'" :options="options" :mediaItem="getMediaItem().artworkFile"/>
  </div>
  <div class="mt-1 d-flex justify-content-end">
    <div class="text-small text-right">
      <ItemActionMenu :item="item"/>
    </div>
  </div>
  <div class="mt-4 text-left">
    <b-link router-tag="a" :to="assetUrl">{{item.name}}</b-link>
  </div>
  <div class="text-small text-left">
    <div><b-link router-tag="a" :to="assetUrl">{{salesButtonLabel}}</b-link></div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import ItemActionMenu from '@/components/items/ItemActionMenu'

export default {
  name: 'MySingleNft',
  components: {
    MediaItemGeneral,
    ItemActionMenu
  },
  props: ['item', 'token'],
  data () {
    return {
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
  },
  methods: {
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](this.item)
      return attributes
    }
  },
  computed: {
    salesButtonLabel () {
      if (!this.token) return 'NOT MINTED'
      return 'MINTED #' + this.token.nftIndex + ' (Ed. ' + this.token.tokenInfo.edition + ' of ' + this.token.tokenInfo.maxEditions + ')'
    },
    options () {
      const attributes = this.getMediaItem()
      return {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: false,
        assetHash: this.item.assetHash,
        autoplay: false,
        muted: true,
        controls: false,
        showMeta: false,
        aspectRatio: '1:1',
        poster: (attributes.coverImage) ? attributes.coverImage.fileUrl : attributes.artworkFile.fileUrl,
        sources: [
          { src: attributes.artworkFile.fileUrl, type: attributes.artworkFile.type }
        ],
        fluid: false
      }
    },
    assetUrl () {
      if (!this.item.contractAsset) {
        return '/item-preview/' + this.item.assetHash + '/' + 0
      } else {
        if (this.token) {
          return '/item-preview/' + this.item.assetHash + '/' + this.token.tokenInfo.edition
        } else {
          return '/item-preview/' + this.item.assetHash + '/' + this.item.contractAsset.tokenInfo.edition
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #fff;
}
</style>
