<template>
<div  class="mt-3">
  <div class="">
    <div class="row mb-4">
      <div class="col-12">You can change the cost of minting subsequent editions</div>
    </div>
    <div class="row mb-4" v-if="updating">
      <div class="col-12">Update begun</div>
    </div>
    <div class="row mb-4" v-else>
      <div class="col-12 mb-3">
        <b-input-group append="STX">
          <b-form-input id="editionCost" :state="showEditionCost" v-model="editionCost" placeholder="The cost of minting editions of this artwork"></b-form-input>
        </b-input-group>
      </div>
      <div class="col-12 text-right">
        <b-link router-tag="span" v-b-tooltip.click :title="ttTransfers" class="text-white mr-3" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
        <square-button @clickButton="setEditionCost()" :theme="'light'" :label1="'TRANSFER NFT'" :icon="'eye'"/>
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
      errorMessage: null,
      network: NETWORK,
      result: {},
      transferring: false
    }
  },
  methods: {
    setEditionCost: function () {
      this.transferring = 'update begun...'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        seriesOriginal: contractAsset.nftIndex,
        editionCost: this.editionCost
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
  }
}
</script>

<style>
</style>
