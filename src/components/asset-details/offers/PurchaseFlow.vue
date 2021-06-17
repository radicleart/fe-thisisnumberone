<template>
<div v-if="!loading">
  <div v-if="flowType === 1">
    <purchase-offer-login :offerData="offerData" @registerByEmail="registerByEmail" @registerByConnect="registerByConnect" @backStep="backStep"/>
  </div>
  <div v-else-if="flowType === 2">
    <purchase-offer-success :offerData="offerData" :contentKey="contentKey"/>
  </div>
  <div v-else-if="flowType === 3">
    <purchase-offer-failure :offerData="offerData"/>
  </div>
  <div v-else>
    <div v-if="contractAsset && forceOfferFlow">
      <purchase-offer-amount :offerData="offerData" v-if="offerStage === 0" @collectEmail="collectEmail"/>
      <purchase-offer-email :offerData="offerData" v-else-if="offerStage === 1" @backStep="backStep" @setEmail="setEmail"/>
      <div class="text-danger" v-html="errorMessage"></div>
    </div>
    <div v-else>
      <div v-if="contractAsset && contractAsset.saleData.saleType === 1">
        <purchase-buy-now :contractAsset="contractAsset" :saleData="contractAsset.saleData" @buyNow="buyNow"/>
        <div class="text-danger" v-html="errorMessage"></div>
      </div>
      <div v-else-if="contractAsset && contractAsset.saleData.saleType === 2">
        <purchase-place-bid :contractAsset="contractAsset" @placeBid="placeBid"/>
        <div class="text-danger" v-html="errorMessage"></div>
      </div>
      <div v-else-if="contractAsset && contractAsset.saleData.saleType === 3">
        <purchase-offer-amount :offerData="offerData" v-if="offerStage === 0" @collectEmail="collectEmail"/>
        <purchase-offer-email :offerData="offerData" v-else-if="offerStage === 1" @backStep="backStep" @setEmail="setEmail"/>
        <div class="text-danger" v-html="errorMessage"></div>
      </div>
      <div v-else>
        Asset not on sale.
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PurchaseBuyNow from './PurchaseBuyNow'
import PurchaseOfferLogin from './PurchaseOfferLogin'
import PurchaseOfferAmount from './PurchaseOfferAmount'
import PurchasePlaceBid from './PurchasePlaceBid'
import PurchaseOfferEmail from './PurchaseOfferEmail'
import PurchaseOfferSuccess from './PurchaseOfferSuccess'
import PurchaseOfferFailure from './PurchaseOfferFailure'
import moment from 'moment'
import {
  makeContractSTXPostCondition,
  makeStandardSTXPostCondition,
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
    PurchaseOfferSuccess,
    PurchaseOfferFailure,
    PurchaseOfferEmail,
    PurchaseOfferLogin,
    PurchaseBuyNow,
    PurchasePlaceBid
  },
  props: ['gaiaAsset', 'forceOfferFlow'],
  data () {
    return {
      errorMessage: null,
      loading: true,
      offerStage: 0,
      offerData: {},
      biddingData: {},
      biddingEndTime: null,
      flowType: 0,
      contentKey: null,
      webWalletNeeded: false
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
      this.setOfferData()
      this.setBiddingData()
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
      const offer = this.$store.getters[APP_CONSTANTS.KEY_HIGHEST_OFFER_ON_ASSET](contractAsset.tokenInfo.assetHash)
      this.offerData.minimumOffer = (contractAsset.saleData.reservePrice)
      if (offer && offer.amount) {
        this.offerData.minimumOffer = Math.max(offer.amount, (contractAsset.saleData.reservePrice))
      }
      this.offerData.fbet = this.getFormattedBiddingEndTime(contractAsset)
      this.offerData.offerAmount = this.offerData.minimumOffer
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      const rate = tickerRates.find((o) => o.currency === 'USD')
      this.offerData.amountUsdFmt = 0
      if (this.offerData.minimumOffer) {
        const amountUsd = Number(utils.toDecimals(rate.stxPrice * this.offerData.minimumOffer)).toLocaleString()
        this.offerData.amountUsdFmt = amountUsd
      }
    },
    getFormattedBiddingEndTime: function (contractAsset) {
      return this.$store.getters[APP_CONSTANTS.KEY_FORMATTED_BIDDING_END_TIME](contractAsset)
    },
    backStep: function () {
      this.offerStage = 0
      this.flowType = 0
    },
    collectEmail: function (data) {
      Object.assign(this.offerData, data)
      this.offerStage = 1
    },
    setEmail: function (data) {
      this.offerData.email = data.email
      // const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      this.flowType = 1
      /**
      if (!profile.loggedIn) {
        this.flowType = 1
      } else {
        this.makeOffer()
      }
      **/
    },
    registerByEmail: function () {
      this.offerData.registerByEmail = true
      this.registerOfferOffChain(1)
    },
    registerByConnect: function () {
      this.offerData.registerByEmail = false
      this.makeOffer()
    },
    emailText () {
      const emailText = this.$store.getters[APP_CONSTANTS.KEY_EMAIL_TEXT]('offeremail')
      const answer = (emailText) ? emailText[0].text.replaceAll('amount_stx', this.offerData.offerAmount) : 'Offer Registered'
      return answer
    },
    registerOfferOffChain: function (status) {
      this.flowType = 2
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const data = {
        emailContent: this.emailText(),
        status: status,
        domain: location.host,
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        assetHash: contractAsset.tokenInfo.assetHash,
        nftIndex: contractAsset.nftIndex,
        amount: this.offerData.offerAmount,
        email: this.offerData.email
      }
      this.$store.dispatch('rpayPurchaseStore/registerOfferOffChain', data).then(() => {
        this.contentKey = 'successful-offer'
        this.flowType = 2
      }).catch(() => {
        this.flowType = 3
      })
    },
    makeOffer: function () {
      this.flowType = 2
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.errorMessage = null
      this.offerData.biddingEndTime = moment(contractAsset.saleData.biddingEndTime).valueOf()
      this.sellingMessage = 'Sending your request to the blockchain... this takes a few minutes to confirm!'
      this.offerData.contractAddress = STX_CONTRACT_ADDRESS
      this.offerData.contractName = STX_CONTRACT_NAME
      this.offerData.nftIndex = contractAsset.nftIndex
      this.offerData.assetHash = contractAsset.tokenInfo.assetHash
      this.$store.dispatch('rpayPurchaseStore/makeOffer', this.offerData).then(() => {
        this.registerOfferOffChain(2)
        this.contentKey = 'successful-offer'
        this.flowType = 2
      }).catch((err) => {
        this.errorMessage = err
        this.flowType = 3
      })
    },
    buyNow: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      const sky = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      let recipient = profile.stxAddress // (contractAsset.owner === mac.keyInfo.address) ? sky.keyInfo.address : mac.keyInfo.address
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$emit('registerByConnect')
        }).catch((err) => {
          console.log(err)
          // https://www.hiro.so/wallet/install-web
          this.webWalletNeeded = true
        })
      }
      const standardSTXPostCondition = makeStandardSTXPostCondition(
        profile.stxAddress,
        FungibleConditionCode.LessEqual,
        new BigNum(utils.toOnChainAmount(contractAsset.saleData.buyNowOrStartingPrice))
      )

      if (NETWORK === 'local') {
        recipient = (contractAsset.owner === mac.keyInfo.address) ? sky.keyInfo.address : mac.keyInfo.address
      }
      const buyNowData = {
        postConditions: [standardSTXPostCondition],
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        sendAsSky: false,
        nftIndex: contractAsset.nftIndex,
        buyNowOrStartingPrice: contractAsset.saleData.buyNowOrStartingPrice,
        owner: contractAsset.owner,
        provider: 'risidio',
        recipient: recipient
      }
      this.$store.dispatch('rpayPurchaseStore/buyNow', buyNowData).then((result) => {
        this.contentKey = 'successful-buy'
        this.flowType = 2
        this.$emit('buySent', result)
      }).catch((err) => {
        this.errorMessage = err
        this.flowType = 3
      })
    },
    isOpeneningBid () {
      // simple case - no bids ever
      if (this.contractAsset.bidCounter === 0 || this.contractAsset.bidHistory.length === 0) {
        return true
      }
      // less simple case - start of a new sale cycle
      const index = this.contractAsset.bidHistory.findIndex((o) => o.saleCycle === this.contractAsset.saleData.saleCycleIndex)
      return index === -1
    },
    placeBid: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const nextBid = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](contractAsset)
      this.errorMessage = null
      let functionName = 'place-bid'
      let bidAmount = nextBid.amount
      if (this.isOpeneningBid()) {
        functionName = 'opening-bid'
        bidAmount = contractAsset.saleData.buyNowOrStartingPrice
      }
      const standardSTXPostCondition = makeContractSTXPostCondition(
        STX_CONTRACT_ADDRESS,
        STX_CONTRACT_NAME,
        FungibleConditionCode.Equal,
        new BigNum(utils.toOnChainAmount(bidAmount))
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
        bidAmount: new BigNum(utils.toOnChainAmount(bidAmount))
      }
      this.$store.dispatch('rpayPurchaseStore/placeBid', bidData).then((result) => {
        this.contentKey = 'successful-bid'
        this.flowType = 2
        this.$emit('bidSent', result)
      }).catch((err) => {
        this.errorMessage = err
        this.flowType = 3
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
