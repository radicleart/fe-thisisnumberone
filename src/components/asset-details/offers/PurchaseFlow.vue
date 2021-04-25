<template>
<div v-if="!loading">
  <div v-if="contractAsset">
    <div v-if="contractAsset.saleData.saleType === 1">
      <purchase-buy-now :offerData="offerData" :saleData="contractAsset.saleData" @buyNow="buyNow"/>
      <div class="text-danger" v-html="errorMessage"></div>
    </div>
    <div v-if="contractAsset.saleData.saleType === 2">
      <purchase-place-bid :offerData="offerData" :saleData="contractAsset.saleData" @placeBid="placeBid"/>
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

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

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
      biddingEndTime: null
    }
  },
  mounted () {
    this.errorMessage = null
    this.$store.commit('rpayCategoryStore/setModalMessage', '')
    this.$store.dispatch('rpayStacksStore/fetchMacSkyWalletInfo').then(() => {
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.setLocalSaleData()
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
    setLocalSaleData: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.minimumOffer = (contractAsset.saleData.reservePrice)
      this.offerData.minimumOffer = this.minimumOffer
      if (!this.offerData.offerAmount) {
        this.offerData.offerAmount = this.minimumOffer
      }
      if (contractAsset.saleData && contractAsset.saleData.biddingEndTime) {
        let loaclEndM = moment(contractAsset.saleData.biddingEndTime)
        if (loaclEndM.isBefore(moment({}))) {
          loaclEndM = moment({}).add(2, 'days')
        }
        const loaclEnd = loaclEndM.format('DD-MM-YY')
        this.offerData.biddingEndTime = loaclEnd
      } else {
        const dd = moment({}).add(2, 'days')
        dd.hour(10)
        dd.minute(0)
        this.offerData.biddingEndTime = dd.format()
      }
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

      this.$store.dispatch('rpayStacksStore/makeOffer', this.offerData).then((data) => {
        this.$emit('offerSent', data)
      }).catch((err) => {
        this.errorMessage = err
      })
    },
    buyNow: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      const recipient = this.$store.getters[APP_CONSTANTS.KEY_RECIPIENT](contractAsset.owner)
      const buyNowData = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        sendAsSky: true,
        nftIndex: contractAsset.nftIndex,
        amount: contractAsset.saleData.buyNowOrStartingPrice,
        owner: contractAsset.owner,
        recipient: recipient
      }
      this.$store.dispatch('rpayStacksStore/buyNow', buyNowData).then(() => {
        // this.$emit('offerSent', data)
      }).catch((err) => {
        this.errorMessage = err
      })
    },
    placeBid: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAsset.assetHash)
      this.errorMessage = null
      this.offerData.biddingEndTime = moment(contractAsset.saleData.biddingEndTime).valueOf()
      this.sellingMessage = 'Sending your request to the blockchain... this takes a few minutes to confirm!'
      this.offerData.contractAddress = STX_CONTRACT_ADDRESS
      this.offerData.contractName = STX_CONTRACT_NAME
      this.offerData.nftIndex = contractAsset.nftIndex
      this.offerData.assetHash = contractAsset.tokenInfo.assetHash

      this.$store.dispatch('rpayStacksStore/placeBid', this.offerData).then(() => {
        // this.$emit('offerSent', data)
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
