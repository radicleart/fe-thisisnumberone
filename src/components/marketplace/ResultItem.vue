<template>
<div :style="dimensions" class="text-right" v-if="result">
  <media-item v-on="$listeners" @videoClicked="openAssetDetails" class="p-0 m-0" :videoOptions="videoOptions" :attributes="result.attributes" :targetItem="targetItem()"/>
</div>
</template>

<script>
import Vue from 'vue'
import MediaItem from '@/components/utils/MediaItem'
import { APP_CONSTANTS } from '@/app-constants'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'ResultItem',
  components: {
    MediaItem
  },
  props: ['result', 'dims', 'outerOptions'],
  data () {
    return {
      height: 300,
      opacity: 0,
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png')
    }
  },
  mounted () {
    Vue.nextTick(function () {
      const ele = this.$refs.lndQrcode
      let width = 300
      if (ele) {
        width = ele.clientWidth
      }
      this.height = width // this.$store.getters[APP_CONSTANTS.KEY_GALLERY_IMAGE_WIDTH](width)
    }, this)
  },
  methods: {
    targetItem: function () {
      if (!this.result.assetHash) {
        return 'coverImage'
      }
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.result)
    },
    openAssetDetails () {
      if (this.result.assetHash !== this.$route.params.assetHash) {
        this.$router.push('/assets/' + this.result.assetHash)
      }
      VueScrollTo.scrollTo('#app', 2000)
    },
    assetUrl () {
      let assetUrl = '/assets/' + this.result.assetHash + '#app'
      if (this.$route.name === 'my-items') {
        assetUrl = '/my-items/' + this.result.assetHash
      }
      return assetUrl
    }
  },
  computed: {
    dimensions () {
      return 'max-width: ' + this.dims.height + '; max-height: ' + this.dims.height + ';'
    },
    videoOptions () {
      const videoOptions = {
        emitOnHover: true,
        playOnHover: true,
        assetHash: this.result.assetHash,
        bigPlayer: false,
        autoplay: false,
        muted: true,
        controls: true,
        showMeta: false,
        dimensions: 'max-width: 100%; max-height: auto;',
        aspectRatio: '1:1',
        poster: (this.result.attributes.coverImage) ? this.result.attributes.coverImage.fileUrl : null,
        sources: [],
        fluid: false
      }
      if (this.result.attributes.artworkFile) {
        videoOptions.sources = [
          { src: this.result.attributes.artworkClip.fileUrl, type: this.result.attributes.artworkClip.type }
        ]
      }
      if (this.outerOptions) {
        Object.assign(videoOptions, this.outerOptions)
      }
      return videoOptions
    }
  }
}
</script>
<style lang="scss" scoped>
.result-item0 {
  border: 1pt solid #fff;
}
.flasher {
  width: 50px;
  height: 50px;
}
.result-item {
  /* ITEMS STYLE */

  & .result__item--overlay {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    cursor: pointer;
  }

  & .result__item--description {
    width: 100%;
    padding: 11px 18px;
    color: #fff;
    text-shadow: 0px 3px 6px #00000029;
    background: #50B1B5;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  & .result__item--overlay:hover .result__item--description {
    opacity: 0.95;
  }

  & .result__item--title {
    font-size: 1.8rem;
    font-weight: 400;
  }

  & .result__item--amount {
    font-size: 1.6rem;
    font-weight: 600;
  }

  & .result__item--by {
    font-size: 1.3rem;
    font-weight: 300;
  }

  & .result__item--artist {
    font-size: 1.3rem;
    font-weight: 700;
  }

  & .result__item--price {
    font-size: 1.1rem;
    font-weight: 400;
  }

  & .result__item--like-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 1.7rem;
    background-color: #50B1B5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
  & .result__item--my-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 1.3rem;
    background-color: #9d50b5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
}
</style>
