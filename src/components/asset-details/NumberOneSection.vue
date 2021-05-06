<template>
<b-container fluid id="number-one-container" style="min-height: 91vh">
  <b-row align-h="center" style="min-height: 91vh" v-if="resultSet">
    <b-col md="8" sm="12" align-self="center">
      <result-grid @videoHoverOut="resetContainer" @videoHover="updateContainer" class="container text-center" :outerOptions="videoOptions" :outsiderCols="12" :resultSet="resultSet"/>
    </b-col>
    <b-col md="4" sm="6" align-self="center" :style="getOffset" class="mb-5">
      <div v-if="!artistId" id="one-box" class="box1" :style="'height:' + oneBoxHeight + 'px'" style="min-width: 200px; width: 100%;">
        <div><img :src="logo" alt="logo"></div>
      </div>
      <div v-else id="one-box" class="box2 text-white d-flex flex-column justify-content-end align-items-center" :style="'height:' + oneBoxHeight + 'px'" style="min-width: 200px; width: 100%;">
        <b-row align-h="center" style="min-height: 100%" v-if="resultSet" class="p-0 m-0 w-100">
          <b-col cols="12" align-self="start" class="p-0 m-0 text-right w-100">
            <img width="115px" s :src="logo" alt="logo">
          </b-col>
          <b-col class=" p-5 m-0" v-if="gaiaAsset" cols="12" align-self="end" :key="componentKey">
            <h1>{{gaiaAsset.artist}}</h1>
            <h2>{{gaiaAsset.name}}</h2>
            <p class="" v-if="gaiaAsset.contractAsset">{{getOwningAddress}} <b-link router-tag="span" v-b-tooltip.click :title="ttStacksAddress" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link></p>
            <div v-scroll-to="{ element: '#asset-details-section', duration: 1000 }"><b-link @click.prevent="routeTo(gaiaAsset.assetHash)" class="text-white">Find out more</b-link></div>
          </b-col>
        </b-row>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/marketplace/ResultGrid'
import Vue from 'vue'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'NumberOneSection',
  components: {
    ResultGrid
  },
  data () {
    return {
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
    this.findAssets()
  },
  updated () {
    Vue.nextTick(function () {
      const oneBox = document.getElementById('one-box')
      if (oneBox) this.oneBoxHeight = oneBox.clientWidth
    }, this)
  },
  methods: {
    routeTo (assetHash) {
      this.$router.push('/assets/' + assetHash)
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
    resetContainer () {
      // this.artistId = null
    }
  },
  computed: {
    getOffset () {
      if (window.innerWidth > 800) {
        return 'position: relative; left: -70px;'
      }
      return ''
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
    resultSet () {
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

</style>
