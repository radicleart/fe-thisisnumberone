<template>
<div class="" v-if="asset">
  <b-card bg-variant="white" class="mt-0 text-small py-2 text-dark">
    <div class="px-2">
      <div class="text-left">
        <h6>{{mintedMessage}}</h6>
        <div class="text-xsmall d-flex justify-content-between">
          <div class="text-right">{{loopRun.currentRun}}</div>
          <div class="text-right">{{created()}}</div>
        </div>
      </div>
    </div>
    <b-card-text class="">
      <router-link :to="nextUrl" style="text-decoration: none;">
      <div @contextmenu="handler($event)" class="d-flex justify-content-center p-2">
          <img
            ref="itemImage"
            :width="'100%'"
            :height="newHeight"
            :src="image" @error="imageError()"/>
      </div>
      </router-link>
    </b-card-text>
    <b-card-text>
      <div class="text-xsmall text-center mb-3">
        <span v-if="contractAsset">{{contractAsset.owner}}</span>
        <span v-else>'ownership in progress'</span>
      </div>
      <div class="d-flex justify-content-center" v-if="marketplace">
        <b-button :to="nextUrl" :variant="variant">{{sellingMessage}}</b-button>
      </div>
      <div class="d-flex justify-content-center" v-else-if="nftPage">
      </div>
      <div class="d-flex justify-content-between" v-else>
        <div v-if="itemPreview">
          <div><a v-b-tooltip.bottom title="Download loopbomb" class="text-info text-light ml-3" href="#" @click.prevent="download"><b-icon class="text-info arrow-repeat" font-scale="1" icon="arrow-down-circle"></b-icon></a></div>
        </div>
        <div v-else>
          <b-link v-if="contractAsset" class="text-xsmall text-info" :to="'/item-preview/' + asset.assetHash + '/1'">manage item</b-link>
          <b-link v-else class="text-xsmall text-info" :to="'/item-preview/' + asset.assetHash + '/1'">mint now</b-link>
        </div>
        <div v-if="iAmOwner">
        </div>
        <div class="text-info" v-if="!marketplace && !nftPage">
          <b-link v-if="contractAsset" class="text-xsmall text-info" :to="'/nfts/' + contractAsset.nftIndex">show in marketplace</b-link>
        </div>
      </div>
    </b-card-text>
  </b-card>
</div>
</template>

<script>
import { DateTime } from 'luxon'
import { APP_CONSTANTS } from '@/app-constants'
// import imageDataURI from 'image-data-uri'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleItem',
  components: {
  },
  props: ['asset', 'loopRun'],
  data () {
    return {
      image: null,
      newHeight: null
    }
  },
  mounted () {
    this.image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.asset)
    const $self = this
    const $ele = this.$refs.itemImage
    this.$nextTick(() => {
      if (!$ele) {
        return
      }
      $self.newHeight = $ele.clientWidth * 1 // 1024 / 716
      $ele.style.height = (Math.floor($self.newHeight)).toString() + 'px'
    })
  },
  methods: {
    handler: function (e) {
      e.preventDefault()
    },
    imageError () {
      this.image = this.asset.attributes.artworkFile.fileUrl
    },
    created () {
      if (this.asset && this.asset.mintInfo && this.asset.mintInfo.timestamp) {
        return DateTime.fromMillis(this.asset.mintInfo.timestamp).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } else if (this.asset && this.asset.updated) {
        return DateTime.fromMillis(this.asset.updated).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      }
      return ''
    }
    /**
    download () {
      const extUrl = this.asset.attributes.artworkFile.fileUrl
      imageDataURI.encodeFromURL(extUrl).then(dataUrl => {
        // RETURNS image data URI :: 'data:image/pngbase64,PNGDATAURI/'
        const image = dataUrl.replace('image/png', 'image/octet-stream')
        const link = document.createElement('a')
        link.download = this.asset.name + '.png'
        link.href = image
        link.click()
      }).catch(() => {
        imageDataURI.encodeFromURL(extUrl).then(dataUrl => {
          // RETURNS image data URI :: 'data:image/pngbase64,PNGDATAURI/'
          const image = dataUrl.replace('image/png', 'image/octet-stream')
          const link = document.createElement('a')
          link.download = this.asset.name + '.png'
          link.href = image
          link.click()
        })
      })
    }
    **/
  },
  computed: {
    currentRun () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUNS]
      if (loopRuns && loopRuns.length > 0) {
        return loopRuns[loopRuns.length - 1].currentRun
      }
      return ''
    },
    contractAsset () {
      if (this.asset.contractAsset) return this.asset.contractAsset
      const data = { assetHash: this.asset.assetHash, edition: 1 }
      const gaiaAsset = this.$store.getters['rpayStacksContractStore/getAssetByHashAndEdition'](data)
      return (gaiaAsset) ? gaiaAsset.contractAsset : null
    },
    variant () {
      if (this.contractAsset) {
        if (this.contractAsset.saleData.saleType === 1) {
          return 'success'
        } else if (this.contractAsset.saleData.saleType === 2) {
          return 'success'
        }
      }
      return 'outline-dark'
    },
    itemPreview () {
      return this.$route.name === 'item-preview'
    },
    marketplace () {
      return this.$route.name === 'nft-marketplace'
    },
    nftPage () {
      return this.$route.name.startsWith('asset-by-')
    },
    nextUrl () {
      if (this.marketplace || this.nftPage) {
        if (this.contractAsset && this.contractAsset.tokenInfo) {
          return '/nfts/' + this.contractAsset.nftIndex
        } else {
          return '/nfts/' + this.asset.assetHash + '/0'
        }
      } else {
        if (this.contractAsset && this.contractAsset.tokenInfo) {
          return '/item-preview/' + this.contractAsset.tokenInfo.assetHash + '/' + this.contractAsset.tokenInfo.edition
        } else {
          return '/item-preview/' + this.asset.assetHash + '/0'
        }
      }
    },
    mintedMessage () {
      if (this.contractAsset) {
        return '#' + this.contractAsset.nftIndex + ' ' + this.asset.name
      }
      return this.asset.name
    },
    nextBid () {
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      return nextBid
    },
    sellingMessage () {
      if (this.contractAsset) {
        if (this.contractAsset.saleData.saleType === 1) {
          return 'Buy Now: ' + this.contractAsset.saleData.buyNowOrStartingPrice + ' STX'
        } else if (this.contractAsset.saleData.saleType === 2) {
          return 'Next Bid: ' + this.nextBid + ' STX'
        }
      }
      return 'not on sale'
    },
    looperDimsWidth () {
      const dims = this.$store.getters['loopStore/getLooperDimsWidth']
      return dims + 'px'
    },
    looperDimsHeight () {
      const dims = this.$store.getters['loopStore/getLooperDimsHeight']
      return dims + 'px'
    },
    cardDimensions () {
      const width = this.$store.getters['loopStore/getMintedDimsWidth']
      return 'height: auto, width: ' + width + 'px;'
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    iAmOwner () {
      return this.contractAsset && this.contractAsset.owner === this.profile.stxAddress
    }
  }
}
</script>
<style scoped>
.card {
  background-color: #212529;
  padding: 0;
  margin: 15px 5px;
  border: none;
}
.card-text img {
  border-radius: 0px;
  min-width: 10rem;
  max-width: 40rem;
}
.card-header {
    padding: 1rem 1.5rem 0 1.5rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    font-size: 2.50rem;
}
.card-body {
    padding: 0 0.5rem;
}
.card-text-body {
    padding: 0 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    border-bottom: 0px solid rgba(0, 0, 0, 0.125);
}
</style>
