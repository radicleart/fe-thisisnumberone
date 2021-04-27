<template>
<div v-if="!loading">
  <div v-if="contractAsset">
    <div v-if="contractAsset.saleData.saleType === 1">
      <purchase-buy-now :offerData="offerData" :saleData="contractAsset.saleData" @buyNow="buyNow"/>
      <div class="text-danger" v-html="errorMessage"></div>
    </div>
    <div v-if="contractAsset.saleData.saleType === 2">
      <purchase-place-bid :biddingData="biddingData" :saleData="contractAsset.saleData" @placeBid="placeBid"/>
      <div class="text-danger" v-html="errorMessage"></div>
    </div>
    <div v-if="contractAsset.saleData.saleType === 3">
      <purchase-offer-amount :offerData="offerData" v-if="contractAsset.saleData.saleType === 3 && offerStage === 0" @collectEmail="collectEmail"/>
      <purchase-offer-email :offerData="offerData" v-else-if="contractAsset.saleData.saleType === 3 && offerStage === 1" @backStep="backStep" @makeOffer="makeOffer"/>
      <div class="text-danger" v-html="errorMessage"></div>
    </div>
  </div>
  <div v-else>
    Asset not in contract.
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PurchaseBuyNow from './PurchaseBuyNow'
import PurchaseOfferAmount from './PurchaseOfferAmount'
import PurchasePlaceBid from './PurchasePlaceBid'
import PurchaseOfferEmail from './PurchaseOfferEmail'
import moment from 'moment'
import {
  makeContractSTXPostCondition,
  FungibleConditionCode
} from '@stacks/transactions'
import utils from '@/services/utils'
import BigNum from 'bn.js'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'PurchaseFlow',
  components: {
    PurchaseOfferAmount,
    PurchaseOfferEmail,
    PurchaseBuyNow,
    PurchasePlaceBid
  },
  props: ['gaiaAsset'],
  data () {
    return {
      errorMessage: null,
      loading: true,
      offerStage: 0,
      offerData: {},
      biddingData: {},
      biddingEndTime: null
    }
  },
  mounted () {
    this.errorMessage = null
    this.$store.commit('rpayCategoryStore/setModalMessage', '')
    this.$store.dispatch('rpayStacksStore/fetchMacSkyWalletInfo').then(() => {
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.setOfferData()
      this.setBiddingData()
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
    const $self = this
    window.eventBus.$on('rpayEvent', function (data) {
      if (data.opcode.indexOf('-mint-success') > -1) {
        $self.$store.commit('rpayStore/setDisplayCard', 106)
      }
    })
  },
  methods: {
    setBiddingData () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.biddingData.currentBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](contractAsset)
      this.biddingData.nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](contractAsset)
      this.biddingData.biddingEndTime = contractAsset.saleData.biddingEndTime
      this.biddingData.fbet = this.getFormattedBiddingEndTime(contractAsset)
    },
    setOfferData: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.minimumOffer = (contractAsset.saleData.reservePrice)
      this.offerData.minimumOffer = this.minimumOffer
      this.offerData.fbet = this.getFormattedBiddingEndTime(contractAsset)
      if (!this.offerData.offerAmount) {
        this.offerData.offerAmount = this.minimumOffer
      }
    },
    getFormattedBiddingEndTime: function (contractAsset) {
      return this.$store.getters[APP_CONSTANTS.KEY_FORMATTED_BIDDING_END_TIME](contractAsset)
    },
    backStep: function () {
      this.offerStage = 0
    },
    collectEmail: function (data) {
      Object.assign(this.offerData, data)
      this.offerStage = 1
    },
    makeOffer: function (data) {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.errorMessage = null
      this.offerData.biddingEndTime = moment(contractAsset.saleData.biddingEndTime).valueOf()
      this.offerData.email = data.email
      this.sellingMessage = 'Sending your request to the blockchain... this takes a few minutes to confirm!'
      this.offerData.contractAddress = STX_CONTRACT_ADDRESS
      this.offerData.contractName = STX_CONTRACT_NAME
      this.offerData.nftIndex = contractAsset.nftIndex
      this.offerData.assetHash = contractAsset.tokenInfo.assetHash

      this.$store.dispatch('rpayPurchaseStore/makeOffer', this.offerData).then((data) => {
        this.$emit('offerSent', data)
      }).catch((err) => {
        this.errorMessage = err
      })
    },
    buyNow: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      const sky = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      let recipient = profile.stxAddress

      if (NETWORK === 'local') {
        recipient = (contractAsset.owner === mac.keyInfo.address) ? sky.keyInfo.address : mac.keyInfo.address
      }
      const buyNowData = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        sendAsSky: true,
        nftIndex: contractAsset.nftIndex,
        amount: contractAsset.saleData.buyNowOrStartingPrice,
        owner: contractAsset.owner,
        provider: 'risidio',
        recipient: recipient
      }
      this.$store.dispatch('rpayPurchaseStore/buyNow', buyNowData).then((result) => {
        this.$emit('buySent', result)
      }).catch((err) => {
        this.errorMessage = err
      })
    },
    placeBid: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](contractAsset)
      this.errorMessage = null
      let functionName = 'place-bid'
      let bidAmount = new BigNum(utils.toOnChainAmount(nextBid.amount))
      if (contractAsset.bidCounter === 0) {
        functionName = 'opening-bid'
        bidAmount = new BigNum(utils.toOnChainAmount(contractAsset.saleData.buyNowOrStartingPrice))
      }
      const standardSTXPostCondition = makeContractSTXPostCondition(
        STX_CONTRACT_ADDRESS,
        STX_CONTRACT_NAME,
        FungibleConditionCode.LessEqual,
        bidAmount
      )
      const bidData = {
        postConditions: [standardSTXPostCondition],
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        functionName: functionName,
        sendAsSky: true,
        nftIndex: contractAsset.nftIndex,
        assetHash: contractAsset.tokenInfo.assetHash,
        appTimestamp: moment({}).valueOf(),
        bidAmount: bidAmount
      }
      this.$store.dispatch('rpayPurchaseStore/placeBid', bidData).then((result) => {
        this.$emit('bidSent', result)
      }).catch((err) => {
        this.errorMessage = err
      })
    },
    minted () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      if (!contractAsset) return
      return contractAsset.nftIndex > -1
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      return contractAsset
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
