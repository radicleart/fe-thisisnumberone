<template>
<div v-if="item && item.nftMedia" class="mt-3">
  <media-item :videoOptions="videoOptions" :dims="dims" :nftMedia="item.nftMedia" :targetItem="'artworkFile'"/>
  <div class="">
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="text-bold">
        <router-link :to="assetUrl"><b-icon class="mr-2" icon="arrow-up-right-square"/></router-link>{{item.name}}
      </div>
      <div>
        <router-link v-if="!contractGaiaAsset" class="mr-2" :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"></b-icon></router-link>
        <a v-if="!contractGaiaAsset" href="#" @click.prevent="deleteItem" class="text-danger"><b-icon icon="trash"></b-icon></a>
      </div>
    </div>
    <item-mint-info :item="item" :contractGaiaAsset="contractGaiaAsset" />
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import { APP_CONSTANTS } from '@/app-constants'
import ItemMintInfo from '@/components/items/ItemMintInfo'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'SingleItem',
  components: {
    ItemMintInfo,
    MediaItem
  },
  props: ['item'],
  data () {
    return {
      dims: { width: 360, height: 202 },
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png')
    }
  },
  methods: {
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
    contractGaiaAsset () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return asset
    },
    videoOptions () {
      let file = this.item.nftMedia.artworkFile
      if (!file) {
        file = this.item.nftMedia.artworkClip
      }
      if (!file) return {}
      const videoOptions = {
        autoplay: false,
        controls: true,
        poster: (this.item.nftMedia.coverImage) ? this.item.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: file.fileUrl, type: file.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    bannerImage () {
      let imageUrl = this.item.nftMedia.imageUrl
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
</style>
