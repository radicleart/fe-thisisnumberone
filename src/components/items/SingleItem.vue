<template>
<div class="mt-3">
  <router-link :to="assetUrl">
    <media-item :dims="dims" :nftMedia="item.nftMedia" :targetItem="'artworkFile'"/>
  </router-link>
  <div class="ml-1">
    <div class="mb-2 d-flex justify-content-between">
      <div class="text-bold">{{item.name}}</div>
      <div v-if="isDeletable()">
        <router-link class="mr-2" :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"></b-icon></router-link>
        <a href="#" @click.prevent="deleteItem" class="text-danger"><b-icon icon="trash"></b-icon></a>
      </div>
    </div>
    <item-mint-info :item="item" />
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
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    toggleFavourite () {
      utils.makeFlasher(this.$refs.lndQrcode)
    },
    deleteItem () {
      this.$store.dispatch('myItemStore/deleteItem', this.item)
    },
    isDeletable () {
      return !this.item.nftIndex || this.item.nftIndex === -1
    }
  },
  computed: {
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
