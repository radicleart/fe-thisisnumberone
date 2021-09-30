<template>
<b-container fluid id="number-one-container">
  <b-row align-h="center" style="min-height: 91vh" v-if="loaded" class="mb-5">
    <b-col lg="8" sm="10" class="mb-5" align-self="center">
      <div id="video-column" :style="dimensions">
        <result-grid id="grid-container" @videoHoverOut="resetContainer" @videoHover="updateContainer" class="container text-center" :outerOptions="videoOptions"/>
      </div>
    </b-col>
    <b-col lg="4" sm="10" align-self="center" :key="componentKey">
      <b-row align-h="center" id="one-box" class="text-white bg-black" :style="bannerImage()">
        <b-col align-self="center" cols="12" class="p-0">
          <prismic-items v-if="content && !artistId" class="mx-5 text-center" :prismicItems="content.splashtext"></prismic-items>
          <div v-else>
            <div class="bg-black" style="opacity: 0.5">
              <img width="100%" height="100%" :src="bannerImage1(artistId)"/>
            </div>
            <div style="position: relative; left: -10px;">
              <div class="text-white p-5" style="position: absolute; bottom: 0;">
                <p class="my-0 text-artist">{{gaiaAsset.artist}}</p>
                <p class="mb-2 text-artwork">{{gaiaAsset.name}}</p>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/asset-details/ResultGrid'
import Vue from 'vue'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'NumberOneSection',
  components: {
    ResultGrid,
    PrismicItems
  },
  data () {
    return {
      show: true,
      loaded: true,
      componentKey: null,
      // logo: require('@/assets/img/logo-rainbow.svg'),
      rainbowOne: require('@/assets/img/Group 76.svg'),
      artistId: null,
      oneBoxHeight: 200,
      videoOptions: {
        emitOnHover: true,
        playOnHover: true,
        autoplay: false,
        muted: true,
        controls: false,
        showMeta: false
      }
    }
  },
  mounted () {
    this.resizeContainers()
  },
  updated () {
    Vue.nextTick(function () {
      const oneBox = document.getElementById('grid-container')
      if (oneBox) this.oneBoxHeight = oneBox.clientWidth
    }, this)
  },
  methods: {
    resizeContainers () {
      let resizeTimer
      const $self = this
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
          $self.componentKey += 1
        }, 400)
      })
    },
    dimensions () {
      const dims = { width: '100%', height: '100%' }
      return 'max-width: ' + dims.height + '; max-height: ' + dims.height + ';'
    },
    intoBoxStyle () {
      return 'width: ' + 350 + 'px; height: ' + 350 + 'px;'
    },
    ttStacksAddress () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-stacks-address')
      return (tooltip) ? tooltip[0].text : ''
    },
    gaiaAsset (assetHash) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](assetHash)
      return gaiaAsset
    },
    updateContainer (vo) {
      if (!vo || !vo.assetHash) return
      this.gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](vo.assetHash)
      this.artistId = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](this.gaiaAsset.artist)
      this.componentKey++
    },
    bannerImage () {
      const disp = {
        width: '350px',
        height: '350px',
        margin: '0 auto'
      }
      if (window.innerWidth > 987) {
        disp.position = 'relative'
        disp.left = '-100px'
      }
      if (!this.artistId) {
        disp.border = '1pt solid #fff'
      }
      return disp
    },
    bannerImage1 (artistId) {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_BY_ID](artistId)
      let bannerUrl = '#'
      if (content) {
        bannerUrl = content.data.image.url
      }
      return bannerUrl
    },
    resetContainer () {
      this.artistId = null
    }
  },
  computed: {
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    },
    getOwningAddress () {
      if (this.gaiaAsset && this.gaiaAsset.contractAsset && this.gaiaAsset.contractAsset.owner) {
        const address = this.gaiaAsset.contractAsset.owner
        if (window.innerWidth > 1100) {
          return address
        }
        return address.substring(0, 5) + '...' + address.substring(address.length - 5)
      }
      return ''
    }
  }
}
</script>

<style>
#number-one-container .prismic-items img {
  width: 50px;
  height: 50px;
  margin: 20px auto;
}
#number-one-container .prismic-items p {
  font-size: 1.4rem;
  text-align: left;
}
#number-one-container .box1 {
  border: 1pt solid #ffffff;
}
#number-one-container .box2 {
  background-color: #333333;
  /* border: 1pt solid #707070; */
}
#number-one-container .center-box {
  margin: auto;
  width: 100%;
  border: 0px solid green;
}
@media only screen and (max-width: 900px) {
  #number-one-container .center-box {
    width: 85%;
  }
}

</style>
