<template>
<div v-if="!registry">
  <p>No applciation registry detected - are the contracts deployed?</p>
</div>
<div v-else>
<div class="upload-preview bg-info text-white  my-5 p-4" v-if="registry">
  <div class="row mb-5 pb-2">
    <div class="col-12"><h3>Environment Variables</h3></div>
    <div class="col-2">RISIDIO_API</div><div class="col-10">{{RISIDIO_API}}</div>
    <div class="col-2">Address</div><div class="col-10">{{STACKS_CONTRACT_ADDRESS}}</div>
    <div class="col-2">Name</div><div class="col-10">{{STACKS_CONTRACT_NAME}}</div>
  </div>
  <div class="row mb-3">
    <div class="col-2"><b>Mac Wallet</b></div><div class="col-10"></div>
    <div class="col-2">address</div><div class="col-10">{{mac.keyInfo.address}}</div>
    <div class="col-2">nonce</div><div class="col-10">{{mac.nonce}}</div>
    <div class="col-2">balance</div><div class="col-10">{{mac.balance}}</div>
  </div>
  <div class="row">
    <div class="col-2"><b>Sky Wallet</b></div><div class="col-10"></div>
    <div class="col-2">address</div><div class="col-10">{{sky.keyInfo.address}}</div>
    <div class="col-2">nonce</div><div class="col-10">{{sky.nonce}}</div>
    <div class="col-2">balance</div><div class="col-10">{{sky.balance}}</div>
  </div>
</div>
<div class="upload-preview bg-info text-white my-5 p-4" v-if="registry">
  <div class="row border-bottom mb-3 pb-2">
    <div class="col-12"><h3>Contract Data</h3></div>
    <div class="col-2">Administrator</div><div class="col-10">{{registry.administrator}}</div>
    <div class="col-2">Apps Connected</div><div class="col-10">{{registry.appCounter}}</div>
  </div>
  <div class="row border-bottom" v-for="(application, index) in registry.applications" :key="index">
    <div class="col-2">Contract Id</div><div class="col-10">{{application.contractId}}</div>
    <div class="col-2">Owner</div><div class="col-10">{{application.owner}}</div>
    <div class="col-2">App Index</div><div class="col-10">{{application.appIndex}}</div>
    <div class="col-2">Gaia File</div><div class="col-10">{{application.gaiaFilename}}</div>
    <div class="col-2">App origin</div><div class="col-10">{{application.appOrigin}}</div>
    <div class="col-2">Storage</div><div class="col-10">{{application.storageModel}}</div>
    <div class="col-2">Status</div><div class="col-10">{{application.status}}</div>
      <div class="row mx-5 my-5" v-if="application.tokenContract">
        <div class="col-2">Token Contract</div><div class="col-10 text-bold">{{application.tokenContract.tokenSymbol}} - {{application.tokenContract.tokenName}}</div>
        <div class="col-2">Base URL</div><div class="col-10">{{application.tokenContract.baseTokenUri}}</div>
        <div class="col-2">administrator</div><div class="col-10">{{application.tokenContract.administrator}}</div>
        <div class="col-2">Platform Fee</div><div class="col-10">{{application.tokenContract.platformFee}}</div>
        <div class="col-2">Mint Fee</div><div class="col-10">{{application.tokenContract.mintCounter}}</div>
        <div class="ml-4 py-5 border-top" v-for="(token, index) in application.tokenContract.tokens" :key="index">
          <div class="row" v-if="gaiaAsset(token.tokenInfo.assetHash)">
            <div class="col-2 my-4"><div><img width="70px" :src="gaiaAsset(token.tokenInfo.assetHash).imageUrl"/></div></div>
            <div class="col-10 my-4">
              <div>{{gaiaAsset(token.tokenInfo.assetHash).name}}</div>
              <div>[#{{token.nftIndex}}] : Edition {{token.tokenInfo.edition}} / {{token.tokenInfo.maxEditions}} / {{token.tokenInfo.editionCost}}</div>
              <div>Uploaded by:     {{gaiaAsset(token.tokenInfo.assetHash).owner}}</div>
              <div>Gaia user:       {{token.tokenInfo.gaiaUsername}}</div>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col-2 my-4"><div>No Gaia Record?</div></div>
            <div class="col-10 my-4">
              <div>{{token.tokenInfo.assetHash}}</div>
              <div>[#{{token.nftIndex}}] : Edition {{token.tokenInfo.edition}} / {{token.tokenInfo.maxEditions}} / {{token.tokenInfo.editionCost}}</div>
              <div>Uploaded by:     {{token.owner}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">SHA(256)</div><div class="col-10">{{token.tokenInfo.assetHash}}</div>
            <div class="col-2">Owner</div><div class="col-10">{{token.owner}}</div>
            <div class="col-2">Sale Data</div><div class="col-10">Type={{token.saleData.saleType}} Cycle={{token.saleData.saleCycleIndex}}, Amount={{token.saleData.buyNowOrStartingPrice}} Reserve={{token.saleData.reservePrice}} Increment={{token.saleData.incrementPrice}}</div>
            <div class="col-2">End time</div><div class="col-10">{{formatDate(token.saleData.biddingEndTime)}}</div>
            <div class="col-2">Block-height</div><div class="col-10">{{token.tokenInfo.date}}</div>
            <div class="col-2">Transfer Count</div><div class="col-10">{{token.transferCounter}}</div>
            <div class="col-2">Transfer History</div><div class="col-10">{{token.transferHistory}}</div>
            <div class="col-2">Original</div><div class="col-10">{{token.tokenInfo.seriesOriginal}}</div>
            <div class="col-2">Royalties:</div>
            <div class="col-10">
              <div class="row" v-for="(beneficiary, index) in token.beneficiaries" :key="index">
                <div class="col-2">{{beneficiary.username}}</div>
                <div class="col-2">{{beneficiary.royalty}}</div>
                <div class="col-8">{{beneficiary.chainAddress}}</div>
              </div>
            </div>
            <div class="col-2">Bids</div><div class="col-10">{{token.bidCounter}}</div>
            <div class="col-2"></div>
            <div class="col-10">
              <div class="row bg-dark p-2 my-3" v-for="(bid, index1) in token.bidHistory" :key="index1">
                <div class="col-2">Amount</div><div class="col-10">{{bid.amount}}</div>
                <div class="col-2">Bidder</div><div class="col-10">{{bid.bidder}}</div>
                <div class="col-2">Placed</div><div class="col-10">{{formatDate(bid.whenBid)}}</div>
                <div class="col-2">Cycle</div><div class="col-10">{{bid.saleCycle}}</div>
              </div>
            </div>
            <div class="col-2">Offers</div><div class="col-10">{{token.offerCounter}}</div>
            <div class="col-2"></div>
            <div class="col-10">
              <div v-for="(offer, index1) in token.offerHistory" :key="index1">
                <div>{{offer.amount}}</div>
                <div>{{offer.offerer}}</div>
                <div>{{offer.saleCycle}}</div>
                <div>{{formatDate(offer.madeDate)}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'Registry',
  components: {
  },
  data () {
    return {
      STACKS_CONTRACT_ADDRESS: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      STACKS_CONTRACT_NAME: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      RISIDIO_API: process.env.VUE_APP_RISIDIO_API
    }
  },
  methods: {
    formatDate: function (date) {
      const loaclEndM = moment(date)
      return loaclEndM.format('DD-MM-YY hh:mm')
    },
    gaiaAsset (hash) {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](hash)
      return gaiaAsset
    }
  },
  computed: {
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      if (!registry) return {}
      return registry
    },
    sky () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      if (!mac) {
        return {
          keyInfo: {}
        }
      }
      return mac
    },
    mac () {
      const sky = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      if (!sky) {
        return {
          keyInfo: {}
        }
      }
      return sky
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-preview {
  padding: 10px;
  height: auto;
  border: 0pt dashed rgb(146, 146, 38);
  background-color: #FCFCFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 9px #00000029;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: normal;
}
</style>
