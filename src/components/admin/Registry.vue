<template>
<div v-if="!registry">
  <p>No applciation registry detected - are the contracts deployed?</p>
</div>
<div v-else>
<div class="upload-preview bg-info text-white  my-5 p-4" v-if="registry">
  <div class="row border-bottom mb-3 pb-2">
    <div class="col-12"><h3>Environment Variables</h3></div>
    <div class="col-md-2">RISIDIO_API</div><div class="col-md-10">{{RISIDIO_API}}</div>
    <div class="col-md-2">STACKS_CONTRACT_ADDRESS</div><div class="col-md-10">{{STACKS_CONTRACT_ADDRESS}}</div>
    <div class="col-md-2">STACKS_CONTsRACT_NAME</div><div class="col-md-10">{{STACKS_CONTRACT_NAME}}</div>
    <div class="col-md-2">Mac</div><div class="col-md-10">{{mac}}</div>
    <div class="col-md-2">Sky</div><div class="col-md-10">{{sky}}</div>
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
        <div class="row ml-4 py-5 border-top" v-for="(token, index) in application.tokenContract.tokens" :key="index">
          <div class="col-2">NFT</div><div class="col-10">#{{token.nftIndex}}</div>
          <div class="col-2">Edition</div><div class="col-10">{{token.tokenInfo.edition}} / {{token.tokenInfo.maxEditions}}</div>
          <div class="col-2">SHA(256)</div><div class="col-10">{{token.tokenInfo.assetHash}}</div>
          <div class="col-2">Owner</div><div class="col-10">{{token.owner}}</div>
          <div class="col-2">Sale Data</div><div class="col-10">Type={{token.saleData.saleType}}, Amount={{token.saleData.buyNowOrStartingPrice}} Reserve={{token.saleData.reservePrice}} Increment={{token.saleData.incrementPrice}}</div>
          <div class="col-2">End time</div><div class="col-10">{{formatDate(token.saleData.biddingEndTime)}}</div>
          <div class="col-2">Block-height</div><div class="col-10">{{token.tokenInfo.date}}</div>
          <div class="col-2">Original</div><div class="col-10">{{token.tokenInfo.seriesOriginal}}</div>
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
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const sky = JSON.parse(process.env.VUE_APP_WALLET_SKY || '')

export default {
  name: 'Registry',
  components: {
  },
  data () {
    return {
      mac: mac,
      sky: sky,
      STACKS_CONTRACT_ADDRESS: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      STACKS_CONTRACT_NAME: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      RISIDIO_API: process.env.VUE_APP_RISIDIO_API
    }
  },
  methods: {
    formatDate: function (date) {
      const loaclEndM = moment(date)
      return loaclEndM.format('DD-MM-YY hh:mm')
    }
  },
  computed: {
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      if (!registry) return {}
      return registry
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
