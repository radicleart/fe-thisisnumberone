<template>
<div>
  <div v-if="contentType === 'threed'" id="video-demo-container">
    <img :class="classes" v-on="$listeners" :src="mediaItem.fileUrl" @error="setAltImg" :alt="mediaItem.name">
  </div>
  <div v-else-if="contentType === 'video'" id="video-demo-container">
    <VideoJsPlayer :class="classes" v-on="$listeners"  @error="setAltImg" :options="options"/>
  </div>
  <div v-else-if="contentType === 'audio'" id="audio-demo-container">
    <img :class="classes" v-on="$listeners" :src="mediaItem.fileUrl" @error="setAltImg" :alt="mediaItem.name" >
    <audio v-on="$listeners" controls :src="mediaItem.fileUrl">
      Your browser does not support the <code>audio</code> element.
    </audio>
  </div>
  <div v-else-if="contentType === 'document'">
    <img :class="classes" v-on="$listeners" :src="mediaItem.fileUrl" @error="setAltImg" :alt="mediaItem.name">
  </div>
  <div v-else-if="contentType === 'image'">
    <img :class="classes" v-on="$listeners" :src="mediaItem.fileUrl" @error="setAltImg" :alt="mediaItem.name">
  </div>

  <div v-if="options.showMeta" class="py-0" style="font-size: 1.2rem;">
    <!--
    <div class="p-2 d-flex justify-content-start">
      <div class="mr-3 text-small">NFT File:</div>
      <div>{{mediaItem.name}}</div>
    </div>
    <div class="p-2 d-flex justify-content-between">
      <div>{{contentType}}  ({{getNFTSizeMeg()}})</div>
      <div><a v-b-tooltip.hover="{ variant: 'light' }" :title="'The NFT file requires a cover image to display in the Risidio marketplace'" href="#" class="text-small text-primary"><b-icon icon="question-circle"/></a></div>
    </div>
    <div class="p-2 d-flex justify-content-start" v-if="mediaItem">
      <div class="text-small">Cover File:</div>
      <div>{{mediaItem.name}}</div>
    </div>
    -->
    </div>
    <div class="p-0 d-flex justify-content-end text-bold" v-if="mediaItem">
      <!-- <div>{{mediaItem.type || 'image'}}  ({{getCoverImageSizeMeg()}})</div> -->
      <div v-if="deleteAllowed()"><a v-b-tooltip.hover="{ variant: 'light' }" :title="'Replace this image?'" href="#" @click.prevent="$emit('deleteMediaItem', mediaItem.id)" class="text-small">change</a></div>
    </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VideoJsPlayer from './VideoJsPlayer'

export default {
  name: 'MediaItemGeneral',
  components: {
    VideoJsPlayer
  },
  props: ['classes', 'options', 'mediaItem'],
  data () {
    return {
      mediaObjects: [],
      waitingImage: 'https://images.prismic.io/radsoc/f60d92d0-f733-46e2-9cb7-c59e33a15fc1_download.jpeg?auto=compress,format',
      missing: '/img/logo.png',
      contentType: null
    }
  },
  mounted () {
    if (this.mediaItem) {
      const aft = this.mediaItem.type
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
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.options.assetHash)
      return contractAsset
    }
  },
  methods: {
    dimensions: function () {
      if (this.dims) {
        // return 'width: ' + this.dims.width + 'px; height: ' + this.dims.height + 'px;'
        return 'width: 100%; max-height: 300px; min-height: 50px;'
      }
      return 'width: 100%; height: auto'
    },
    setAltImg: function (event) {
      if (event) event.target.src = this.waitingImage
    },
    deleteAllowed: function () {
      if (this.options.deleteAllowed == null) return false
      return this.options.deleteAllowed
    },
    getNFTSizeMeg () {
      if (!this.mediaItem) return 0
      const ksize = this.mediaItem.size / 1000000
      return Math.round(ksize * 100) / 100 + ' Mb'
    },
    getCoverImageSizeMeg () {
      if (!this.mediaItem) return 0
      const ksize = this.mediaItem.size / 1000000
      return Math.round(ksize * 100) / 100 + ' Mb'
    },
    deleteCoverImage: function () {
      if (!this.mediaItem.coverImage) return
      this.$emit('deleteMediaItem', this.mediaItem.coverImage.id)
    }
  }
}
</script>
<style scoped>

</style>
