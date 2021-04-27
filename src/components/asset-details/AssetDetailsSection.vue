<template>
<section v-if="gaiaAsset" class="mx-md-5 px-md-5 mb-5 p-5 text-white" style="min-height: 120vh;">
    <b-row class="mx-md-5 px-md-5 p-5">
      <div id="video-column" class="col-md-6 col-sm-12">
        <div class="mb-5" :style="dimensions">
          <media-item class="p-0 m-0" :videoOptions="videoOptions" :nftMedia="gaiaAsset.nftMedia" :targetItem="targetItem()"/>
        </div>
      </div>
      <div class="col-md-6 col-sm-12">
        <b-row align-v="stretch" :style="'height:' + videoHeight * .5 + 'px;'">
          <b-col cols="12 mb-md-5">
            <div class="d-flex justify-content-between">
              <div><router-link class="text-white" to="/home"><b-icon icon="chevron-left" shift-h="-4" variant="white"></b-icon> Back</router-link></div>
              <div class="d-flex justify-content-between">
                <b-link router-tag="span" v-b-tooltip.click :title="ttOnAuction" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
                <div class="text-center on-auction-text ml-3 py-3 px-4 bg-warning text-white"><div>{{salesBadgeLabel}}</div><div v-if="showEndTime()">{{biddingEndTime()}}</div></div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" align-self="center">
            <h1>{{gaiaAsset.name}}</h1>
            <h2>{{gaiaAsset.artist}}</h2>
            <p>{{owner}} <b-link router-tag="span" v-b-tooltip.click :title="ttStacksAddress" class="text-white" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link></p>
            <p class="border-top pt-4" style="font-size: 1.2rem;">{{gaiaAsset.description}}</p>
            <div class="w-50 my-5 d-flex justify-content-between">
              <div v-scroll-to="{ element: '#artist-section', duration: 1000 }"><b-link class="text-white">Find out more</b-link></div>
              <div v-scroll-to="{ element: '#charity-section', duration: 1000 }"><b-link class="text-white">Charity</b-link></div>
            </div>
            <!--
            <div class="d-flex justify-content-start">
              {{salesInfoText}}
            </div>
            -->
            <div class="d-flex justify-content-start">
              <square-button v-if="getSaleType() > 0" class="mr-4" @clickButton="openPurchaceDialog()" :theme="'light'" :label1="salesButtonLabel" :svgImage="hammer"/>
              <square-button @clickButton="openUpdates()" :theme="'light'" :label1="'GET UPDATES'" :icon="'eye'"/>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-row>
  <asset-updates-modal :assetHash="gaiaAsset.assetHash" @registerForUpdates="registerForUpdates"/>
  <b-modal size="lg" id="asset-offer-modal" class="text-left">
    <purchase-flow v-if="showRpay" :gaiaAsset="gaiaAsset" @offerSent="offerSent"/>
    <template #modal-header>
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
</section>
</template>

<script>
import Vue from 'vue'
import AssetUpdatesModal from './offers/AssetUpdatesModal'
import PurchaseFlow from './offers/PurchaseFlow'
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/utils/MediaItem'
import SquareButton from '@/components/utils/SquareButton'
import moment from 'moment'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'AssetDetailsSection',
  components: {
    AssetUpdatesModal,
    PurchaseFlow,
    MediaItem,
    SquareButton
  },
  props: ['gaiaAsset'],
  data: function () {
    return {
      hammer: require('@/assets/img/auction.svg'),
      showRpay: false,
      dims: { width: 768, height: 768 },
      videoHeight: 0,
      showHash: false,
      assetHash: null,
      mintResult: null,
      mintResultTxId: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    const $self = this
    const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
    this.gaiaAsset.saleData = contractAsset.saleData
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'purchase-flow', asset: this.gaiaAsset })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
        $self.$store.commit('setModalMessage', txResult)
        if (data.opcode.indexOf('stx-transaction-') > -1) {
          $self.showRpay = false
          $self.$bvModal.hide('result-modal')
          $self.$bvModal.hide('asset-offer-modal')
          $self.$bvModal.hide('rpay-modal')
          $self.mintResult = txResult
          $self.$root.$emit('bv::show::modal', 'success-modal')
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
      this.$bvModal.show('asset-updates-modal', { assetHash: this.assetHash })
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
      this.showRpay = true
      this.$bvModal.show('asset-offer-modal')
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
        this.$bvModal.hide('asset-updates-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.message = result
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Thanks for re-registering an interest - we will keep you updated.')
        this.$bvModal.hide('asset-updates-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
      })
    }
  },
  computed: {
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
        playOnHover: true,
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
        fluid: true
      }
      return videoOptions
    },
    owner () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset.owner
    }
  }
}
</script>

<style>
.on-auction-text {
  text-transform: capitalize;
  font-weight: 700;
  font-size: 1.1rem;
}
#asset-offer-modal .modal-content {
  text-align: left !important;
}

</style>
