<template>
<section v-if="gaiaAsset" class="container-fluid p-5 hundred-vh bg-black text-white">
  <b-container>
    <b-row>
      <div id="video-column" class="col-md-6 col-sm-12">
        <video :poster="poster()" controls style="width: 100%;">
          <source :src="gaiaAsset.nftMedia.artworkFile.fileUrl" :type="gaiaAsset.nftMedia.artworkFile.type">
        </video>
      </div>
      <div class="col-md-6 col-sm-12">
        <b-row align-v="stretch" :style="'height:' + videoHeight + 'px;'">
          <b-col cols="12"><router-link to="/"><b-icon icon="chevron-left" shift-h="-4" variant="danger"></b-icon> Back</router-link></b-col>
          <b-col cols="12" align-self="end">
            <h1>Artist {{getArtist()}}</h1>
            <h2>{{gaiaAsset.name}}</h2>
            <p class="border-top text-small">{{gaiaAsset.description}}</p>
            <div class="mb-5 d-flex justify-content-between">
              <div class=""><router-link :to="'/charity/' + gaiaAsset.assetHash">Find out more</router-link></div>
              <div class=""><router-link :to="'/charity/' + gaiaAsset.assetHash">Charity</router-link></div>
            </div>
            <div class="d-flex justify-content-between">
              <b-button @click="openPurchaceDialog()" class="mr-1 w-50" variant="light">{{purchaseButtonText()}}</b-button>
              <b-button @click="openUpdates()" class="ml-1 w-50" variant="dark">GET UPDATES</b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-row>
  </b-container>
  <asset-updates-modal :assetHash="assetHash" @registerForUpdates="registerForUpdates"/>
  <risidio-pay v-if="showRpay" :configuration="configuration"/>
</section>
</template>

<script>
import Vue from 'vue'
import AssetUpdatesModal from './AssetUpdatesModal'
import RisidioPay from 'risidio-pay'
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'AssetDetailsSection',
  components: {
    AssetUpdatesModal,
    RisidioPay
  },
  props: ['gaiaAsset'],
  data: function () {
    return {
      showRpay: false,
      dims: { width: 768, height: 768 },
      videoHeight: 0,
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    const $self = this
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'purchase-flow', asset: this.gaiaAsset })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        $self.mintResult = data.message
        if (data.opcode === 'stx-purchase-success' || data.opcode === 'eth-mint-success') {
          $self.showRpay = false
          $self.$bvModal.hide('minting-modal')
          $self.$bvModal.show('result-modal')
          const item = $self.$store.getters['myItemStore/myItem']($self.item.assetHash)
          item.tokenId = data.tokenId
          item.nftIndex = data.nftIndex
          item.network = data.network
          item.mintedDate = moment({}).valueOf()
          $self.$store.dispatch('myItemStore/saveItem', item).then((item) => {
            $self.mintResult = item.name + ' (#' + item.nftIndex + ') has been saved to your storage'
          })
        } else {
          $self.mintResult = data.message
        }
      })
    }
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientHeight
    }, this)
  },
  methods: {
    purchaseButtonText () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      if (!contractAsset || !contractAsset.saleData || contractAsset.saleData.saleType === 0) {
        return 'NOT FOR SALE'
      } else if (contractAsset.saleData.saleType === 1) {
        return 'BUY NOW'
      } else if (contractAsset.saleData.saleType === 2) {
        return 'PLACE BID'
      } else if (contractAsset.saleData.saleType === 3) {
        return 'MAKE AN OFFER'
      }
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
    openPurchaceDialog: function () {
      this.showRpay = true
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
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    }
  }
}
</script>

<style scoped>
</style>
