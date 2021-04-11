<template>
<div  class="mt-3">
  <div class="text-white">
    <div class="w-100 text-small">
      <b-alert v-if="contractAsset" show variant="success">Minted : Edition {{contractAsset.tokenInfo.edition}} of {{contractAsset.tokenInfo.maxEditions}}</b-alert>
      <b-alert v-else-if="isValid" show variant="danger"><b-button class="" variant="danger" @click.prevent="mintToken()">Mint this item now.</b-button></b-alert>
      <b-alert v-else show variant="danger">not valid - fields required</b-alert>
    </div>

    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="Sales" active>
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
    <div>Contract called: <a :href="transactionUrl(mintResultTxId)" target="_blank">check transaction</a></div>
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

const RISIDIO_ASSET_URL = process.env.VUE_APP_RISIDIO_ASSET_URL
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'MintingTools',
  components: {
    RisidioPay,
    AcceptOffer
  },
  props: ['item'],
  data: function () {
    return {
      offerData: null,
      showRpay: false,
      mintResult: null,
      mintResultTxId: null,
      mintTitle: ''
    }
  },
  mounted () {
    const $self = this
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    this.item.gaiaUsername = profile.username
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: this.item })
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
        } else if (data.opcode === 'save-mint-data') {
          console.log(data.opcode)
        } else if (data.opcode === 'stx-contract-data') {
          $self.showRpay = false
          $self.$bvModal.hide('rpay-modal')
          $self.$bvModal.hide('rpay-modal')
          $self.mintResult = 'Contract called'
          $self.mintResultTxId = data.txId
          $self.$bvModal.show('result-modal')
        } else {
          // $self.$bvModal.hide('rpay-modal')
          // $self.showRpay = false
          // $self.mintResult = data.message
          // $self.mintTitle = 'Not Minted'
          // $self.$bvModal.show('result-modal')
        }
      })
    }
  },
  methods: {
    openSaleDataDialog: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      this.item.saleData = contractAsset.saleData
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'selling-flow', asset: this.item })
      this.showRpay = true
      this.$bvModal.show('rpay-modal')
    },
    mintToken: function () {
      this.$bvModal.show('rpay-modal')
      this.mintTitle = 'Mint: ' + this.item.name
      this.showRpay = true
    },
    downable: function () {
      return this.uploadState > 2
    },
    acceptOffer: function (offer, index) {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
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
    saleDataText () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      if (!contractAsset || !contractAsset.saleData || contractAsset.saleData.saleType === 0) {
        return 'NOT FOR SALE'
      } else if (contractAsset.saleData.saleType === 1) {
        return 'Buy now for ' + utils.fromMicroAmount(contractAsset.saleData.buyNowOrStartingPrice)
      } else if (contractAsset.saleData.saleType === 2) {
        return 'Place a bid current highest bid is ' + utils.fromMicroAmount(contractAsset.saleData.buyNowOrStartingPrice)
      } else if (contractAsset.saleData.saleType === 3) {
        return 'Offers over ' + utils.fromMicroAmount(contractAsset.saleData.reservePrice) + ' STX will be considered'
      } else {
        return 'Unknown sale type?'
      }
    },
    risidioAuctionsUrl () {
      if (this.item && this.item.nftIndex && typeof this.item.nftIndex === 'number' && this.item.nftIndex >= 0) {
        return RISIDIO_ASSET_URL + this.item.assetHash
      }
      return null
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

</style>
