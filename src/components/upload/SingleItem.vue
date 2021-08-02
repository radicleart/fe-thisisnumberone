<template>
<div v-if="item && item.attributes" class="mt-1 mx-4 text-center">
  <div>
    <MediaItemGeneral :classes="'item-image'" :options="options" :mediaItem="getMediaItem().artworkFile"/>
  </div>
  <div class="mt-4 d-flex justify-content-end" style="width: 250px;">
    <div class="text-small text-right">
      <ItemActionMenu :item="item" :variant="'white'" />
    </div>
  </div>
  <div class="text-left">
    <b-link router-tag="a" :to="assetUrl">{{item.name}}</b-link> <span v-if="contractAsset">{{contractAsset.tokenInfo.edition}} / {{contractAsset.tokenInfo.maxEditions}}</span>
  </div>
  <div class="text-small text-left">
    <div><b-link router-tag="a" :to="assetUrl">{{salesButtonLabel()}}</b-link></div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import ItemActionMenu from '@/components/items/ItemActionMenu'

export default {
  name: 'SingleItem',
  components: {
    MediaItemGeneral,
    ItemActionMenu
  },
  props: ['item'],
  data () {
    return {
      dims: { width: 360, height: 360 },
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png')
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
  },
  methods: {
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](this.item)
      return attributes
    },
    salesButtonLabel () {
      const contractAsset = this.item.contractAsset
      if (!contractAsset) return 'NOT MINTED'
      return 'MINTED' // this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](contractAsset.saleData.saleType)
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
      this.$store.dispatch('rpayMyItemStore/deleteItem', this.item)
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
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
