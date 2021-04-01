<template>
<div class="row" v-if="assetHash">
  <div class="col-md-4 col-sm-12 mb-4">
    <media-item :dims="dims" :autoplay="false" :nftMedia="nftMedia" :targetItem="'artworkFile'"/>
  </div>
  <div class="col-md-4 col-sm-12 mb-4">
    <media-item v-if="hasFile('artworkClip')" :dims="dims" :nftMedia="nftMedia" :targetItem="'artworkClip'" v-on="$listeners"/>
    <media-upload v-else :myUploadId="'artworkClip'" :dims="dims" :contentModel="contentModelClip" :mediaFiles="mediaFilesMusicFile" :limit="1" :sizeLimit="4" :mediaTypes="'video'" @updateMedia="updateMedia($event)"/>
  </div>
  <div class="col-md-4 col-sm-12 mb-4">
    <media-item v-if="hasFile('coverImage')" :dims="dims" :nftMedia="nftMedia" :targetItem="'coverImage'" v-on="$listeners"/>
    <media-upload v-else :myUploadId="'coverImage'" :dims="dims" :contentModel="contentModelCoverImage" :mediaFiles="mediaFilesCoverImage" :limit="1" :sizeLimit="2" :mediaTypes="'image'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
<div class="row mb-4" v-else>
  <div class="col-sm-12 col-md-4 offset-md-4 mb-3">
    <media-item v-if="hasFile('artworkFile')" :dims="dims" :nftMedia="nftMedia" :targetItem="'artworkFile'"/>
    <media-upload v-else :myUploadId="'artworkFile'" :dims="dims" :contentModel="contentModelArtwork" :mediaFiles="mediaFilesMusicFile" :limit="1" :sizeLimit="20" :mediaTypes="'video'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
</template>

<script>
import MediaUpload from '@/components/utils/MediaUpload'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'MediaHandler',
  components: {
    MediaUpload,
    MediaItem
  },
  props: ['uploadState', 'nftMedia'],
  data: function () {
    return {
      artworkFileUrl: null,
      dims: { width: 360, height: 202 },
      contentModelCoverImage: {
        id: 'coverImage',
        title: 'Cover Image<br/>drop a file or url<br/>up to 1M',
        buttonName: 'Choose Cover Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelClip: {
        id: 'artworkClip',
        title: 'Artwork Clip (up to 2M)<br/>drop a file or url<br/>up to 2M',
        buttonName: 'Choose Movie Clip',
        iconName: 'film',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelArtwork: {
        id: 'artworkFile',
        title: 'Artwork File<br/>drop a file - up to 20M<br/>drop a url - up to 200M',
        buttonName: 'Choose Artwork File',
        iconName: 'film',
        errorMessage: 'A mp4 file is required',
        popoverBody: 'The artwork file.'
      }
    }
  },
  methods: {
    updateMedia (data) {
      this.$emit('updateMedia', data)
    },
    getMedia (data) {
      this.$emit('updateMedia', data)
    },
    hasFile (file) {
      if (file === 'artworkFile') return this.nftMedia.artworkFile && this.nftMedia.artworkFile.fileUrl
      else if (file === 'artworkClip') return this.nftMedia.artworkClip && this.nftMedia.artworkClip.fileUrl
      else if (file === 'coverImage') return this.nftMedia.coverImage && this.nftMedia.coverImage.fileUrl
    }
  },
  computed: {
    mediaFilesCoverImage () {
      const files = []
      if (this.nftMedia.coverImage && this.nftMedia.coverImage.dataUrl) {
        files.push(this.nftMedia.coverImage)
      }
      return files
    },
    assetHash () {
      const assetHash = this.$route.params.assetHash
      return assetHash
    },
    mediaFilesMusicFile () {
      const files = []
      if (this.nftMedia.musicFile && this.nftMedia.musicFile.dataUrl) {
        files.push(this.nftMedia.musicFile)
      }
      return files
    }
  }
}
</script>

<style scoped>
</style>
