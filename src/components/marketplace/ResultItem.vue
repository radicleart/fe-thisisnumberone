<template>
<div :style="dimensions()" class="text-right">
  <router-link style="position: relative; top: 25px; right: 10px; z-index: 100" :to="assetUrl"><b-icon icon="arrow-right-circle"/></router-link>
  <media-item :videoOptions="videoOptions" :hideMeta="true" :nftMedia="result.nftMedia" :targetItem="'artworkFile'"/>
</div>
</template>

<script>
import Vue from 'vue'
import MediaItem from '@/components/utils/MediaItem'

export default {
  name: 'ResultItem',
  components: {
    MediaItem
  },
  props: ['result'],
  data () {
    return {
      height: 300,
      dims: { width: 300, height: 300 },
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
    dimensions () {
      return 'width: ' + this.dims.width + 'px; height: ' + this.dims.width + ';'
    }
  },
  computed: {
    videoOptions () {
      const videoOptions = {
        autoplay: false,
        controls: true,
        aspectRatio: '1:1',
        poster: (this.result.nftMedia.coverImage) ? this.result.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: this.result.nftMedia.artworkFile.fileUrl, type: this.result.nftMedia.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    assetUrl () {
      let assetUrl = '/assets/' + this.result.assetHash
      if (this.$route.name === 'my-assets') {
        assetUrl = '/my-assets/' + this.result.assetHash
      }
      return assetUrl
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
    font-size: 1.4rem;
    font-weight: 400;
  }

  & .result__item--amount {
    font-size: 1.2rem;
    font-weight: 600;
  }

  & .result__item--by {
    font-size: 1rem;
    font-weight: 300;
  }

  & .result__item--artist {
    font-size: 1rem;
    font-weight: 700;
  }

  & .result__item--price {
    font-size: 0.9rem;
    font-weight: 400;
  }

  & .result__item--like-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 1.3rem;
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
    font-size: 13px;
    background-color: #9d50b5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
}
</style>
