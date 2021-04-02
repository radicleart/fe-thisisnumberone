<template>
<div class="container hundred-vh">
<div class="mt-3" v-if="!item">
  {{message}}
</div>
<div class="mt-3 text-white" v-else>
  <div class="row">
    <div class="col-md-9 col-sm-12">
      <div id="result-item" class="mb-4">
        <media-item :videoOptions="videoOptions" :nftMedia="nftMedia" :targetItem="'artworkFile'" :dims="dims"/>
      </div>

      <div>
        <div class="mb-2 d-flex justify-content-between">
          <div class="">{{item.name}}</div>
          <div class=""><router-link :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"/></router-link></div>
        </div>
        <div class="text-small">Uploaded by : {{item.uploader}}</div>
      </div>
    </div>
    <div class="col-md-3 col-sm-12">
      <div class="mb-2 text-bold">Editions {{item.editions}}</div>
      <span class="text-small mr-1" v-for="(kw, index) in item.keywords" :key="index">#{{kw.name}}</span>
      <div class="text-small">{{item.description}}</div>
      <item-mint-info :item="item" />
    </div>
  </div>
</div>
</div>
</template>

<script>
import ItemMintInfo from '@/components/items/ItemMintInfo'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'ItemPreview',
  components: {
    ItemMintInfo,
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
        this.$router.push('/404')
      }
    })
  },
  methods: {
  },
  computed: {
    videoOptions () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      const videoOptions = {
        autoplay: false,
        controls: true,
        poster: (item.nftMedia.coverImage) ? item.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: item.nftMedia.artworkFile.fileUrl, type: item.nftMedia.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    item () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
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
