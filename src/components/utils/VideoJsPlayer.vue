<template>
  <div v-touch:tap="clickedMe" @click.prevent="clickedMe" @mouseover="playMe()" @mouseout="pauseMe()" :style="options.dimensions">
    <video oncontextmenu="return false" :poster="poster()" ref="videoPlayer" class="video-js vjs-theme-city vjs-big-play-centered"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoJsPlayer',
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
    const $self = this
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
      console.log('onPlayerReady', this)
      $self.player.controls($self.options.controls)
    })
    if (this.options.autoplay) {
      this.player.play()
    }
    this.player.on('pause', function () {
      this.bigPlayButton.show()
      // Now the issue is that we need to hide it again if we start playing
      // So every time we do this, we can create a one-time listener for play events.
    })
    this.player.on('play', function () {
      this.bigPlayButton.hide()
    })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    playMe: function () {
      if (this.options.bigPlayer) return
      if (this.options.emitOnHover) {
        this.$emit('videoHover', this.options)
      }
      if (this.options.playOnHover) {
        this.player.play()
      }
    },
    pauseMe: function () {
      if (this.options.bigPlayer) return
      if (this.options.emitOnHover) {
        this.$emit('videoHoverOut', this.options)
      }
      if (this.options.playOnHover) {
        this.player.pause()
      }
    },
    clickedMe: function () {
      if (this.options.bigPlayer) return
      this.player.pause()
      this.$emit('videoClicked')
    },
    poster: function () {
      if (this.options.poster) {
        return this.options.poster
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
.vjs-big-play-centered .vjs-big-play-button {
    left: 53.5% !important;
    opacity: 0.5 !important;
}
.vjs-paused.vjs-big-play-button {
  display: none;
}
.vjs-paused.vjs-has-started .vjs-big-play-button {
  display: none;
}
.vjs-big-play-button {
  width: 8rem;
  border-radius: 12px !important;
  left: 51% !important;
}
</style>
