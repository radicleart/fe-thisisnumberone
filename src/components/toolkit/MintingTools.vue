<template>
<div id="minting-tools" class="mt-3">
  <div class="text-white">
    <div class="w-100 text-small">
      <div v-if="contractAsset">
        <div v-if="!item.mintTxId">Minting - <a :href="trackingUrl()" target="_blank">track progress here...</a></div>
        <b-alert show variant="success">Minted: Series Number {{contractAsset.nftIndex}} : Edition {{contractAsset.tokenInfo.edition}} of {{contractAsset.tokenInfo.maxEditions}}</b-alert>
      </div>
      <b-alert v-else-if="isValid" show variant="danger">
        <b-button style="width: 100%;" variant="danger" @click.prevent="mintToken()">Mint this item now.</b-button>
      </b-alert>
      <b-alert v-else show variant="danger">not valid - information required</b-alert>
    </div>

    <div v-if="contractAsset">
      <b-tabs justified content-class="mt-3">
        <b-tab title="General" active>
          <div class="row">
            <div class="col-12">
              <p>owned by:<br/>
              {{contractAsset.owner}}
              </p>
            </div>
            <div class="col-12 mb-5">
              <div class="">{{saleDataText}}</div>
            </div>
            <b-tabs justified content-class="p-4 ">
              <b-tab title="Beneficiaries" active>
                <beneficiaries :assetHash="assetHash"/>
              </b-tab>
              <b-tab title="Transfers">
                <transfer-nft :assetHash="assetHash"/>
              </b-tab>
              <b-tab title="Gaia">
                <gaia-hub-relay :assetHash="assetHash"/>
              </b-tab>
            </b-tabs>
          </div>
        </b-tab>
        <b-tab title="Sales" class="text-white">
          <div>
            <div class="">{{saleDataText}}</div>
            <a href="#" @click.prevent="openSaleDataDialog()">Review the sale information</a>
          </div>
        </b-tab>
        <b-tab :title="contractAsset.offerCounter + ' Offers'">
          <div class="upload-preview text-small">
            <div class="row mb-4" v-for="(offer, index1) in contractAsset.offerHistory" :key="index1">
              <div class="col-2">Offerer</div>
              <div class="col-10">{{offer.offerer}}</div>
              <div class="col-2">Amount</div>
              <div class="col-10">{{offerAmount(offer.amount)}} STX</div>
              <div class="col-2">Made</div>
              <div class="col-10">{{offerMade(offer.madeDate)}}</div>
              <div class="col-2"></div>
              <div class="col-10"><a href="#" @click.prevent="acceptOffer(offer, index1)">accept</a></div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Bids"><p>Bidding not enabled.</p></b-tab>
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
  <b-modal size="md" id="rpay-modal">
    <risidio-pay v-if="showRpay" :configuration="configuration"/>
  </b-modal>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import RisidioPay from 'risidio-pay'
import utils from '@/services/utils'
import AcceptOffer from '@/components/toolkit/AcceptOffer'
import TransferNft from '@/components/toolkit/TransferNft'
import Beneficiaries from '@/components/toolkit/Beneficiaries'
import GaiaHubRelay from '@/components/toolkit/GaiaHubRelay'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'MintingTools',
  components: {
    RisidioPay,
    AcceptOffer,
    TransferNft,
    Beneficiaries,
    GaiaHubRelay
  },
  props: ['assetHash'],
  data: function () {
    return {
      showTransfers: false,
      showBeneficiaries: false,
      offerData: null,
      showRpay: false,
      mintResult: null,
      trackingMessage: 'Blockchain called - answer will be back shortly. You can <a href="____" target="_blank">track the transaction here</a> and the data on this page should refresh automatically.',
      mintTitle: ''
    }
  },
  mounted () {
    const $self = this
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
    if (item.uploader !== profile.username) throw new Error('Unexpected NFT ownership error')
    item.gaiaUsername = item.uploader
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: item })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        $self.mintResult = data.message
        if (data.opcode === 'save-selling-data') {
          $self.$bvModal.hide('rpay-modal')
        } else if (data.opcode === 'stx-mint-success' || data.opcode === 'eth-mint-success') {
          $self.showRpay = false
          $self.$bvModal.hide('rpay-modal')
          $self.$bvModal.show('result-modal')
          const item = $self.$store.getters['myItemStore/myItem']($self.item.assetHash)
          item.tokenId = data.tokenId
          item.nftIndex = data.nftIndex
          item.network = data.network
          item.mintedDate = moment({}).valueOf()
          $self.$store.dispatch('myItemStore/saveItem', item).then((item) => {
            $self.mintResult = item.name + ' (#' + item.nftIndex + ') has been saved to your storage'
          })
        } else if (data.opcode === 'stx-update-mint-data') {
          // $self.showRpay = false
          // $self.$bvModal.hide('rpay-modal')
        } else if (data.opcode === 'stx-save-and-close-mint-data') {
          // $self.showRpay = false
          // $self.$bvModal.hide('rpay-modal')
        } else if (data.opcode === 'stx-transaction-sent') {
          $self.showRpay = false
          $self.$bvModal.hide('rpay-modal')
          $self.mintResult = $self.trackingMessage.replace('____', $self.transactionUrl(data.txId))
          $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'stx-transaction-finished') {
          $self.showRpay = false
          $self.$bvModal.hide('rpay-modal')
          $self.mintResult = $self.trackingMessage.replace('____', $self.transactionUrl(data.txId))
          $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'cancel-minting') {
          $self.showRpay = false
          $self.$bvModal.hide('rpay-modal')
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
      this.$bvModal.show('rpay-modal')
    },
    trackingUrl: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](item.mintTxId)
    },
    mintToken: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      this.$bvModal.show('rpay-modal')
      this.mintTitle = 'Mint: ' + item.name
      this.showRpay = true
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
      return utils.fromMicroAmount(amount)
    },
    offerMade: function (madeData) {
      return moment(madeData).format('DD-MM hh:mm')
    },
    transactionUrl: function (txId) {
      return 'https://explorer.stacks.co/txid/' + txId + '?chain=' + NETWORK
    },
    minted: function () {
      return this.item.nftIndex > -1
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    saleDataText () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset || !contractAsset.saleData || contractAsset.saleData.saleType === 0) {
        return 'NOT FOR SALE'
      } else if (contractAsset.saleData.saleType === 1) {
        return 'Buy now for ' + (contractAsset.saleData.buyNowOrStartingPrice)
      } else if (contractAsset.saleData.saleType === 2) {
        return 'Place a bid current highest bid is ' + (contractAsset.saleData.buyNowOrStartingPrice)
      } else if (contractAsset.saleData.saleType === 3) {
        return 'Offers over ' + (contractAsset.saleData.reservePrice) + ' STX will be considered'
      } else {
        return 'Unknown sale type?'
      }
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
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
#rpay-modal .modal-content {
  border: none !important;
  background-color: #fff !important;
}
#rpay-modal .modal-content {
  background-color: transparent !important;
  border-radius: 20px;
  min-height: 200px;
  color: #fff;
  border: none;
}
#rpay-modal .modal-header {
  display: none;
  border-bottom: 0px solid #dee2e6;
  border-radius: 20px;
}
#rpay-modal .modal-footer {
  display: none;
  border-top: 0px solid #dee2e6;
  border-radius: 20px;
}
#rpay-modal .footer-container {
  background: transparent !important;
}
#minting-tools  .nav-link.active {
  color: #000;
}
#minting-tools .nav-link {
  color: #fff;
}
#minting-tools .nav-link:hover {
  color: #ccc;
}
</style>
