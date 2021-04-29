<template>
<div  class="mt-3">
  <div class="">
    <div class="row mb-4">
      <div class="my-5 col-12">
        <div class="d-flex justify-content-between">
          <div v-if="editionsMintable">Editions are <span class="text-success">available</span></div>
          <div v-else>Editions are <span class="text-danger">unavailable</span></div>
          <div class="text-right" v-if="editionsMintable">
            <a class="mr-3 text-danger" @click="disableEditions()">switch editions off</a>
          </div>
        </div>
      </div>
      <div class="col-12 mb-5"><span class="text-warning">{{editionCounter - 1}}</span> edition(s) in print.
        Up to <span class="text-warning">{{currentMaxEditions}}</span> can be minted.
        Minting cost for new editions is <span class="text-warning">{{currentCost}}</span> STX.
        <br/><br/>You can change these setting here.
      </div>
    </div>
    <div class="row">
      <div class="col-12 mb-4">
        <b-input-group append="STX" prepend="Cost">
          <b-form-input type="number" id="editionCost" v-model="editionCost" placeholder="The cost of minting editions of this artwork"></b-form-input>
        </b-input-group>
      </div>
      <div class="col-12 mb-4">
        <b-input-group append="_#_" prepend="Max Ed.">
          <b-form-input type="number" id="maxEditions" v-model="maxEditions" placeholder="The maximum number of editions to allow"></b-form-input>
        </b-input-group>
      </div>
      <div class="col-12 text-right mb-5">
        <square-button @clickButton="updateEditions()" :theme="'light'" :label1="'UPDATE'" :icon="'eye'"/>
      </div>
      <div class="row mb-4" v-if="transferring">
        <div class="col-12 text-danger" v-html="transferring"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SquareButton from '@/components/utils/SquareButton'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'ManageEditions',
  components: {
    SquareButton
  },
  props: ['assetHash'],
  data: function () {
    return {
      editionCost: null,
      maxEditions: null,
      errorMessage: null,
      network: NETWORK,
      result: {},
      transferring: false
    }
  },
  mounted () {
    const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
    this.editionCost = contractAsset.tokenInfo.editionCost
    this.maxEditions = contractAsset.tokenInfo.maxEditions
  },
  methods: {
    disableEditions: function () {
      this.updateEditionInfo(0, this.editionCounter - 1)
    },
    updateEditions: function () {
      this.updateEditionInfo(this.editionCost, this.maxEditions)
    },
    updateEditionInfo: function (editionCost, maxEditions) {
      if (editionCost < 0 || maxEditions < (this.editionCounter - 1)) {
        this.transferring = 'cost has to be a positive number and max editions same or bigger than current number minted...'
        return
      }
      this.transferring = 'update begun...'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        seriesOriginal: contractAsset.nftIndex,
        maxEditions: maxEditions,
        editionCost: editionCost
      }
      return this.$store.dispatch('rpayPurchaseStore/setEditionCost', data).then((result) => {
        this.transferring = null
        this.result = result
      }).catch((err) => {
        this.transferring = err
      })
    }
  },
  computed: {
    editionsMintable: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return (contractAsset.tokenInfo.maxEditions >= contractAsset.editionCounter)
    },
    editionCounter: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset.editionCounter
    },
    currentMaxEditions: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset.tokenInfo.maxEditions
    },
    currentCost: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset.tokenInfo.editionCost
    }
  }
}
</script>

<style>
</style>
