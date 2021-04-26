<template>
<div class="container hundred-vh">
<div class="mt-3" v-if="!item">
  {{message}}
</div>
<div class="mt-3 text-white" v-else>
  <div class="row">
    <div class="col-md-7 col-sm-12">
      <div id="result-item" class="mb-4">
        <media-item :videoOptions="videoOptions" :nftMedia="nftMedia" :targetItem="targetItem()" :dims="dims"/>
      </div>

    </div>
    <div class="col-md-5 col-sm-12">
      <div>
        <div class="mb-2 d-flex justify-content-between">
          <div class="">{{item.name}}</div>
          <div class="">
            <router-link v-if="!contractAsset" class="mr-2" :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"></b-icon></router-link>
            <a v-if="!contractAsset" href="#" @click.prevent="deleteItem" class="text-danger"><b-icon icon="trash"></b-icon></a>
          </div>
        </div>
        <h6 class="text-small">By : {{item.artist}}</h6>
      </div>
      <!--
        <div class="mb-2 text-bold">Editions {{item.editions}}</div>
        <span class="text-small mr-1" v-for="(kw, index) in item.keywords" :key="index">#{{kw.name}}</span>
      -->
      <div class="text-small">{{item.description}}</div>
      <minting-tools class="w-100" :assetHash="item.assetHash" />
    </div>
  </div>
</div>
</div>
</template>

<script>
import MintingTools from '@/components/toolkit/MintingTools'
import MediaItem from '@/components/utils/MediaItem'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemPreview',
  components: {
    MintingTools,
    MediaItem
  },
  data: function () {
    return {
      dims: { width: 768, height: 432 },
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      if (!item) {
        this.$router.push('/my-items')
      }
    })
  },
  methods: {
    targetItem: function () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](item)
    }
  },
  computed: {
    videoOptions () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      const videoOptions = {
        emitOnHover: true,
        playOnHover: true,
        assetHash: this.assetHash,
        showMeta: true,
        autoplay: false,
        muted: false,
        controls: true,
        poster: (item.nftMedia.coverImage) ? item.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: item.nftMedia.artworkFile.fileUrl, type: item.nftMedia.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    nftMedia () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return item.nftMedia
    },
    keywords () {
      return this.$store.getters['myItemStore/myItem'](this.assetHash)
    }
  }
}
</script>

<style scoped>
</style>
