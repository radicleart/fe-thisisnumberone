<template>
<div class="" v-if="asset">
  <b-card bg-variant="black" class="bg-black mt-0 py-2 text-white">
    <div class="px-2">
      <div class="text-left">
        <div class="mb-3 text-small d-flex justify-content-between">
          <div style="height: 2rem;" class="overflow-hidden text-bold">{{mintedMessage}}</div>
          <div>
            <PunkConnect v-if="loopRun && loopRun.type === 'punks'" :loopRun="loopRun" :asset="asset" @update="update"/>
            <b-link v-if="isRevealed()" class="text-small text-warning pl-2 py-0 my-0" v-b-tooltip.hover="{ variant: 'warning' }" title="Click here to see your Crash Punk traits" @click.prevent="showPunkRarity = !showPunkRarity"><span>traits</span></b-link>
            <a v-if="asset.contractAsset && asset.contractAsset.tokenInfo" :href="asset.contractAsset.tokenInfo.metaDataUrl" target="_blank" class="text-small text-warning pl-2 py-0 my-0" v-b-tooltip.hover="{ variant: 'warning' }" title="Open meta data file"><span>meta</span></a>
          </div>
        </div>
        <div class="text-small d-flex justify-content-between">
          <div class="text-right"><span v-if="loopRun">{{loopRun.currentRun}}</span> {{editionMessage}}</div>
          <div class="text-right">{{created()}}</div>
        </div>
      </div>
    </div>
    <b-card-text class="" v-if="loopRun && loopRun.type === 'punks' && showPunkRarity && asset.attributes">
      <RarityTable :height="newHeight" :image="asset.image" :edition="asset.attributes.index" :loopRun="loopRun" />
    </b-card-text>
    <b-card-text v-else>
      <b-link class="text-xsmall text-info" :to="nextUrl">
        <div style="min-height: 100px;" @contextmenu="handler($event)" class="d-flex justify-content-center p-2">
            <img
              ref="itemImage"
              :width="newWidth"
              :height="newHeight"
              :src="image" @error="imageError()"/>
        </div>
      </b-link>
    </b-card-text>
    <b-card-text>
      <!-- Enables connecting meta data to the actual punk crash -->
      <div class="text-xsmall text-center mb-3">
        <span v-if="asset.contractAsset">{{asset.contractAsset.owner}}</span>
        <span v-else>'ownership in progress'</span>
      </div>
      <div class="mb-4 d-flex justify-content-center" v-if="marketplace || myNfts">
        <b-button :to="nextUrl" :variant="variant" v-html="sellingMessage"></b-button>
      </div>
      <div class="d-flex justify-content-center" v-else-if="nftPage">
      </div>
      <div class="d-flex justify-content-between">
        <div v-if="itemPreview">
          <div><a v-b-tooltip.bottom title="Download NFT" class="text-info text-light ml-3" href="#" @click.prevent="download"><b-icon class="text-info arrow-repeat" font-scale="1" icon="arrow-down-circle"></b-icon></a></div>
        </div>
        <div v-else-if="myNfts">
          <b-link v-if="asset.contractAsset" class="text-small text-warning" :to="'/nft-preview/' + asset.contractAsset.contractId + '/' + asset.contractAsset.nftIndex">manage</b-link>
          <b-link v-else class="text-small text-warning" :to="'/item-preview/' + asset.assetHash + '/1'">mint now</b-link>
        </div>
        <div v-if="iAmOwner">
        </div>
        <div class="text-info" v-if="!marketplace && !nftPage">
          <b-link v-if="asset.contractAsset" class="text-small text-warning" :to="'/nfts/' + asset.contractAsset.contractId + '/' + contractAsset.nftIndex">marketplace</b-link>
        </div>
      </div>
    </b-card-text>
  </b-card>
</div>
</template>

<script>
import { DateTime } from 'luxon'
import { APP_CONSTANTS } from '@/app-constants'
import PunkConnect from './PunkConnect'
import formatUtils from '@/services/formatUtils.js'
import RarityTable from './RarityTable'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleItem',
  components: {
    PunkConnect,
    RarityTable
  },
  props: ['asset', 'loopRun', 'parent'],
  data () {
    return {
      showPunkRarity: false,
      image: null,
      newWidth: '100%',
      newHeight: null
    }
  },
  mounted () {
    this.image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.asset)
    const $self = this
    const $ele = this.$refs.itemImage
    if (this.isLoopbomb()) {
      this.newHeight = '100%'
    }
    this.$nextTick(() => {
      if (!$ele) {
        return
      }
      if ($self.isLoopbomb()) {
        $self.newHeight = $ele.clientWidth * 1 // 1024 / 716
        $self.newWidth = ($self.newHeight * 716) / 1024
        $ele.style.width = (Math.floor($self.newWidth)).toString() + 'px'
      } else {
        $self.newHeight = $ele.clientWidth * 1 // 1024 / 716
        $ele.style.height = (Math.floor($self.newHeight)).toString() + 'px'
      }
    })
  },
  methods: {
    isRevealed () {
      return this.loopRun && this.loopRun.type === 'punks' && this.loopRun.status === 'active' && this.asset.image && this.asset.image.indexOf(this.loopRun.mintImage3) === -1
    },
    isLoopbomb () {
      try {
        return ((this.contractAsset.tokenInfo.metaDataUrl.indexOf('loopbomb') > -1) || (this.loopRun && this.loopRun.currentRunKey.indexOf('loop') > -1))
      } catch (e) {
        return false
      }
    },
    update (data) {
      if (data.opcode === 'update-image') {
        this.asset.image = data.asset.image
        this.image = data.asset.image
      } else if (data.opcode === 'update-interim-image') {
        // this.asset.image = data.asset.image
        this.image = this.loopRun.mintImage2
      }
    },
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
      return 'outline-light'
    },
    itemPreview () {
      return this.$route.name === 'item-preview'
    },
    marketplace () {
      return this.$route.name === 'nft-marketplace' || this.$route.name === 'nft-collection'
    },
    myNfts () {
      return this.$route.name === 'my-nfts'
    },
    nftPage () {
      return this.$route.name.startsWith('asset-by-')
    },
    nextUrl () {
      if (this.marketplace || this.nftPage) {
        if (this.contractAsset && this.contractAsset.tokenInfo) {
          return '/nfts/' + this.contractAsset.contractId + '/' + this.contractAsset.nftIndex
        } else {
          return '/nfts/' + this.asset.assetHash + '/0'
        }
      } else {
        if (this.contractAsset && this.contractAsset.tokenInfo) {
          return '/nft-preview/' + this.contractAsset.contractId + '/' + this.contractAsset.nftIndex
        } else {
          return '/item-preview/' + this.asset.assetHash + '/0'
        }
      }
    },
    mintedMessage () {
      if (this.contractAsset && this.loopRun && this.loopRun.type === 'punks') {
        if (this.profile.superAdmin && this.asset && this.asset.attributes) {
          return this.loopRun.currentRun + ' #' + this.contractAsset.nftIndex + ' (' + this.asset.attributes.index + ')'
        } else {
          return this.loopRun.currentRun + ' #' + this.contractAsset.nftIndex
        }
      }
      if (this.contractAsset) {
        if (this.contractAsset.assetName === 'crashpunks') {
          return 'Crash Punks #' + this.contractAsset.nftIndex
        }
        return '#' + this.contractAsset.nftIndex + ' ' + this.asset.name
      }
      return this.asset.name
    },
    editionMessage () {
      if (this.contractAsset && this.contractAsset.tokenInfo.maxEditions > 1) {
        return '(' + this.contractAsset.tokenInfo.edition + ' of ' + this.contractAsset.tokenInfo.maxEditions + ')'
      }
      return null
    },
    nextBid () {
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.contractAsset)
      return nextBid
    },
    sellingMessage () {
      if (this.contractAsset) {
        if (this.contractAsset.saleData.saleType === 1) {
          return formatUtils.fmtAmount(this.contractAsset.saleData.buyNowOrStartingPrice, 'stx') + ' STX'
        } else if (this.contractAsset.saleData.saleType === 2) {
          return formatUtils.fmtAmount(this.nextBid, 'stx') + ' STX'
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
#trait-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}

.btn {
  width: inherit;
}
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
