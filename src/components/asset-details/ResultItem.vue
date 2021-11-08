<template>
  <div :style="dimensions" class="text-right" v-if="result">
    <b-link @click="openAssetDetails">
      <!-- <MediaItem class="p-0 m-0" @videoClicked="openAssetDetails" v-on="$listeners" :videoOptions="videoOptions" :attributes="result.attributes" :targetItem="targetItem()"/> -->
      <MediaItemGeneral :classes="'hash1-image'" @videoClicked="openAssetDetails" :options="videoOptions" :mediaItem="getMediaItem().artworkFile" v-on="$listeners"/>
    </b-link>
  </div>
</template>

<script>
import Vue from 'vue'
import MediaItemGeneral from '@/views/marketplace/components/media/MediaItemGeneral'
import { APP_CONSTANTS } from '@/app-constants'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'ResultItem',
  components: {
    MediaItemGeneral
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
      this.height = width
    }, this)
  },
  methods: {
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_MEDIA_ATTRIBUTES](this.result)
      return attributes
    },
    openAssetDetails () {
      if (this.result.assetHash !== this.$route.params.assetHash) {
        if (this.$route.path !== this.assetUrl) this.$router.push(this.assetUrl)
      }
      VueScrollTo.scrollTo('#app', 2000)
    }
  },
  computed: {
    assetUrl () {
      let assetUrl = '/assets/' + this.result.assetHash + '/1'
      if (this.result.contractAsset) {
        assetUrl = '/nfts/' + this.result.contractAsset.contractId + '/' + this.result.contractAsset.nftIndex
      }
      return assetUrl
    },
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
        poster: (this.result.attributes && this.result.attributes.coverImage) ? this.result.attributes.coverImage.fileUrl : null,
        sources: [],
        fluid: false
      }
      if (this.result.attributes && this.result.attributes.artworkClip) {
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
