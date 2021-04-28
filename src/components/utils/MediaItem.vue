<template>
<div>
  <div :style="videoOptions.dimensions" id="video-demo-container" v-if="isThreed(mediaItem())">
    <video-player v-on="$listeners" :style="videoOptions.dimensions" :options="videoOptions"/>
    <div :style="videoOptions.dimensions" class="d-flex justify-content-between" v-if="videoOptions.showMeta">
      <div class="text-small text-info">{{mediaItem().type}}  ({{getSizeMeg(mediaItem().size)}})</div>
      <div @click="deleteMediaItem()" v-if="!contractAsset && (mediaItem().id === 'artworkClip' || mediaItem().id === 'coverImage')" class="text-small text-danger"><b-icon icon="trash"/></div>
    </div>
    <!-- <video id="video1" controls style="max-height: 250px;" @loadedmetadata="cover"> -->
  </div>

  <div :style="videoOptions.dimensions" id="video-demo-container" v-if="isVideo(mediaItem())">
    <video-player v-on="$listeners" :style="videoOptions.dimensions" :options="videoOptions"/>
    <div class="d-flex justify-content-between" v-if="videoOptions.showMeta">
      <div class="text-small text-info">{{mediaItem().type}}  ({{getSizeMeg(mediaItem().size)}})</div>
      <div @click="deleteMediaItem()" v-if="!contractAsset && (mediaItem().id === 'artworkClip' || mediaItem().id === 'coverImage')" class="text-small text-danger"><b-icon icon="trash"/></div>
    </div>
    <!-- <video id="video1" controls style="max-height: 250px;" @loadedmetadata="cover"> -->
  </div>

  <div id="audio-demo-container" v-else-if="isAudio(mediaItem())">
    <audio v-on="$listeners" controls :src="mediaItem().fileUrl" :style="dimensions()">
      Your browser does not support the <code>audio</code> element.
    </audio>
    <div class="d-flex justify-content-between">
      <div class="text-small text-info">{{mediaItem().type}}  ({{getSizeMeg(mediaItem().size)}})</div>
      <div v-if="!contractAsset" @click="deleteMediaItem()" class="text-small text-danger"><b-icon icon="trash"/></div>
    </div>
 </div>

  <div v-if="ispdf(mediaItem())">
    <img v-on="$listeners" :src="missing" :alt="mediaItem().name" :title="mediaItem().name" :style="dimensions()">
    <div @click="deleteMediaItem()" class="text-small text-info">{{mediaItem().type}}  ({{getSizeMeg(mediaItem().size)}})</div>
  </div>

  <div v-else-if="isImage(mediaItem())">
    <img v-on="$listeners" :src="mediaItem().fileUrl" :alt="mediaItem().name" :style="dimensions()">
    <div class="d-flex justify-content-between">
      <div class="text-small text-info">{{mediaItem().type}}  ({{getSizeMeg(mediaItem().size)}})</div>
      <div v-if="!contractAsset" @click="deleteMediaItem()" class="text-small text-danger"><b-icon icon="trash"/></div>
    </div>
  </div>
</div>
<!--/droppable area 1 -->
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VideoPlayer from './videoPlayer'

export default {
  name: 'MediaItem',
  components: {
    VideoPlayer
    // BFormFile
  },
  props: ['videoOptions', 'targetItem', 'nftMedia', 'dims'],
  data () {
    return {
      mediaObjects: [],
      waitingImage: 'https://images.prismic.io/radsoc/f60d92d0-f733-46e2-9cb7-c59e33a15fc1_download.jpeg?auto=compress,format',
      missing: '/img/pdf-holding.png'
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.videoOptions.assetHash)
      return contractAsset
    },
    bannerImage () {
      if (this.nftMedia) {
        const item = this.$store.getters['myItemStore/myItem'](this.nftMedia.artworkFile.dataHash)
        return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](item.nftMedia.imageUrl)
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](null)
    }
  },
  methods: {
    mediaItem: function () {
      return this.nftMedia[this.targetItem]
    },
    dimensions: function () {
      if (this.dims) {
        // return 'width: ' + this.dims.width + 'px; height: ' + this.dims.height + 'px;'
        return 'width: 100%; height: auto;'
      }
      return 'width: 100%; height: auto'
    },
    fileSizeM: function (fsize) {
      return fsize / 1000000
    },
    getSizeMeg (size) {
      const ksize = size / 1000000
      return Math.round(ksize * 100) / 100 + ' Mb'
    },
    deleteMediaItem: function () {
      this.$emit('deleteMediaItem', this.nftMedia[this.targetItem].id)
    },
    ispdf (file) {
      try {
        return file.type.indexOf('pdf') > -1
      } catch (err) {
        return false
      }
    },
    isThreed (file) {
      try {
        return !file.type === 'threed' || file.type.length === 0 || file.type === 'threed' || file.type.indexOf('gltf') > -1 || file.type.indexOf('glb') > -1
      } catch (err) {
        return false
      }
    },
    isPlain (file) {
      try {
        const plain = file.type.indexOf('plain') > -1 || file.type.length === 0
        return plain
      } catch (err) {
        return false
      }
    },
    isImage (file) {
      try {
        const image = file.type.indexOf('img') > -1 ||
              file.type.indexOf('image') > -1 ||
              file.type.indexOf('png') > -1 ||
              file.type.indexOf('jpeg') > -1 ||
              file.type.indexOf('jpg') > -1 ||
              file.type.indexOf('gif') > -1
        return image
      } catch (err) {
        return false
      }
    },
    isVideo (file) {
      try {
        const video = file.type.indexOf('video') > -1
        return video
      } catch (err) {
        return false
      }
    },
    isAudio (file) {
      try {
        const audio = file.type.indexOf('audio/mpeg') > -1 ||
              file.type.indexOf('wav') > -1
        return audio
      } catch (err) {
        return false
      }
    },
    isMusic (file) {
      try {
        const music = file.type.indexOf('mp3') > -1 ||
              file.type.indexOf('wma')
        return music
      } catch (err) {
        return false
      }
    }
  }
}
</script>
<style scoped>

</style>
