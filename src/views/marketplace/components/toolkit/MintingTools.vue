<template>
<div id="minting-tools" class="mt-3" v-if="item">
  <div class="">
    <div v-if="!item.contractAsset" class="w-100 text-small">
      <div v-if="!txPending || txPending.length === 0">
        <div v-if="isValid">
          <div>
            <b-button variant="outline-warning" @click="startMinting()">Mint File</b-button>
          </div>
        </div>
        <b-alert v-else show variant="danger">Information required - <b-link :to="'/edit-item/' + item.assetHash">edit this item</b-link></b-alert>
      </div>
    </div>
    <div v-else class="mt-5">
      <b-tabs justified content-class="bg-black text-white p-4 border mt-3">
        <b-tab active title="Sell">
          <div>
            <div class="mb-3">{{saleDataText}}</div>
            <b-button class="btn-action" variant="outline-warning" @click="openSaleDataDialog()">Update Sale Info</b-button>
          </div>
          <!--
          <b-tabs justified content-class="mt-3">
            <b-tab :title="'Info'">
              <div>
                <div class="my-5">{{saleDataText}}</div>
                <b-button class="btn-action" variant="outline-warning" @click="openSaleDataDialog()">Update Sale Info</b-button>
              </div>
            </b-tab>
            <b-tab :title="'Offers'" v-if="profile.superAdmin">
              <OfferHistory :item="item"/>
            </b-tab>
            <b-tab :title="'Bids'" v-if="profile.superAdmin">
              <BidHistory :item="item"/>
            </b-tab>
          </b-tabs>
          -->
        </b-tab>
        <b-tab title="Meta Data" v-if="allowEditEditions">
          <div class="row">
            <div class="col-12">
              <!-- <ManageEditions :item="item"/> -->
            </div>
            <div class="col-12 mb-4">
              <div>
                <a class="text-white" :href="item.contractAsset.tokenInfo.metaDataUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Meta Data URL: ' + item.contractAsset.tokenInfo.metaDataUrl" target="_blank"><b-icon class="mr-1" icon="arrow-up-right-circle"/>Meta Data URL</a>
              </div>
              <div>
                <a class="text-white" :href="application.tokenContract.baseTokenUri + item.contractAsset.nftIndex" v-b-tooltip.hover="{ variant: 'light' }" :title="'Base Token URL: ' + application.tokenContract.baseTokenUri + item.contractAsset.nftIndex" target="_blank"><b-icon class="mr-1" icon="arrow-up-right-circle"/>Base Token URL</a>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Royalties">
          <ListBeneficiaries class="mt-3" :item="item"/>
        </b-tab>
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
    <MintingFlow :assetHash="item.assetHash" v-on="$listeners"/>
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
import { APP_CONSTANTS } from '@/app-constants'
import AcceptOffer from '@/views/marketplace/components/toolkit/AcceptOffer'
// import ManageEditions from '@/views/marketplace/components/toolkit/editions/ManageEditions'
import TransferNft from '@/views/marketplace/components/toolkit/TransferNft'
import ListBeneficiaries from '@/views/marketplace/components/toolkit/ListBeneficiaries'
// import OfferHistory from '@/views/marketplace/components/toolkit/offers/OfferHistory'
// import BidHistory from '@/views/marketplace/components/toolkit/bids/BidHistory'

// const RisidioPay = () => import('risidio-pay')

export default {
  name: 'MintingTools',
  components: {
    MintingFlow,
    SellingFlow,
    // OfferHistory,
    // BidHistory,
    // RisidioPay,
    AcceptOffer,
    TransferNft,
    ListBeneficiaries
    // ManageEditions
  },
  props: ['item'],
  data: function () {
    return {
      allowEditEditions: process.env.VUE_APP_ALLOW_EDIT_EDITIONS,
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
      window.eventBus.$on('rpayEvent', function () {
        $self.$bvModal.hide('selling-modal')
        $self.$bvModal.hide('minting-modal')
        /**
        if (data.opcode === 'stx-transaction-sent' || data.opcode === 'stx-transaction-update') {
          if (data.txId) {
            const item = $self.item
            if (data && data.functionName === 'mint-token') {
              item.mintInfo = {
                txId: data.txId,
                txStatus: data.txStatus
              }
              $self.$store.dispatch('rpayMyItemStore/saveItem', item).then(() => {
                $self.$emit('update')
              }).catch(() => {
                $self.$emit('update')
              })
            } else {
              $self.$emit('update')
            }
          }
        }
        **/
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
      return new Date(madeData) // DateTime.fromMillis(madeData).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
    txPending () {
      let transactions
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
