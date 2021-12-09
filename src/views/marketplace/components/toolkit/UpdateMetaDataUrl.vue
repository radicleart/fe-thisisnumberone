<template>
<div  class="mt-5">
  <div v-if="gaiaLocation1 === gaiaLocation2">
      <div class="col-12">Meta data url for this asset</div>
      <b-row class="text-small">
        <b-col cols="1">JSON:</b-col>
        <b-col cols="11"><span><a class="text-warning" :href="gaiaLocation1" target="_blank">{{gaiaLocation1}}</a></span></b-col>
      </b-row>
  </div>
  <div v-else>
    <div class="row mb-4">
      <div class="col-12">Update the meta data url for this asset</div>
    </div>
    <b-row class="text-small">
      <b-col cols="1">From</b-col>
      <b-col cols="11"><span><a class="text-warning" :href="gaiaLocation1" target="_blank">{{gaiaLocation1}}</a></span></b-col>
      <b-col cols="1">To</b-col>
      <b-col cols="11"><span><a class="text-warning" :href="gaiaLocation2" target="_blank">{{gaiaLocation2}}</a></span></b-col>
    </b-row>
    <b-row class="text-small mt-4">
      <b-col cols="12" class="col-12" v-if="!transferring">
        <b-button variant="outline-warning" style="width: 170px;" @click="updateMetaDataUrl()">Update</b-button>
      </b-col>
      <b-col cols="12" class="col-12" v-else>
        <div class="col-12"><a :href="trackingUrl" target="_blank">track progress here...</a></div>
      </b-col>
    </b-row>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'UpdateMetaDataUrl',
  components: {
  },
  props: ['item', 'loopRun'],
  data: function () {
    return {
      gaiaLocation1: null,
      gaiaLocation2: null,
      errorMessage: null,
      network: NETWORK,
      result: {},
      transferring: false
    }
  },
  mounted () {
    const item = this.item
    this.gaiaLocation1 = item.contractAsset.tokenInfo.metaDataUrl
    let assetPath = item.assetHash + '.json'
    if (this.loopRun.type === 'punks') {
      assetPath = item.attributes.collection + '/' + item.attributes.index + '.json'
    } else if (item.attributes.collection) {
      assetPath = item.attributes.collection + '/' + item.assetHash + '.json'
    }
    this.gaiaLocation2 = this.profile.gaiaHubConfig.url_prefix + this.profile.gaiaHubConfig.address + '/' + assetPath
  },
  methods: {
    updateMetaDataUrl: function () {
      this.transferring = 'update started...'
      this.item.cryptoPunk = this.loopRun.type === 'punks'
      this.$store.dispatch('rpayMyItemStore/saveItem', this.item).then((item) => {
        this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
        this.$notify({ type: 'success', title: 'Save Data', text: 'Meta data saved to gaia!' })
        const contractAsset = item.contractAsset
        const data = {
          contractAddress: this.loopRun.contractId.split('.')[0],
          contractName: this.loopRun.contractId.split('.')[1],
          nftIndex: contractAsset.nftIndex,
          metaDataUrl: this.gaiaLocation2,
          sendAsSky: true
        }
        return this.$store.dispatch('rpayPurchaseStore/updateMetaDataUrl', data).then((result) => {
          this.transferring = null
          this.result = result
        }).catch((err) => {
          this.transferring = err
        })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Save Error', text: 'Error save meta data file to gaia!' })
      })
    }
  },
  computed: {
    ttTransfers () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-transfers')
      return (tooltip) ? tooltip[0].text : ''
    },
    showTransferButton () {
      return (this.toAddress && this.toAddress.length > 10)
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    trackingUrl () {
      if (!this.result || !this.result.txId) return
      return this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.result.txId)
    }
  }
}
</script>

<style>
#toAddress {
  font-size: 1.0rem !important;
}
</style>
