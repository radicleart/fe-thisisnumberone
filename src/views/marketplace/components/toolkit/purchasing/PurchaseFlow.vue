<template>
<div v-if="!loading">
  <div v-if="flowType === 1">
    <PurchaseOfferLogin :offerData="offerData" @registerByEmail="registerByEmail" @registerByConnect="registerByConnect" @backStep="backStep"/>
  </div>
  <div v-else>
    <div>
      <div v-if="contractAsset && contractAsset.saleData.saleType === 1">
        <PurchaseBuyNow :contractAsset="contractAsset" :saleData="contractAsset.saleData" @buyNow="buyNow"/>
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

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'PurchaseFlow',
  components: {
    PurchaseOfferLogin,
    PurchaseBuyNow
  },
  props: ['gaiaAsset', 'forceOfferFlow', 'loopRun'],
  data () {
    return {
      errorMessage: null,
      loading: true,
      offerStage: 0,
      offerData: {},
      biddingData: {},
      biddingEndTime: null,
      flowType: 0,
      webWalletNeeded: false
    }
  },
  mounted () {
    this.errorMessage = null
    this.$store.dispatch('rpayStacksStore/fetchMacSkyWalletInfo').then(() => {
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    buyNow: function () {
      const contractAsset = this.gaiaAsset.contractAsset
      // const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      // const sky = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const recipient = profile.stxAddress // (contractAsset.owner === mac.keyInfo.address) ? sky.keyInfo.address : mac.keyInfo.address
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { stxAddress: profile.stxAddress }, { root: true })
          this.$emit('registerByConnect')
        }).catch((err) => {
          console.log(err)
          // https://www.hiro.so/wallet/install-web
          this.webWalletNeeded = true
        })
      }
      const buyNowData = {
        // postConditions: postConds,
        contractAddress: (this.loopRun) ? this.loopRun.contractId.split('.')[0] : STX_CONTRACT_ADDRESS,
        contractName: (this.loopRun) ? this.loopRun.contractId.split('.')[1] : STX_CONTRACT_NAME,
        sendAsSky: false,
        nftIndex: contractAsset.nftIndex,
        buyNowOrStartingPrice: contractAsset.saleData.buyNowOrStartingPrice,
        owner: contractAsset.owner,
        provider: 'risidio',
        recipient: recipient
      }
      this.$store.dispatch('rpayPurchaseStore/buyNow', buyNowData).then(() => {
        this.flowType = 2
      }).catch((err) => {
        this.errorMessage = err
        this.flowType = 3
      })
    },
    minted () {
      const contractAsset = this.gaiaAsset.contractAsset
      if (!contractAsset) return
      return contractAsset.nftIndex > -1
    }
  },
  computed: {
    contractAsset () {
      return this.gaiaAsset.contractAsset
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
