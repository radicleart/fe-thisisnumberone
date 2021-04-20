<template>
  <div @click.prevent="clickedMe()" @mouseover="playMe()" @mouseout="pauseMe()" :style="options.dimensions">
    <video :poster="poster()" ref="videoPlayer" class="video-js vjs-theme-city vjs-big-play-centered"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      player: null
    }
  },
  mounted () {
    console.log(this.options)
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
      console.log('onPlayerReady', this)
    })
    this.player.controls(false)
    if (this.options.autoplay) {
      this.player.play()
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    playMe: function () {
      this.player.play()
    },
    pauseMe: function () {
      this.player.pause()
    },
    clickedMe: function () {
      this.player.pause()
      this.$emit('openAssetDetails')
    },
    poster: function () {
      if (this.options.imageUrl) {
        return this.options.imageUrl
      }
    }
  }
}
</script>

<style>
  .video-js {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
}
.vjs-default-skin.vjs-paused .vjs-big-play-button {
  display: none;
}
</style>
