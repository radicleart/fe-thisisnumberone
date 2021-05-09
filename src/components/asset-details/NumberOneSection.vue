<template>
<b-container fluid id="number-one-container">
  <b-row align-h="center" style="min-height: 91vh" v-if="resultSet" class="mb-5">
    <b-col lg="8" sm="10" class="mb-5" align-self="center">
      <div id="video-column" :style="dimensions">
        <result-grid id="grid-container" @videoHoverOut="resetContainer" @videoHover="updateContainer" class="container text-center" :outerOptions="videoOptions" :outsiderCols="12" :resultSet="resultSet"/>
      </div>
    </b-col>
    <b-col lg="4" sm="10" align-self="center" :key="componentKey">
      <div v-if="content && !artistId" id="one-box" class="center-section text-white bg-black box1" :style="bannerImage()">
        <div class="mx-5 text-splash">
          <prismic-items :prismicItems="content.splashtext"></prismic-items>
        </div>
      </div>
      <div v-else class="center-box text-white bg-black" :style="bannerImage()" >
        <div class="bg-black box2" style="opacity: 0.5">
          <img width="350px" height="350px" :src="bannerImage1(artistId)"/>
        </div>
        <div style="position: relative;">
          <div class="text-white p-5" style="position: absolute; bottom: 0;">
            <p class="my-0 text-artist">{{gaiaAsset.artist}}</p>
            <p class="mb-2 text-artwork">{{gaiaAsset.name}}</p>
            <!-- <div class="my-0 text-action" v-scroll-to="{ element: '#app', duration: 1000 }"><b-link @click.prevent="routeTo(gaiaAsset.assetHash)" class="text-white">Find out more</b-link></div> -->
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/marketplace/ResultGrid'
import Vue from 'vue'
import PrismicItems from '@/components/prismic/PrismicItems'
import VueScrollTo from 'vue-scrollto'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'NumberOneSection',
  components: {
    ResultGrid,
    PrismicItems
  },
  data () {
    return {
      show: true,
      componentKey: null,
      logo: require('@/assets/img/logo-rainbow.svg'),
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
    // this.findAssets()
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
    routeTo (assetHash) {
      if (assetHash !== this.$route.params.assetHash) {
        this.$router.push('/assets/' + assetHash)
      }
      VueScrollTo.scrollTo('#app', 2000)
    },
    ttStacksAddress () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-stacks-address')
      return (tooltip) ? tooltip[0].text : ''
    },
    gaiaAsset (assetHash) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](assetHash)
      return gaiaAsset
    },
    findAssets () {
      this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((results) => {
        this.results = results
      })
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
        height: '350px'
      }
      if (window.innerWidth > 987) {
        disp.position = 'relative'
        disp.left = '-100px'
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
    getOffset () {
      if (window.innerWidth > 987) {
        return 'position: relative; left: -70px;'
      }
      return ''
    },
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
    },
    resultSet () { // FromIndex
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      if (resultSet && resultSet.length > 0 && resultSet[0] && resultSet[0].nftMedia) {
        return resultSet
      }
      return null
    },
    resultSet1 () {
      // const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      const results = this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
      if (!results) return
      const resultSet = results.filter((o) => (o.nftMedia && o.nftMedia.artworkFile && o.nftMedia.artworkFile.type.indexOf('video') > -1))
      return resultSet
    }
  }
}
</script>

<style scoped>
.box1 {
  border: 1pt solid #ffffff;
}
.box2 {
  background-color: #333333;
  /* border: 1pt solid #707070; */
}
.center-box {
  margin: auto;
  width: 100%;
  border: 0px solid green;
}
@media only screen and (max-width: 900px) {
  .center-box {
    width: 85%;
  }
}

</style>
