<template>
<div id="minting-tools" class="mt-3">
  <div class="text-white">
    <div class="w-100 text-small">
      <div v-if="contractAsset">
        <div v-if="minting()">Minting - <a :href="transactionUrl()" target="_blank">track progress here...</a></div>
        <b-alert show variant="success">Minted: Series Number {{contractAsset.nftIndex}} : Edition {{contractAsset.tokenInfo.edition}} of {{contractAsset.tokenInfo.maxEditions}}</b-alert>
      </div>
      <div v-else-if="isValid" show variant="danger">
        <square-button @clickButton="mintToken()" :theme="'light'" :label1="'MINT ITEM'" :icon="'eye'"/>
      </div>
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
            <div class="col-12 mb-5">
              <b-tabs  content-class="p-4">
                <b-tab title="Beneficiaries" active>
                  <list-beneficiaries :assetHash="assetHash"/>
                </b-tab>
                <b-tab title="Transfers">
                  <transfer-nft :assetHash="assetHash"/>
                </b-tab>
                <b-tab title="Gaia">
                  <gaia-hub-relay :assetHash="assetHash"/>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </b-tab>
        <b-tab title="Sales" class="text-white">
          <div>
            <div class="my-5">{{saleDataText}}</div>
            <square-button @clickButton="openSaleDataDialog()" :theme="'light'" :label1="'UPDATE SALE INFO'" :icon="'eye'"/>
          </div>
        </b-tab>
        <b-tab :title="contractAsset.offerCounter + ' Offers'">
          <div class="upload-preview text-small">
            <div class="row mb-4" v-for="(offer, index1) in contractAsset.offerHistory" :key="index1">
              <div class="col-2">Offerer</div>
              <div class="col-10">{{offer.offerer}}</div>
              <div class="col-2">Amount</div>
              <div class="col-10">{{offer.amount}} STX</div>
              <div class="col-2">Made</div>
              <div class="col-10">{{offerMade(offer.appTimestamp)}}</div>
              <div class="col-2"></div>
            </div>
          </div>
        </b-tab>
        <b-tab :title="contractAsset.bidCounter + ' Bids'">
          <div class="upload-preview text-small">
            <div class="row mb-4" v-for="(bid, index1) in contractAsset.bidHistory" :key="index1">
              <div class="col-2">Bidder</div>
              <div class="col-10">{{bid.bidder}}</div>
              <div class="col-2">Amount</div>
              <div class="col-10">{{bid.amount}} STX</div>
              <div class="col-2">Made</div>
              <div class="col-10">{{offerMade(bid.appTimestamp)}}</div>
              <div class="col-2"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-6"><a class="text-info" href="#" @click.prevent="closeBidding(1)">refund and close</a></div>
            <div class="col-6"><a class="text-info" href="#" @click.prevent="closeBidding(2)">transfer and close</a></div>
          </div>
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
    <minting-flow :assetHash="assetHash" />
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="md" id="selling-modal">
    <risidio-pay v-if="showRpay" :configuration="configuration"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</div>
</template>

<script>
import MintingFlow from './mint-setup/MintingFlow'
import SquareButton from '@/components/utils/SquareButton'
import RisidioPay from 'risidio-pay'
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import AcceptOffer from '@/components/toolkit/AcceptOffer'
import TransferNft from '@/components/toolkit/TransferNft'
import ListBeneficiaries from '@/components/toolkit/ListBeneficiaries'
import GaiaHubRelay from '@/components/toolkit/GaiaHubRelay'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'MintingTools',
  components: {
    MintingFlow,
    RisidioPay,
    AcceptOffer,
    TransferNft,
    ListBeneficiaries,
    GaiaHubRelay,
    SquareButton
  },
  props: ['assetHash'],
  data: function () {
    return {
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
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
    if (item.uploader !== profile.username) throw new Error('Unexpected NFT ownership error')
    item.gaiaUsername = item.uploader
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
          $self.$bvModal.show('result-modal')
        } else if (data.opcode === 'stx-update-mint-data') {
          // $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-save-and-close-mint-data') {
          // $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-sent') {
          $self.$bvModal.hide('selling-modal')
          $self.$bvModal.hide('minting-modal')
          $self.mintResult = txResult
          $self.$bvModal.show('result-modal')
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
    mintToken: function () {
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
    closeBidding: function (closeType) {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        nftIndex: contractAsset.nftIndex,
        closeType: closeType,
        functionName: 'close-bidding'
      }
      this.$store.dispatch('rpayPurchaseStore/closeBidding', data).then((result) => {
        this.result = result
        this.$store.dispatch('myItemStore/initSchema', true)
      })
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
#minting-tools .nav-link {
  color: #fff;
}
#minting-tools .nav-link:hover {
  color: #ccc;
}
</style>
