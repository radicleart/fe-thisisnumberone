<template>
<div class="p-2">
  <div class="row ml-4 mt-3 border-bottom mb-3 pb-2" v-for="(gaiaAsset, index) in getGaiaAssets" :key="index">
    <div class="col-2 my-2">
      <div><img width="70px" :src="gaiaAsset.image"/></div>
    </div>
    <div class="col-10 my-2">
      <div>{{gaiaAsset.name}}</div>
      <div>[#{{gaiaAsset.contractAsset.nftIndex}}] : Edition {{gaiaAsset.contractAsset.tokenInfo.edition}} / {{gaiaAsset.contractAsset.tokenInfo.maxEditions}} / {{gaiaAsset.contractAsset.tokenInfo.editionCost}}</div>
      <div>Uploaded by:     {{gaiaAsset.contractAsset.owner}}</div>
      <div>metaDataUrl:       {{gaiaAsset.contractAsset.tokenInfo.metaDataUrl}}</div>
      <div class="text-info">
        <a class="text-info pr-3 mr-3 border-right" href="#" @click.prevent="transferAsset(gaiaAsset.contractAsset.nftIndex)">transfer</a>
        <a class="text-info pr-3 mr-3 border-right" href="#" @click.prevent="mintNextEdition(gaiaAsset.assetHash, gaiaAsset.contractAsset.nftIndex)">mint edition {{gaiaAsset.contractAsset.editionCounter}}</a>
        <a class="text-info pr-3 mr-3 border-right" href="#" @click.prevent="confirmBuyNow(gaiaAsset.assetHash, gaiaAsset.contractAsset.owner)">buy now</a>
        <a class="text-info pr-3 mr-3" href="#" @click.prevent="placeBid(gaiaAsset.assetHash, gaiaAsset.contractAsset.nftIndex)">place bid</a>
      </div>
    </div>
    <div class="row mt-3">
    <div class="col-2">NFT</div><div class="col-10">#{{gaiaAsset.contractAsset.nftIndex}}</div>
    <div class="col-2">Hash</div><div class="col-10">{{gaiaAsset.assetHash}}</div>
    <div class="col-2">Meta Data Url</div><div class="col-10">{{gaiaAsset.contractAsset.tokenInfo.metaDataUrl}}</div>
    <div class="col-2">Owner</div><div class="col-10">{{gaiaAsset.contractAsset.owner}} </div>
    <div class="col-2">SaleData</div><div class="col-10">Type: {{gaiaAsset.contractAsset.saleData.saleType}}, Cycle {{gaiaAsset.contractAsset.saleData.saleCycleIndex}}, Amount: {{gaiaAsset.contractAsset.saleData.buyNowOrStartingPrice}} Reserve: {{gaiaAsset.contractAsset.saleData.reservePrice}}, Increment: {{gaiaAsset.contractAsset.saleData.incrementPrice}} Ends: {{gaiaAsset.contractAsset.saleData.biddingEndTime}}</div>
    <div class="col-2">Edition</div><div class="col-10">{{gaiaAsset.contractAsset.tokenInfo.edition}} / {{gaiaAsset.contractAsset.tokenInfo.maxEditions}} / {{gaiaAsset.contractAsset.tokenInfo.editionCost}}</div>
    <div class="col-2">Block-height</div><div class="col-10">{{gaiaAsset.contractAsset.tokenInfo.date}}</div>
    <div class="col-2">Original</div><div class="col-10">{{gaiaAsset.contractAsset.tokenInfo.seriesOriginal}}</div>
    <!-- <div class="col-2">Beneficiaries</div><div class="col-10">{{gaiaAsset.contractAsset.beneficiaries}}</div> -->
    <div class="col-2">Royalties:</div>
    <div class="col-10" v-if="gaiaAsset.contractAsset.beneficiaries">
      <div class="row" v-for="(beneficiary, index) in gaiaAsset.contractAsset.beneficiaries" :key="index">
        <div class="col-2">{{beneficiary.username}}</div>
        <div class="col-2">{{beneficiary.royalty}}</div>
        <div class="col-8">{{beneficiary.chainAddress}}</div>
      </div>
    </div>
    <div class="col-2">Bids</div><div class="col-10">{{gaiaAsset.contractAsset.bidCounter}}</div>
    <div class="col-2">Current High</div><div class="col-10">{{currentBid(gaiaAsset.contractAsset)}}</div>
    <div class="col-2">Next Bid</div><div class="col-10">{{nextBid(gaiaAsset.contractAsset)}}</div>
    <div class="col-2">Info</div><div class="col-10">{{sellingInfo(gaiaAsset.contractAsset)}}</div>
    <div class="col-2"></div>
    <div class="col-10 my-2">
      <div class="row bg-dark text-white p-2 mr-3" v-for="(bid, index1) in gaiaAsset.contractAsset.bidHistory" :key="index1">
        <div class="col-2">Amount</div><div class="col-10">{{bid.amount}}</div>
        <div class="col-2">Bidder</div><div class="col-10">{{bid.bidder}}</div>
        <div class="col-2">Placed</div><div class="col-10">{{formatDate(bid.whenBid)}}</div>
        <div class="col-2">Cycle</div><div class="col-10">{{bid.saleCycle}}</div>
      </div>
    </div>
    <div class="col-2">Offers</div>
    <div class="col-10">{{gaiaAsset.contractAsset.offerCounter}}</div>
    <div class="col-2"></div>
    <div class="col-10">
      <div v-for="(offer, index1) in gaiaAsset.contractAsset.offerHistory" :key="index1">
        <div>Amount: {{offer.amount}} Made: {{offer.amount}}  Cycle: {{offer.saleCycle}} Offerer: {{offer.offerer}}</div>
        <div><a href="#" @click.prevent="acceptOffer(offer, index1)">accept</a></div>
      </div>
    </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import utils from '@/services/utils'

export default {
  name: 'GaiaAssetCache',
  components: {
  },
  data () {
    return {
      nifty: 0,
      contractBalance: -1,
      loaded: false,
      message: null,
      result: null,
      globalEvent: null,
      resultApp: null,
      authorisations: null,
      authorisation: null
    }
  },
  methods: {
    b32Address: function (stxAddress) {
      const b32Address = utils.convertAddressFrom(stxAddress)
      return b32Address[0] + ' : ' + b32Address[1]
    },
    formatDate: function (date) {
      const loaclEndM = moment(date)
      return loaclEndM.format('DD-MM-YY hh:mm')
    },
    confirmBuyNow (assetHash, owner) {
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](assetHash)
      const data = {
        sendAsSky: (owner === 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW'),
        contractAddress: networkConfig.contractAddress,
        contractName: networkConfig.contractName,
        nftIndex: contractAsset.nftIndex,
        owner: owner,
        amount: contractAsset.saleData.buyNowOrStartingPrice,
        recipient: (owner === 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG') ? 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' : 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      this.$store.dispatch('rpayPurchaseStore/buyNow', data).then((result) => {
        this.result = result
      }).catch((error) => {
        this.result = error
      })
    },
    placeBid (assetHash, owner) {
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](assetHash)
      const data = {
        sendAsSky: (owner === 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW'),
        contractAddress: networkConfig.contractAddress,
        contractName: networkConfig.contractName,
        nftIndex: contractAsset.nftIndex,
        owner: owner,
        amount: contractAsset.saleData.buyNowOrStartingPrice,
        recipient: (owner === 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG') ? 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' : 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      this.$store.dispatch('rpayPurchaseStore/buyNow', data).then((result) => {
        this.result = result
      }).catch((error) => {
        this.result = error
      })
    },
    mintNextEdition (assetHash) {
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](assetHash)
      const data = {
        methos: 'rpayStacksStore/callContractBlockstack',
        editionCost: 30,
        owner: contractAsset.owner,
        contractAddress: networkConfig.contractAddress,
        contractName: networkConfig.contractName,
        nftIndex: contractAsset.nftIndex,
        buyNowOrStartingPrice: contractAsset.saleData.buyNowOrStartingPrice
      }
      this.$store.dispatch('rpayPurchaseStore/mintEdition', data).then((result) => {
        this.result = result
      }).catch((error) => {
        this.result = error
      })
    },
    transferAsset: function (index, owner) {
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      const data = {
        contractAddress: networkConfig.contractAddress,
        contractName: networkConfig.contractName,
        nftIndex: index,
        owner: owner,
        recipient: (owner === 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG') ? 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' : 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      return this.$store.dispatch('rpayPurchaseStore/transferAsset', data).then((result) => {
        this.result = result
      })
    },
    acceptOffer: function (offer, index) {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](configuration.gaiaAsset.assetHash)
      const offerData = {
        contractAddress: networkConfig.contractAddress,
        contractName: networkConfig.contractName,
        sendAsSky: true,
        owner: contractAsset.owner,
        recipient: offer.offerer,
        offerIndex: index,
        nftIndex: contractAsset.nftIndex
      }
      return this.$store.dispatch('rpayPurchaseStore/acceptOffer', offerData).then((result) => {
        this.result = result
      })
    },
    nextBid (token) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_NEXT_BID](token)
      return gaiaAsset
    },
    currentBid (token) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_BIDDING_CURRENT_BID](token)
      return gaiaAsset
    },
    sellingInfo (token) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_SALES_INFO_TEXT](token)
      return gaiaAsset
    }
  },
  computed: {
    getGaiaAssets () {
      const gaiaAssets = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      return gaiaAssets
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
