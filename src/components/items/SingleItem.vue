<template>
<div v-if="item && item.attributes" class="mt-1">
  <media-item :videoOptions="videoOptions" :dims="dims" :attributes="item.attributes" :targetItem="targetItem()"/>
  <div class="text-white">
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="">
        <b-link router-tag="a" :to="assetUrl">{{item.name}}</b-link> <span v-if="contractAsset">{{contractAsset.tokenInfo.edition}} / {{contractAsset.tokenInfo.maxEditions}}</span>
      </div>
      <div>
        <b-link class="mr-2" :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"></b-icon></b-link>
        <a v-if="!contractAsset" href="#" @click.prevent="deleteItem" class="text-danger"><b-icon icon="trash"></b-icon></a>
      </div>
    </div>
      <div class="text-small text-right">
        <div><b-link router-tag="a" :to="assetUrl">{{salesButtonLabel()}}</b-link></div>
      </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'SingleItem',
  components: {
    MediaItem
  },
  props: ['item'],
  data () {
    return {
      dims: { width: 360, height: 360 },
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png')
    }
  },
  methods: {
    salesButtonLabel () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      if (!contractAsset) return 'NOT MINTED'
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](contractAsset.saleData.saleType)
    },
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.item)
    },
    hoverIn (index) {
      this.dHover[index] = true
      this.componentKey += 1
    },
    isAllowed (opcode) {
      if (opcode === 'delete' || opcode === 'edit') {
        return this.item.nftIndex === -1
      }
    },
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    toggleFavourite () {
      utils.makeFlasher(this.$refs.lndQrcode)
    },
    deleteItem () {
      this.$store.dispatch('myItemStore/deleteItem', this.item)
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    videoOptions () {
      let file = this.item.attributes.artworkFile
      if (!file) {
        file = this.item.attributes.artworkClip
      }
      if (!file) return {}
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: false,
        assetHash: this.item.assetHash,
        autoplay: false,
        muted: true,
        controls: false,
        showMeta: false,
        aspectRatio: '1:1',
        poster: (this.item.attributes.coverImage) ? this.item.attributes.coverImage.fileUrl : null,
        sources: [
          { src: file.fileUrl, type: file.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    bannerImage () {
      let imageUrl = this.item.attributes.imageUrl
      if (!imageUrl) {
        imageUrl = this.waitingImage
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](imageUrl)
    },
    assetUrl () {
      if (this.item.assetHash) {
        return '/item-preview/' + this.item.assetHash
      }
      return '/upload-item/' + this.item.assetHash
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #fff;
}
</style>
