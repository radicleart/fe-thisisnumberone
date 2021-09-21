<template>
<div id="minting-tools" class="mt-3" v-if="item">
  <div class="">
    <div v-if="!item.contractAsset" class="w-100 text-small">
      <div v-if="txPending && txPending.length > 0">
        Minting in progess - please refresh this page when the transaction completes.
      </div>
      <div v-else>
        <div v-if="isValid">
          <div>
            <b-button variant="outline-warning" @click="startMinting()">Mint File</b-button>
          </div>
        </div>
        <b-alert v-else show variant="danger">Information required - <b-link :to="'/edit-item/' + item.assetHash">edit this item</b-link></b-alert>
      </div>
    </div>
    <div v-else class="mt-5">
      <b-tabs justified content-class="bg-black p-5 mt-3">
        <b-tab :title="'Sell'" active>
          <div class="mb-5">Set buy now price or switch off sales</div>
          <div>
            <b-button class="btn-action" variant="outline-warning" @click="openSaleDataDialog()">Update Sale Info</b-button>
          </div>
        </b-tab>
        <!--
        <b-tab title="Sell" >
          <b-tabs justified content-class="mt-3">
            <b-tab :title="'Offers'" v-if="profile.superAdmin">
              <OfferHistory :item="item"/>
            </b-tab>
            <b-tab :title="'Bids'" v-if="profile.superAdmin">
              <BidHistory :item="item"/>
            </b-tab>
          </b-tabs>
        </b-tab>
        <b-tab title="General" >
          <div class="row" v-if="item.contractAsset && application">
            <div class="col-12">
              <ManageEditions :item="item"/>
            </div>
            <div class="col-12 mb-4">
              <div class="text-white">
                <a :href="item.contractAsset.tokenInfo.metaDataUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Meta Data URL: ' + item.contractAsset.tokenInfo.metaDataUrl" target="_blank">Meta Data URL <b-icon class="ml-3" icon="arrow-up-right-circle"/></a>
                <br/>
                <a :href="application.tokenContract.baseTokenUri + item.contractAsset.nftIndex" v-b-tooltip.hover="{ variant: 'light' }" :title="'Base Token URL: ' + application.tokenContract.baseTokenUri + item.contractAsset.nftIndex" target="_blank">Base Token URL <b-icon class="ml-3" icon="arrow-up-right-circle"/></a>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Royalties">
          <ListBeneficiaries :item="item"/>
        </b-tab>
        -->
        <b-tab title="Transfer">
          <TransferNft :item="item"/>
        </b-tab>
        <b-tab title="Next" v-if="profile.superAdmin && contractNameNext">
          <b-button @click="startMinting()" :theme="'light'" :label1="'MINT ITEM'" :icon="'eye'"/>
        </b-tab>
      </b-tabs>
    </div>
  </div>

  <b-modal size="md" id="accept-offer-modal">
    <AcceptOffer :item="item" :offerData="offerData"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal id="result-modal">
    <div v-html="mintResult"></div>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="md" id="minting-modal">
    <MintingFlow :item="item" />
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="lg" id="selling-modal">
    <SellingFlow @cancel="cancel" :contractAsset="item.contractAsset"  v-if="item.contractAsset"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</div>
</template>

<script>
import MintingFlow from './mint-setup/MintingFlow'
import SellingFlow from './sell-setup/SellingFlow'
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import AcceptOffer from '@/components/toolkit/AcceptOffer'
// import ManageEditions from '@/components/toolkit/editions/ManageEditions'
import TransferNft from '@/components/toolkit/TransferNft'
// import ListBeneficiaries from '@/components/toolkit/ListBeneficiaries'
// import OfferHistory from '@/components/toolkit/offers/OfferHistory'
// import BidHistory from '@/components/toolkit/bids/BidHistory'
// const RisidioPay = () => import('risidio-pay')
export default {
  name: 'MintingTools',
  components: {
    MintingFlow,
    SellingFlow,
    // RisidioPay,
    AcceptOffer,
    TransferNft
  },
  props: ['item'],
  data: function () {
    return {
      contractNameNext: process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT,
      showRpay: false,
      showTransfers: false,
      showBeneficiaries: false,
      offerData: null,
      mintResult: null,
      mintTitle: ''
    }
  },
  mounted () {
    const $self = this
    // const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
    // if (item.uploader !== profile.username) throw new Error('Unexpected NFT ownership error')
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: this.item })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'save-selling-data') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-finished' || data.opcode === 'eth-mint-success') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
          $self.mintResult = data
          // $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'stx-update-mint-data') {
          if (data.gaiaAsset) $self.$store.dispatch('rpayMyItemStore/saveItem', data.gaiaAsset)
        } else if (data.opcode === 'stx-save-and-close-mint-data') {
          // $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-sent' || data.opcode === 'stx-transaction-update') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
          if (data.txId) {
            const item = $self.item
            if (data && data.functionName === 'mint-token') {
              item.mintInfo = {
                txId: data.txId,
                txStatus: data.txStatus
              }
            }
            $self.$store.dispatch('rpayMyItemStore/saveItem', item).then(() => {
              $self.$emit('update')
            }).catch(() => {
              $self.$emit('update')
            })
          }
          // $self.$notify({ type: 'warning', title: 'Transaction News', text: 'Transaction ' + data.functionName + ' has status ' + data.txStatus })
        } else if (data.opcode === 'cancel-minting') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
        }
      })
    }
  },
  methods: {
    cancel: function () {
      this.$bvModal.hide('selling-modal')
      this.$bvModal.hide('minting-modal')
    },
    openSaleDataDialog: function () {
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'selling-flow', asset: this.item })
      this.showRpay = true
      this.$bvModal.show('selling-modal')
    },
    startMinting: function () {
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: this.item })
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.$bvModal.show('minting-modal')
    },
    downable: function () {
      return this.uploadState > 2
    },
    offerAmount: function (amount) {
      return (amount)
    },
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM hh:mm')
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
    txPending () {
      let transactions = []
      if (this.item.contractAsset) {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_TX_ID](this.item.contractAsset.nftIndex)
      } else {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_ASSET_HASH](this.item.assetHash)
      }
      return transactions
    },
    transaction () {
      const transaction = this.$store.getters[APP_CONSTANTS.KEY_TRANSACTION](this.item.mintInfo.txId)
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
    saleDataText () {
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_INFO_TEXT](this.item.contractAsset)
    },
    isValid: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems.length === 0
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
