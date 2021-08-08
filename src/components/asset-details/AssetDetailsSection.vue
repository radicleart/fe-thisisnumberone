<template>
<section :key="componentKey" id="asset-details-section" v-if="gaiaAsset && gaiaAsset.contractAsset" class="text-white">
  <b-container class="center-section" style="min-height: 50vh;">
    <b-row align-h="center" :style="'min-height: ' + videoHeight + 'px'">
      <b-col lg="7" sm="10" class="mb-5">
        <div id="video-column" :style="dimensions">
          <media-item :videoOptions="videoOptions" :attributes="gaiaAsset.attributes" :targetItem="targetItem()"/>
        </div>
      </b-col>
      <b-col lg="5" sm="10">
        <b-row align-v="stretch" :style="'min-height: ' + videoHeight + 'px'">
          <b-col cols="12" class="">
            <div class="d-flex justify-content-between mb-5">
              <div><router-link class="text-white" to="/home"><b-icon icon="chevron-left" shift-h="-4" variant="white"></b-icon> Back</router-link></div>
              <div class="d-flex justify-content-between">
                <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="ttOnAuction" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
                <div class="text-center on-auction-text ml-3 py-3 px-4 bg-warning text-white">
                  <div v-if="isOwner"><router-link class="text-white" to="/my-nfts">{{salesBadgeLabel}}</router-link></div>
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
              <p class="border-bottom pb-4" style="font-size: 1.2rem;">{{owner}} <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }"  :title="ttStacksAddress" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link></p>
              <div class="w-100">
                <p class="pt-4 text-small" v-html="preserveWhiteSpace(gaiaAsset.description)"></p>
              </div>
              <div class="w-25">
                <share-links class="mt-4" :socialLinks="getSocialLinks()" :gaiaAsset="gaiaAsset" />
              </div>
              <b-row class="my-4">
                <b-col md="6" sm="12" class="mb-3">
                  <div class="more-link m-0" v-scroll-to="{ element: '#artist-section', duration: 1000 }"><b-link class="text-white">Find out more</b-link></div>
                </b-col>
                <b-col md="6" sm="12" class="">
                  <div class="more-link m-0" v-scroll-to="{ element: '#charity-section', duration: 1000 }"><b-link class="text-white">Charity</b-link></div>
                </b-col>
              </b-row>
              <b-row v-if="getSaleType() === 0">
                <b-col md="6" sm="12" v-if="editionsAvailable">
                  <EditionTrigger :item="gaiaAsset" @mintedEvent="mintedEvent"/>
                </b-col>
                <b-col md="6" sm="12" v-else>
                  <square-button @clickButton="openUpdates()" :theme="'light'" :label1="'GET UPDATES'" :icon="'eye'" :text-warning="true"/>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col v-if="webWalletNeeded" md="6" sm="12" class="mb-3">
                    <b-button v-b-tooltip.hover="{ variant: 'light' }" :title="ttWalletHelp" class="w-100" style="height: 61px;" variant="outline-light"><a :href="webWalletLink" class="text-white" target="_blank">Get Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></b-button>
                </b-col>
                <b-col md="6" sm="6" class="mb-3 text-center" v-else-if="getSaleType() > 0 && getSaleType() < 3">
                  <square-button v-b-tooltip.hover="{ variant: 'light' }" :title="ttBiddingHelp" @clickButton="openPurchaceDialog()" :theme="'light'" :label1="salesButtonLabel" :svgImage="hammer" :text-warning="true"/>
                </b-col>
                <b-col md="6" sm="6" class="text-center">
                  <square-button v-b-tooltip.hover="{ variant: 'light' }" :title="ttOfferingHelp" @clickButton="openOfferPurchaceDialog()" :theme="'light'" :label1="'MAKE OFFER'" :svgImage="hammer" :text-warning="true"/>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  <b-modal size="lg" id="asset-offer-modal" class="text-left">
    <purchase-flow v-if="showRpay === 1" :gaiaAsset="gaiaAsset" :forceOfferFlow="forceOfferFlow" @offerSent="offerSent"/>
    <asset-updates-modal v-if="showRpay === 2" :assetHash="gaiaAsset.assetHash" @registerForUpdates="registerForUpdates"/>
    <template #modal-header="{ close }">
      <div class=" text-warning w-100 d-flex justify-content-end">
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
import MediaItem from '@/components/upload/MediaItem'
import SquareButton from '@/components/utils/SquareButton'
import ShareLinks from '@/components/utils/ShareLinks'
import moment from 'moment'
import EditionTrigger from '@/components/toolkit/editions/EditionTrigger'
import utils from '@/services/utils'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'AssetDetailsSection',
  components: {
    AssetUpdatesModal,
    EditionTrigger,
    PurchaseFlow,
    MediaItem,
    SquareButton,
    ShareLinks
  },
  props: ['gaiaAsset'],
  data: function () {
    return {
      forceOfferFlow: false,
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      hammer: require('@/assets/img/auction.svg'),
      showRpay: 0,
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
    mintedEvent (data) {
      this.$store.commit('setModalMessage', 'Request to mint an edition sent to the blockchain - thanks for using #1. Transaction Id: ' + data.txId)
      this.$root.$emit('bv::show::modal', 'success-modal')
    },
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
    formatNumber: function (number) {
      return utils.formatNumber(number)
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
      return this.gaiaAsset.contractAsset.saleData.saleType === 2
    },
    biddingEndTime: function () {
      return moment(this.gaiaAsset.contractAsset.saleData.biddingEndTime).format('ddd, MMMM Do, h:mma') + ' BST'
    },
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.gaiaAsset)
    },
    dimensions () {
      const dims = { width: '100%', height: '100%' }
      return 'max-width: ' + dims.height + '; max-height: ' + dims.height + ';'
    },
    poster: function () {
      if (this.gaiaAsset.attributes.coverImage) {
        return this.gaiaAsset.attributes.coverImage.fileUrl
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
      return this.gaiaAsset.contractAsset.saleData.saleType
    },
    transactionUrl: function (txId) {
      return 'https://explorer.stacks.co/txid/' + txId + '?chain=' + NETWORK
    },
    openPurchaceDialog: function () {
      this.forceOfferFlow = false
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile.loggedIn && this.gaiaAsset.contractAsset.saleData.saleType !== 3) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$emit('registerByConnect')
        }).catch((err) => {
          console.log(err)
          // https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj
          this.webWalletNeeded = true
        })
      } else {
        if (this.gaiaAsset.contractAsset.saleData.saleType === 0) {
          return
        }
        this.showRpay = 1
        this.$bvModal.show('asset-offer-modal')
      }
    },
    openOfferPurchaceDialog: function () {
      this.forceOfferFlow = true
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
    emailText () {
      const emailText = this.$store.getters[APP_CONSTANTS.KEY_EMAIL_TEXT]('registeremail')
      const answer = (emailText) ? emailText[0].text : 'Interest Registered'
      return answer
    },
    registerForUpdates: function (email) {
      const data = {
        emailContent: this.emailText(),
        status: 1,
        domain: location.host,
        assetHash: this.assetHash,
        email: email
      }
      this.$store.dispatch('rpayPurchaseStore/registerForUpdates', data).then((result) => {
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
    editionsAvailable: function () {
      return this.gaiaAsset.contractAsset.editionCounter < this.gaiaAsset.contractAsset.tokenInfo.maxEditions
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    usdAmount () {
      try {
        const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
        const rate = tickerRates.find((o) => o.currency === 'USD')
        const offer = this.$store.getters[APP_CONSTANTS.KEY_HIGHEST_OFFER_ON_ASSET](this.gaiaAsset.contractAsset.tokenInfo.assetHash)
        const currentOffer = (offer && offer.amount) ? offer.amount : 0
        const minimumOffer = Math.max(currentOffer, (this.gaiaAsset.contractAsset.saleData.reservePrice))
        const amountUsd = Number(utils.toDecimals(rate.stxPrice * minimumOffer)).toLocaleString()
        return 'Current highest offer: ' + amountUsd + ' USD'
      } catch (e) {
        return null
      }
    },
    currentCost: function () {
      return this.gaiaAsset.contractAsset.tokenInfo.editionCost
    },
    salesButtonLabel () {
      if (this.webWalletNeeded) return 'GET STACKS WALLET'
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile.loggedIn && this.gaiaAsset.contractAsset.saleData.saleType !== 3) return 'LOGIN TO BID'
      const label = this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](this.gaiaAsset.contractAsset.saleData.saleType)
      if (this.gaiaAsset.contractAsset.saleData.saleType === 2) {
        const bid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](this.gaiaAsset.contractAsset)
        if (bid) return 'BID: ' + bid.amountFmt + ' STX'
      }
      return label
    },
    salesBadgeLabel () {
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BADGE_LABEL](this.gaiaAsset.contractAsset)
    },
    confirmOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('confirm-offer')
      return dialog
    },
    ttWalletHelp () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-wallet-help')
      return (tooltip) ? tooltip[0].text : ''
    },
    ttBiddingHelp () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-bidding-help')
      return (tooltip) ? tooltip[0].text : ''
    },
    ttOfferingHelp () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-offering-help')
      return (tooltip) ? tooltip[0].text : ''
    },
    ttOnAuction () {
      let tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-not-selling')
      if (this.gaiaAsset.contractAsset.saleData.saleType === 1) {
        tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-buy-now')
      } else if (this.gaiaAsset.contractAsset.saleData.saleType === 2) {
        tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-on-auction')
      } else if (this.gaiaAsset.contractAsset.saleData.saleType === 3) {
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
        poster: (this.gaiaAsset.attributes.coverImage) ? this.gaiaAsset.attributes.coverImage.fileUrl : null,
        sources: [
          { src: this.gaiaAsset.attributes.artworkFile.fileUrl, type: this.gaiaAsset.attributes.artworkFile.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    isOwner: function () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!this.gaiaAsset.contractAsset || !profile || !profile.loggedIn) return false
      return profile.stxAddress === this.gaiaAsset.contractAsset.owner
    },
    owner () {
      return this.gaiaAsset.contractAsset.owner
    },
    webWalletNeeded () {
      const webWalletNeeded = this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_NEEDED]
      return webWalletNeeded
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
