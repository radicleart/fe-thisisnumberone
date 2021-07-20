<template>
<div id="minting-tools" class="mt-3">
  <div class="">
    <div class="w-100 text-small">
      <div v-if="contractAsset">
        <div v-if="minting()">Minting - <a :href="transactionUrl()" target="_blank">track progress here...</a></div>
        <b-alert show variant="success">
          <div class="d-flex justify-content-between">
            <div class="w-100 text-small">Minted: Series Number {{contractAsset.nftIndex}} : Edition {{contractAsset.tokenInfo.edition}} of {{contractAsset.tokenInfo.maxEditions}}</div>
            <div>{{contractAsset.owner}}</div>
          </div>
        </b-alert>
      </div>
      <div v-else-if="isValid">
        <div>
          <b-button variant="outline-primary" @click="startMinting()">Mint File</b-button>
        </div>
        <div v-if="mintTxId">
          <a :href="transactionUrl" target="_blank">Show in Explorer</a>
        </div>
      </div>
      <b-alert v-else show variant="danger">Information required - <b-link :to="'/edit-item/' + item.assetHash">edit this item</b-link></b-alert>
    </div>

    <div v-if="contractAsset" class="mt-5">
      <b-tabs justified content-class="mt-3 text-small">
        <b-tab title="General" active>
          <div class="row" v-if="contractAsset && application">
            <div class="col-12 mb-5">
              <div class="">{{saleDataText}}</div>
            </div>
            <div class="col-12 mb-5">
              <div class="">
                <a :href="contractAsset.tokenInfo.metaDataUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Meta Data URL: ' + contractAsset.tokenInfo.metaDataUrl" target="_blank">Meta Data URL</a>
                / <a :href="application.tokenContract.baseTokenUri + contractAsset.nftIndex" v-b-tooltip.hover="{ variant: 'light' }" :title="'Base Token URL: ' + application.tokenContract.baseTokenUri + contractAsset.nftIndex" target="_blank">Base Token URL</a>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Royalties">
          <ListBeneficiaries :assetHash="assetHash"/>
        </b-tab>
        <b-tab title="Transfers">
          <TransferNft :assetHash="assetHash"/>
        </b-tab>
        <b-tab title="Gaia" v-if="profile.superAdmin">
          <GaiaHubRelay :assetHash="assetHash"/>
        </b-tab>
        <b-tab title="Next" v-if="contractNameNext">
          <b-button @click="startMinting()" :theme="'light'" :label1="'MINT ITEM'" :icon="'eye'"/>
        </b-tab>
        <b-tab title="Editions">
          <ManageEditions :assetHash="assetHash"/>
        </b-tab>
        <b-tab title="Sales" class="">
          <b-tabs justified content-class="mt-3">
            <b-tab :title="'Info'">
              <div>
                <div class="my-5">{{saleDataText}}</div>
                <b-button variant="outline-primary" @click="openSaleDataDialog()">Update Sale Info</b-button>
              </div>
            </b-tab>
            <b-tab :title="'Offers'">
              <OfferHistory :assetHash="assetHash"/>
            </b-tab>
            <b-tab :title="'Bids'">
              <BidHistory :assetHash="assetHash"/>
            </b-tab>
          </b-tabs>
        </b-tab>
      </b-tabs>
    </div>
  </div>

  <b-modal size="md" id="accept-offer-modal">
    <accept-offer :item="item" :offerData="offerData"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal id="result-modal">
    <div v-html="mintResult"></div>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="md" id="minting-modal">
    <MintingFlow :assetHash="assetHash" />
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="lg" id="selling-modal">
    <SellingFlow :assetHash="assetHash" />
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <!--
  <b-modal size="md" id="selling-modal">
    <risidio-pay v-if="showRpay" :configuration="configuration"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  -->
</div>
</template>

<script>
import MintingFlow from './mint-setup/MintingFlow'
import SellingFlow from './sell-setup/SellingFlow'
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import AcceptOffer from '@/components/toolkit/AcceptOffer'
import ManageEditions from '@/components/toolkit/editions/ManageEditions'
import TransferNft from '@/components/toolkit/TransferNft'
import ListBeneficiaries from '@/components/toolkit/ListBeneficiaries'
import GaiaHubRelay from '@/components/toolkit/GaiaHubRelay'
import OfferHistory from '@/components/toolkit/offers/OfferHistory'
import BidHistory from '@/components/toolkit/bids/BidHistory'

// const RisidioPay = () => import('risidio-pay')

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'MintingTools',
  components: {
    MintingFlow,
    SellingFlow,
    OfferHistory,
    BidHistory,
    // RisidioPay,
    AcceptOffer,
    TransferNft,
    ListBeneficiaries,
    GaiaHubRelay,
    ManageEditions
  },
  props: ['assetHash'],
  data: function () {
    return {
      contractNameNext: process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT,
      showRpay: false,
      showTransfers: false,
      showBeneficiaries: false,
      offerData: null,
      mintResult: null,
      mintTitle: '',
      mintTxId: null
    }
  },
  mounted () {
    const $self = this
    const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
    // if (item.uploader !== profile.username) throw new Error('Unexpected NFT ownership error')
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: item })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data && data.txId) $self.mintTxId = data.txId
        const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
        if (data.opcode === 'save-selling-data') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-finished' || data.opcode === 'eth-mint-success') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
          $self.mintResult = txResult
          // $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'stx-update-mint-data') {
          if (data.gaiaAsset) $self.$store.dispatch('rpayMyItemStore/saveItem', data.gaiaAsset)
        } else if (data.opcode === 'stx-save-and-close-mint-data') {
          // $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-sent') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
          $self.mintResult = txResult
          setInterval(function () {
            $self.$store.dispatch('rpayTransactionStore/fetchTransactionInfo', $self.mintTxId)
          }, 10000)
          // $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'cancel-minting') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
        }
      })
    }
  },
  methods: {
    openSaleDataDialog: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      item.saleData = contractAsset.saleData
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'selling-flow', asset: item })
      this.showRpay = true
      this.$bvModal.show('selling-modal')
    },
    minting: function () {
      return this.mintTxId
    },
    startMinting: function () {
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: this.item })
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.$bvModal.show('minting-modal')
    },
    downable: function () {
      return this.uploadState > 2
    },
    acceptOffer: function (offer, index) {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      this.offerData = {
        offer: offer,
        owner: contractAsset.owner,
        offerIndex: index,
        nftIndex: contractAsset.nftIndex
      }
      this.$bvModal.show('accept-offer-modal')
    },
    offerAmount: function (amount) {
      return (amount)
    },
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM hh:mm')
    },
    transactionUrl: function () {
      return 'https://explorer.stacks.co/txid/' + this.mintTxId + '?chain=' + NETWORK
    },
    minted: function () {
      return this.item.nftIndex > -1
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
    transaction () {
      const transaction = this.$store.getters[APP_CONSTANTS.KEY_TRANSACTION](this.mintTxId)
      return transaction
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    saleDataText () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_INFO_TEXT](contractAsset)
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    isValid: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems.length === 0
    },
    mintedDate: function () {
      if (this.item.nftIndex > -1) {
        return moment(this.item.mintedDate).format('YYYY-MM-DD HH:mm:SS')
      }
      return null
    }
  }
}
</script>

<style>
#selling-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}
#minting-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}
#minting-tools  .nav-link.active {
  color: #000;
}
#minting-tools .nav-link:hover {
  color: #ccc;
}
</style>
