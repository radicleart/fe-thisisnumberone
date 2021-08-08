<template>
<div>
  <div v-if="contentType === 'threed'" :style="videoOptions.dimensions" id="video-demo-container">
    <img v-if="attributes.coverImage" v-on="$listeners" :src="attributes.coverImage.fileUrl" @error="setAltImg()" :alt="attributes.artworkFile.name" :style="dimensions()">
    <img v-else v-on="$listeners" :src="waitingImage" @error="setAltImg()" :alt="'waitingImage'" :style="dimensions()">
  </div>
  <div v-else-if="contentType === 'video'" :style="videoOptions.dimensions" id="video-demo-container">
    <VideoJsPlayer v-on="$listeners" :style="videoOptions.dimensions" @error="setAltImg()" :options="videoOptions"/>
  </div>
  <div v-else-if="contentType === 'audio'" id="audio-demo-container">
    <img v-if="attributes.coverImage" v-on="$listeners" :src="attributes.coverImage.fileUrl" @error="setAltImg()" :alt="attributes.artworkFile.name" :style="dimensions()">
    <img v-else v-on="$listeners" :src="waitingImage" @error="setAltImg()" :alt="'waitingImage'" :style="dimensions()">
    <audio v-on="$listeners" controls :src="attributes.artworkFile.fileUrl" :style="dimensions()">
      Your browser does not support the <code>audio</code> element.
    </audio>
  </div>
  <div v-else-if="contentType === 'document'">
    <img v-if="attributes.coverImage" v-on="$listeners" :src="attributes.coverImage.fileUrl" @error="setAltImg()" :alt="attributes.artworkFile.name" :style="dimensions()">
    <img v-else v-on="$listeners" :src="waitingImage" @error="setAltImg()" :alt="'waitingImage'" :style="dimensions()">
  </div>
  <div v-else-if="contentType === 'image'">
    <img v-if="attributes.coverImage" v-on="$listeners" :src="attributes.coverImage.fileUrl" @error="setAltImg()" :alt="attributes.artworkFile.name" :style="dimensions()">
    <img v-else v-on="$listeners" :src="waitingImage" @error="setAltImg()" :alt="'waitingImage'" :style="dimensions()">
  </div>
  <div v-if="videoOptions.showMeta" :style="videoOptions.dimensions" class="py-4" style="font-size: 1.2rem;">
    <div class="p-2 d-flex justify-content-start">
      <div class="mr-3 text-small">NFT File:</div>
      <div>{{attributes.artworkFile.name}}</div>
    </div>
    <div class="p-2 d-flex justify-content-between">
      <div>{{contentType}}  ({{getNFTSizeMeg()}})</div>
      <div><a v-b-tooltip.hover="{ variant: 'light' }" :title="'The NFT file requires a cover image to display in the Risidio marketplace'" href="#" class="text-small text-primary"><b-icon icon="question-circle"/></a></div>
    </div>
    <div class="p-2 d-flex justify-content-start" v-if="attributes.coverImage">
      <div class="text-small">Cover File:</div>
      <div>{{attributes.coverImage.name}}</div>
    </div>
    <div class="p-2 d-flex justify-content-between" v-if="attributes.coverImage">
      <div>{{attributes.coverImage.type || 'image'}}  ({{getCoverImageSizeMeg()}})</div>
      <div v-if="deleteAllowed()"><a v-b-tooltip.hover="{ variant: 'light' }" :title="'Replace the cover image?'" href="#" @click.prevent="deleteCoverImage()" class="text-small text-danger"><b-icon icon="trash"/></a></div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VideoJsPlayer from './VideoJsPlayer'

export default {
  name: 'MediaItem',
  components: {
    VideoJsPlayer
  },
  props: ['videoOptions', 'targetItem', 'attributes'],
  data () {
    return {
      mediaObjects: [],
      waitingImage: 'https://images.prismic.io/radsoc/f60d92d0-f733-46e2-9cb7-c59e33a15fc1_download.jpeg?auto=compress,format',
      missing: '/img/logo.png',
      contentType: 'image'
    }
  },
  mounted () {
    if (this.attributes && this.attributes.artworkFile) {
      const aft = this.attributes.artworkFile.type
      if (!aft) {
        this.contentType = 'image'
      } else {
        if (aft.indexOf('pdf') > -1 || aft.indexOf('plain') > -1) {
          this.contentType = 'document'
        } else if (aft.indexOf('video') > -1 || aft.indexOf('mp3') > -1) {
          this.contentType = 'video'
        } else if (aft.indexOf('audio') > -1 || aft.indexOf('mp3') > -1) {
          this.contentType = 'audio'
        } else if (aft.indexOf('threed') > -1 || aft.indexOf('gltf') > -1 || aft.indexOf('glb') > -1) {
          this.contentType = 'threed'
        } else {
          this.contentType = 'image'
        }
      }
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.videoOptions.assetHash)
      return contractAsset
    }
  },
  methods: {
    setAltImg: function (event) {
      if (event) event.target.src = this.waitingImage
    },
    deleteAllowed: function () {
      return true
    },
    dimensions: function () {
      if (this.dims) {
        // return 'width: ' + this.dims.width + 'px; height: ' + this.dims.height + 'px;'
        return 'padding-top: 20px; width: auto; height: 300px; min-height: 50px;'
      }
      return 'width: 100%; height: auto'
    },
    getNFTSizeMeg () {
      if (!this.attributes.artworkFile) return 0
      const ksize = this.attributes.artworkFile.size / 1000000
      return Math.round(ksize * 100) / 100 + ' Mb'
    },
    getCoverImageSizeMeg () {
      if (!this.attributes.coverImage) return 0
      const ksize = this.attributes.coverImage.size / 1000000
      return Math.round(ksize * 100) / 100 + ' Mb'
    },
    deleteCoverImage: function () {
      if (!this.attributes.coverImage) return
      this.$emit('deleteMediaItem', this.attributes.coverImage.id)
    }
  }
}
</script>
<style scoped>

</style>
