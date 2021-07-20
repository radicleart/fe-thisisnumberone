<template>
<div v-if="displayMode === 'display'">
  <div class="text-left" style="width:100%;" v-if="item">
    <h1>NFT File</h1>
    <p>Name <a :href="item.attributes.artworkFile.fileUrl" target="_blank">{{item.attributes.artworkFile.name}}</a></p>
    <p>File size: {{item.attributes.artworkFile.size}} ({{item.attributes.artworkFile.type}})</p>
  </div>
</div>
<div v-else>
  <div class="mt-5 bg-white" style="width:100%;">
    <p class="p-3">NFT File</p>
    <media-item v-if="hasFile()" :videoOptions="videoOptions" :dims="dims" :attributes="item.attributes" :targetItem="'artworkFile'" @deleteMediaItem="deleteMediaItem"/>
    <media-upload v-else :myUploadId="'artworkFile'" :dims="dims" :contentModel="contentModel" :mediaFiles="mediaFilesImage()" :limit="1" :sizeLimit="2" :mediaTypes="'image'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/upload/MediaItem'
import MediaUpload from '@/components/upload/MediaUpload'

export default {
  name: 'ArtworkFile',
  components: {
    MediaItem,
    MediaUpload
  },
  props: ['item', 'displayMode'],
  data: function () {
    return {
      dims: { width: 360, height: 202 },
      contentModel: {
        id: 'artworkFile',
        title: 'Cover Image<br/>up to 1M',
        buttonName: 'Choose Cover Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      }
    }
  },
  methods: {
    mediaFilesImage () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      if (!item) return
      const files = []
      if (item.attributes.artworkFile && item.attributes.artworkFile.dataUrl) {
        files.push(item.attributes.artworkFile)
      }
      return files
    },
    hasFile () {
      return this.item.attributes.artworkFile && this.item.attributes.artworkFile.fileUrl
    },
    downable: function () {
      return this.uploadState > 2
    },
    deleteMediaItem: function (mediaId) {
      this.$store.dispatch('rpayMyItemStore/deleteMediaItem', { item: this.item, id: mediaId }).then(() => {
        this.$emit('delete-cover')
      })
    }
  },
  computed: {
    videoOptions () {
      const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      const videoOptions = {
        emitOnHover: true,
        playOnHover: true,
        bigPlayer: false,
        showMeta: true,
        assetHash: this.item.assetHash,
        autoplay: false,
        muted: true,
        controls: true,
        poster: (myAsset && myAsset.attributes.artworkFile) ? myAsset.attributes.artworkFile.fileUrl : null,
        fluid: true
      }
      if (myAsset && myAsset.attributes) {
        videoOptions.poster = (myAsset.attributes.artworkFile) ? myAsset.attributes.artworkFile.fileUrl : null
        videoOptions.sources = [
          { src: myAsset.attributes.artworkFile.fileUrl, type: myAsset.attributes.artworkFile.type }
        ]
      }
      return videoOptions
    }
  }
}
</script>

<style scoped>
</style>
