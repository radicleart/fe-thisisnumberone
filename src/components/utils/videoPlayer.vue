<template>
  <div>
    <video :poster="poster()" ref="videoPlayer" class="border video-js vjs-theme-city vjs-big-play-centered"></video>
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
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    poster: function () {
      if (this.options.imageUrl) {
        return this.options.imageUrl
      }
    }
  }
}
</script>

<style>
  @import '../../assets/scss/video-js.css';
</style>
