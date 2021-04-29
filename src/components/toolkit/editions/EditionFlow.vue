<template>
<div v-if="myDialog">
  <b-row>
    <b-col cols="12">
      <h1>Mint Next Edition</h1>
    </b-col>
  </b-row>
  <b-row class="row text-left mt-2">
    <b-col md="4" sm="12">
      <p v-if="myDialog[2]">{{myDialog[2].text}}</p>
      <p v-if="myDialog[3]">{{myDialog[3].text}}
      </p>
    </b-col>
    <b-col md="5" sm="6" style="border-right: 1pt solid #000;">
      <div>
        <h3>Mint Edition: <span class="text-warning">{{currentCost}}</span> STX</h3>
        <h5>{{currentMaxEditions - (editionCounter - 1)}} available in current run</h5>
      </div>
    </b-col>
    <rates-listing :message="rateMessage()"  :amount="currentCost"/>
  </b-row>
  <b-row>
    <b-col cols="12">
      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <div class="" style="width: 79%; border-bottom: 1pt solid #000000;"></div>
          <div style="position: relative; top: 25px;">
            <square-button :theme="'dark'" @clickButton="mintEdition" :label1="'MINT EDITION'" :svgImage="icon" :usePixelBg="true"/>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</div>
</template>

<script>
import RatesListing from '@/components/toolkit/RatesListing'
import SquareButton from '@/components/utils/SquareButton'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PurchaseBuyNow',
  components: {
    SquareButton,
    RatesListing
  },
  props: ['assetHash'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      return 'Mint the next edition for ' + this.currentCost + ' STX'
    },
    mintEdition: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        owner: contractAsset.owner,
        editionCost: this.currentCost + 0.1,
        provider: 'risidio',
        nftIndex: contractAsset.nftIndex,
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        functionName: 'mint-edition'
      }
      this.$store.dispatch('rpayPurchaseStore/mintEdition', data).then((result) => {
        this.result = result
      })
    }
  },
  computed: {
    myDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('buy-now')
      return dialog
    },
    currentCost: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.editionCost
    },
    editionsMintable: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return (contractAsset.tokenInfo.maxEditions >= contractAsset.editionCounter)
    },
    editionCounter: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.editionCounter
    },
    currentMaxEditions: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.maxEditions
    }
  }
}
</script>
<style lang="scss" scoped>
.input-group-text {
  background: #fff;
  color: #000;
}
</style>
