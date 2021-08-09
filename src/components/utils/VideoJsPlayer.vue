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
    const $self = this
    try {
      this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
        $self.player.controls($self.options.controls)
      })
      if (this.player && this.options.autoplay) {
        this.player.play()
      }
      if (this.player) {
        this.player.on('pause', function () {
          this.bigPlayButton.show()
          // Now the issue is that we need to hide it again if we start playing
          // So every time we do this, we can create a one-time listener for play events.
        })
        this.player.on('play', function () {
          this.bigPlayButton.hide()
        })
      }
    } catch (e) {
      console.log('Error', this.options)
    }
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
      if (this.player && this.options.playOnHover) {
        this.player.play()
      }
    },
    pauseMe: function () {
      if (!this.player) return
      if (this.options.bigPlayer) return
      if (this.options.emitOnHover) {
        this.$emit('videoHoverOut', this.options)
      }
      if (this.player && this.options.playOnHover) {
        this.player.pause()
      }
    },
    clickedMe: function () {
      if (this.options.bigPlayer) return
      if (this.player) this.player.pause()
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
    left: 48% !important;
    top: 48% !important;
    opacity: 0.5 !important;
}
@media only screen and (max-width: 900px) {
  .vjs-big-play-centered .vjs-big-play-button {
    left: 48.5% !important;
    top: 48.5% !important;
    opacity: 0.5 !important;
  }
}

.video-js .vjs-big-play-button {
  line-height: 160% !important;
}
.vjs-paused.vjs-big-play-button {
  display: none;
}
.vjs-paused.vjs-has-started .vjs-big-play-button {
  display: none;
}
.vjs-big-play-button {
  width: 4%;
  height: 4%;
  border-radius: 12px !important;
}
@media only screen and (max-width: 900px) {
  .vjs-big-play-button {
    width: 3%;
    height: 3%;
    border-radius: 12px !important;
  }
}

</style>
