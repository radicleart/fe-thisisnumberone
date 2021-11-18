<template>
<div class="" v-if="asset">
  <b-card bg-variant="black" class="bg-black mt-0 py-2 text-white">
    <div class="px-2">
      <div class="text-left">
        <p class="text-bold">{{mintedMessage}}</p>
        <div class="text-small d-flex justify-content-between">
          <div class="text-right"><span v-if="loopRun">{{loopRun.currentRun}}</span> {{editionMessage}}</div>
          <div class="text-right">{{created()}}</div>
        </div>
      </div>
    </div>
    <b-card-text class="">
      <b-link class="text-xsmall text-info" :to="nextUrl">
        <div @contextmenu="handler($event)" class="d-flex justify-content-center p-2">
            <img
              ref="itemImage"
              :width="'100%'"
              :height="newHeight"
              :src="image" @error="imageError()"/>
        </div>
      </b-link>
    </b-card-text>
    <b-card-text>
      <!-- Enables connecting meta data to the actual punk crash -->
      <PunkConnect v-if="loopRun" :loopRun="loopRun" :asset="asset" @updateImage="updateImage"/> <!-- v-on="$listeners"/> -->
      <div class="text-xsmall text-center mb-3">
        <span v-if="contractAsset">{{contractAsset.owner}}</span>
        <span v-else>'ownership in progress'</span>
      </div>
      <div class="d-flex justify-content-center" v-if="marketplace || myNfts">
        <b-button :to="nextUrl" :variant="variant">{{sellingMessage}}</b-button>
      </div>
      <div class="d-flex justify-content-center" v-else-if="nftPage">
      </div>
      <div class="d-flex justify-content-between">
        <div v-if="itemPreview">
          <div><a v-b-tooltip.bottom title="Download NFT" class="text-info text-light ml-3" href="#" @click.prevent="download"><b-icon class="text-info arrow-repeat" font-scale="1" icon="arrow-down-circle"></b-icon></a></div>
        </div>
        <div v-else-if="myNfts">
          <b-link v-if="contractAsset" class="text-small text-warning" :to="'/nft-preview/' + asset.contractAsset.contractId + '/' + asset.contractAsset.nftIndex">manage item</b-link>
          <b-link v-else class="text-small text-warning" :to="'/item-preview/' + asset.assetHash + '/1'">mint now</b-link>
        </div>
        <div v-if="iAmOwner">
        </div>
        <div class="text-info" v-if="!marketplace && !nftPage">
          <b-link v-if="contractAsset" class="text-small text-warning" :to="'/nfts/' + contractAsset.contractId + '/' + contractAsset.nftIndex">show in marketplace</b-link>
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

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyWalletNft',
  components: {
    PunkConnect
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
    updateImage (item) {
      this.asset.image = item.image
      this.image = item.image
    },
    handler: function (e) {
      e.preventDefault()
    },
    imageError () {
      this.image = this.asset.image
    },
    created () {
      if (this.asset && this.asset.mintInfo && this.asset.mintInfo.timestamp) {
        return DateTime.fromMillis(this.asset.mintInfo.timestamp).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } else if (this.asset && this.asset.updated) {
        return DateTime.fromMillis(this.asset.updated).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      }
      return ''
    }
  },
  computed: {
    contractAsset () {
      return this.asset.contractAsset
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
        return this.loopRun.currentRun + ' #' + this.contractAsset.nftIndex
      }
      if (this.contractAsset) {
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
