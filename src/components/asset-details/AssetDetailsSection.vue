<template>
<section :key="componentKey" id="asset-details-section" v-if="gaiaAsset" class="text-white">
  <b-container class="center-section" style="min-height: 50vh;">
    <b-row align-h="center" :style="'min-height: ' + videoHeight + 'px'">
      <b-col lg="7" sm="10" class="mb-5">
        <div id="video-column" :style="dimensions">
          <media-item :videoOptions="videoOptions" :nftMedia="gaiaAsset.nftMedia" :targetItem="targetItem()"/>
        </div>
      </b-col>
      <b-col lg="5" sm="10">
        <b-row align-v="stretch" :style="'min-height: ' + videoHeight + 'px'">
          <b-col cols="12" class="">
            <div class="d-flex justify-content-between mb-5">
              <div><router-link class="text-white" to="/home"><b-icon icon="chevron-left" shift-h="-4" variant="white"></b-icon> Back</router-link></div>
              <div class="d-flex justify-content-between">
                <b-link router-tag="span" v-b-tooltip.click :title="ttOnAuction" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
                <div class="text-center on-auction-text ml-3 py-3 px-4 bg-warning text-white">
                  <div v-if="isOwner"><router-link class="text-white" to="/my-items/minted">{{salesBadgeLabel}}</router-link></div>
                  <div v-else>{{salesBadgeLabel}}</div>
                  <div v-if="showEndTime()">{{biddingEndTime()}}</div>
                </div>
              </div>
            </div>
          </b-col>
          <b-col md="12" align-self="end">
            <div class="w-100">
              <h1 class="text-white">{{gaiaAsset.name}}</h1>
              <h2>{{gaiaAsset.artist}}</h2>
              <p class="border-bottom pb-4" style="font-size: 1.2rem;">{{owner}} <b-link router-tag="span" v-b-tooltip.click :title="ttStacksAddress" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link></p>
              <div class="w-100">
                <p class="pt-4 text-small" v-html="preserveWhiteSpace(gaiaAsset.description)"></p>
              </div>
              <div class="w-25">
                <share-links class="mt-4" :socialLinks="getSocialLinks()" :gaiaAsset="gaiaAsset" />
              </div>
              <b-row class="my-4">
                <b-col md="6" sm="12" class="">
                  <div class="more-link m-0" v-scroll-to="{ element: '#artist-section', duration: 1000 }"><b-link class="text-white">Find out more</b-link></div>
                </b-col>
                <b-col md="6" sm="12" class="">
                  <div class="more-link m-0" v-scroll-to="{ element: '#charity-section', duration: 1000 }"><b-link class="text-white">Charity</b-link></div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6" sm="12" class="mb-3" v-if="getSaleType() > 0">
                  <square-button @clickButton="openPurchaceDialog()" :theme="'light'" :label1="salesButtonLabel" :svgImage="hammer" :text-warning="true"/>
                </b-col>
                <b-col md="6" sm="12">
                  <square-button @clickButton="openUpdates()" :theme="'light'" :label1="'GET UPDATES'" :icon="'eye'" :text-warning="true"/>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  <b-modal size="lg" id="asset-offer-modal" class="text-left">
    <purchase-flow v-if="showRpay === 1" :gaiaAsset="gaiaAsset" @offerSent="offerSent"/>
    <asset-updates-modal v-if="showRpay === 2" :assetHash="gaiaAsset.assetHash" @registerForUpdates="registerForUpdates"/>
    <template #modal-header="{ close }">
      <div class="text-black text-warning w-100 d-flex justify-content-end">
        <b-button size="sm" variant="white" @click="close()"  class="m-0 p-1 text-dark" style="max-width: 30px !important; max-height: 30px !important;">
          <img :src="cross" class="filter-black" alt="close" style="max-width: 20px !important; max-height: 20px !important;"/>
        </b-button>
      </div>
    </template>
    <template #modal-footer>
      <div class="w-100 d-flex justify-content-between">
      </div>
    </template>
  </b-modal>
  <b-modal id="result-modal" class="" v-if="confirmOfferDialog">
    <b-row>
      <b-col cols="12" class="w-50">
        <h1>{{confirmOfferDialog[0].text}}</h1>
        <h4 class="text-center mb-5">{{confirmOfferDialog[1].text}}</h4>
        <h4 class="text-center mb-5"><a :href="transactionUrl(mintResultTxId)" target="_blank">Transaction sent to Stacks Blockchain</a></h4>
        <p class="text-center mx-md-5 px-md-5 mb-5">{{confirmOfferDialog[2].text}}</p>
        <div class="mt-5"><a href="#" @click.prevent="back()"><b-icon icon="chevron-left"/> {{confirmOfferDialog[3].text}}</a></div>
      </b-col>
    </b-row>
    <div></div>
    <template #modal-footer class="text-center">
      <div class="w-100">
      </div>
    </template>
  </b-modal>
  </b-container>
</section>
</template>

<script>
import Vue from 'vue'
import AssetUpdatesModal from './offers/AssetUpdatesModal'
import PurchaseFlow from './offers/PurchaseFlow'
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/utils/MediaItem'
import SquareButton from '@/components/utils/SquareButton'
import ShareLinks from '@/components/utils/ShareLinks'
import moment from 'moment'
// import EditionTrigger from '@/components/toolkit/editions/EditionTrigger'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'AssetDetailsSection',
  components: {
    AssetUpdatesModal,
    // EditionTrigger,
    PurchaseFlow,
    MediaItem,
    SquareButton,
    ShareLinks
  },
  props: ['gaiaAsset'],
  data: function () {
    return {
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      hammer: require('@/assets/img/auction.svg'),
      showRpay: 0,
      dims: { width: 768, height: 768 },
      videoHeight: 0,
      componentKey: 0,
      showHash: false,
      assetHash: null,
      mintResult: null,
      mintResultTxId: null,
      message: 'No item available...'
    }
  },
  watch: {
    '$route' () {
      this.assetHash = this.$route.params.assetHash
      this.componentKey++
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    const $self = this
    const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
    this.gaiaAsset.saleData = contractAsset.saleData
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'purchase-flow', asset: this.gaiaAsset })
    this.resizeContainers()
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
        $self.$store.commit('setModalMessage', txResult)
        if (data.opcode.indexOf('stx-transaction-') > -1) {
          // $self.showRpay = 0
          // $self.$bvModal.hide('result-modal')
          // $self.$bvModal.hide('asset-offer-modal')
          // $self.$bvModal.hide('rpay-modal')
          // $self.mintResult = txResult
          // $self.$root.$emit('bv::show::modal', 'success-modal')
        } else {
          // $self.$bvModal.hide('minting-modal')
          // $self.showRpay = false
          // $self.mintTitle = 'Not Minted'
          // $self.$bvModal.show('result-modal')
        }
      })
    }
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientHeight
    }, this)
  },
  methods: {
    resizeContainers () {
      let resizeTimer
      const $self = this
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
          const vid = document.getElementById('video-column')
          if (vid) $self.videoHeight = vid.clientHeight
        }, 400)
      })
    },
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">' + content + '</span>'
    },
    back: function () {
      this.$bvModal.hide('result-modal')
    },
    offerSent: function () {
      // local notification
    },
    showEndTime: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset.saleData.saleType === 2 || contractAsset.saleData.saleType === 3
    },
    biddingEndTime: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return moment(contractAsset.saleData.biddingEndTime).format('DD-MM-YY hh:mm')
    },
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.gaiaAsset)
    },
    dimensions () {
      const dims = { width: '100%', height: '100%' }
      return 'max-width: ' + dims.height + '; max-height: ' + dims.height + ';'
    },
    poster: function () {
      if (this.gaiaAsset.nftMedia.coverImage) {
        return this.gaiaAsset.nftMedia.coverImage.fileUrl
      }
    },
    getArtist: function () {
      if (this.gaiaAsset.artist) {
        return this.gaiaAsset.artist
      } else if (this.gaiaAsset.owner) {
        return this.gaiaAsset.owner.substring(0, this.gaiaAsset.owner.indexOf('.'))
      } else {
        return 'Unknown Artist'
      }
    },
    openUpdates: function () {
      this.showRpay = 2
      this.$bvModal.show('asset-offer-modal', { assetHash: this.assetHash })
    },
    getSaleType: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset.saleData.saleType
    },
    transactionUrl: function (txId) {
      return 'https://explorer.stacks.co/txid/' + txId + '?chain=' + NETWORK
    },
    openPurchaceDialog: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      if (contractAsset.saleData.saleType === 0) {
        return
      }
      this.showRpay = 1
      this.$bvModal.show('asset-offer-modal')
    },
    getSocialLinks: function () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
      if (content && content.length > 0 && content[0].data.social_links && content[0].data.social_links.length > 0) {
        return content.data.social_links
      }
      return [
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          social_link: [{
            text: 'type=twitter'
          }]
        },
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          social_link: [{
            text: 'type=facebook'
          }]
        }
      ]
    },
    registerForUpdates: function (email) {
      const data = {
        status: 1,
        domain: location.host,
        assetHash: this.assetHash,
        email: email
      }
      this.$store.dispatch('assetGeneralStore/registerForUpdates', data).then((result) => {
        this.$store.commit('setModalMessage', 'Thanks for registering an interest - we will keep you updated.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.message = result
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Thanks for re-registering an interest - we will keep you updated.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
      })
    }
  },
  computed: {
    currentCost: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.editionCost
    },
    salesButtonLabel () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](contractAsset.saleData.saleType)
    },
    salesBadgeLabel () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BADGE_LABEL](contractAsset.saleData.saleType)
    },
    salesInfoText () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_INFO_TEXT](contractAsset)
    },
    confirmOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('confirm-offer')
      return dialog
    },
    ttOnAuction () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      let tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-not-selling')
      if (contractAsset.saleData.saleType === 1) {
        tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-buy-now')
      } else if (contractAsset.saleData.saleType === 2) {
        tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-on-auction')
      } else if (contractAsset.saleData.saleType === 3) {
        tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-make-offer')
      }
      return (tooltip) ? tooltip[0].text : ''
    },
    ttStacksAddress () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-stacks-address')
      return (tooltip) ? tooltip[0].text : ''
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    videoOptions () {
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: false,
        dimensions: 'max-width: 100%; max-height: auto;',
        aspectRatio: '1:1',
        poster: (this.gaiaAsset.nftMedia.coverImage) ? this.gaiaAsset.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: this.gaiaAsset.nftMedia.artworkFile.fileUrl, type: this.gaiaAsset.nftMedia.artworkFile.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    isOwner: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!contractAsset || !profile || !profile.loggedIn) return false
      return profile.stxAddress === contractAsset.owner
    },
    owner () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset.owner
    }
  }
}
</script>

<style>
.more-link {
  border: 1pt solid #fff;
  padding: 3px 10px;
  text-align: center;
  font-size: 1.2rem;
}
.on-auction-text {
  text-transform: capitalize;
  font-weight: 700;
  font-size: 1.5rem;
}
#asset-offer-modal .modal-content {
  text-align: left !important;
}
</style>
