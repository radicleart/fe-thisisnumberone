<template>
<div class="row" v-if="assetHash">
  <div class="col-md-4 col-sm-12 mb-4">
    <media-item :videoOptions="videoOptions" :dims="dims" :attributes="attributes" :targetItem="'artworkFile'"/>
  </div>
  <div class="col-md-4 col-sm-12 mb-4" v-if="videoOptions.allowClip">
    <media-item :videoOptions="videoOptions" v-if="hasFile('artworkClip')" :dims="dims" :attributes="attributes" :targetItem="'artworkClip'" v-on="$listeners"/>
    <media-upload v-else :myUploadId="'artworkClip'" :dims="dims" :contentModel="contentModelClip" :mediaFiles="mediaFilesArtworkClip" :limit="1" :sizeLimit="4" :mediaTypes="'video,image'" @updateMedia="updateMedia($event)"/>
  </div>
  <div class="col-md-4 col-sm-12 mb-4">
    <media-item :videoOptions="videoOptions" v-if="hasFile('coverImage')" :dims="dims" :attributes="attributes" :targetItem="'coverImage'" v-on="$listeners"/>
    <media-upload v-else :myUploadId="'coverImage'" :dims="dims" :contentModel="contentModelCoverImage" :mediaFiles="mediaFilesCoverImage" :limit="1" :sizeLimit="2" :mediaTypes="'image'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
<div class="row mb-4" v-else>
  <div class="col-sm-12 col-md-4 mb-3">
    <media-item :videoOptions="videoOptions" v-if="hasFile('artworkFile')" :dims="dims" :attributes="attributes" :targetItem="'artworkFile'"/>
    <media-upload v-else :myUploadId="'artworkFile'" :dims="dims" :contentModel="contentModelArtwork" :mediaFiles="mediaFilesArtworkFile" :limit="1" :sizeLimit="20" :mediaTypes="'video'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
</template>

<script>
import MediaUpload from '@/components/upload/MediaUpload'
import MediaItem from '@/components/upload/MediaItem'

export default {
  name: 'MediaHandler',
  components: {
    MediaUpload,
    MediaItem
  },
  props: ['uploadState', 'attributes', 'videoOptions', 'useClip'],
  data: function () {
    return {
      artworkFileUrl: null,
      dims: { width: 360, height: 202 },
      contentModelCoverImage: {
        id: 'coverImage',
        title: 'Cover Image<br/>up to 1M',
        buttonName: 'Choose Cover Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelClip: {
        id: 'artworkClip',
        title: 'Artwork Clip (up to 2M)<br/>up to 2M',
        buttonName: 'Choose Movie Clip',
        iconName: 'film',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelArtwork: {
        id: 'artworkFile',
        title: 'Main NFT File<br/>drop a url - up to 200M',
        buttonName: 'Choose NFT File',
        iconName: 'film',
        errorMessage: 'A mp4 file is required',
        popoverBody: 'The NFT file.'
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
      if (file === 'artworkFile') return this.attributes.artworkFile && this.attributes.artworkFile.fileUrl
      else if (file === 'artworkClip') return this.attributes.artworkClip && this.attributes.artworkClip.fileUrl
      else if (file === 'coverImage') return this.attributes.coverImage && this.attributes.coverImage.fileUrl
    }
  },
  computed: {
    mediaFilesCoverImage () {
      const files = []
      if (this.attributes.coverImage && this.attributes.coverImage.dataUrl) {
        files.push(this.attributes.coverImage)
      }
      return files
    },
    assetHash () {
      const assetHash = this.$route.params.assetHash
      return assetHash
    },
    mediaFilesArtworkFile () {
      const files = []
      if (this.attributes.artworkFile && this.attributes.artworkFile.dataUrl) {
        files.push(this.attributes.artworkFile)
      }
      return files
    }
  }
}
</script>

<style scoped>
</style>
