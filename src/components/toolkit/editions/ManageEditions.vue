<template>
<div  class="mt-3">
  <div class="">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between">
          <b-badge class="mb-3 p-3" variant="warning" v-if="editionsMintable">Editions are <span >available</span></b-badge>
          <b-badge class="mb-3 p-3" variant="danger" v-else>Editions are <span class="">unavailable</span></b-badge>
          <div class="text-right" v-if="editionsMintable && profile.superAdmin">
            <a class="mr-3 text-danger" @click="disableEditions()">switch editions off</a>
          </div>
        </div>
      </div>
      <div class="col-12 mb-3">
        <span class="text-warning">{{editionCounter - 1}}</span> edition(s) minted so far.
        Up to <span class="text-warning">{{currentMaxEditions}}</span> were allowed when the first edition
        of this NFT was minted.
      </div>
      <div class="col-12 mb-3">
        The cost for minting an edition is <span class="text-warning">{{currentCost}}</span> STX,
        split according to the royalties set when the original NFT was
        minted.
      </div>
    </div>
    <div class="row" v-if="profile.superAdmin">
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
        <b-button variant="outline-primary" @click="updateEditions()">Update</b-button>
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

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'ManageEditions',
  components: {
  },
  props: ['item'],
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
    this.editionCost = this.item.contractAsset.tokenInfo.editionCost
    this.maxEditions = this.item.contractAsset.tokenInfo.maxEditions
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
      if (!editionCost) {
        editionCost = 0
      }
      const data = {
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME,
        seriesOriginal: this.item.contractAsset.nftIndex,
        maxEditions: maxEditions,
        editionCost: editionCost
      }
      return this.$store.dispatch('rpayPurchaseStore/setEditionCost', data).then((result) => {
        this.transferring = null
        this.result = result
        this.$notify({ type: 'success', title: 'Editions', text: 'Transaction sent! Check the explorer for progress!' })
      }).catch((err) => {
        this.transferring = err
        this.$notify({ type: 'error', title: 'Editions', text: 'Error setting editions!' })
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    editionsMintable: function () {
      return (this.item.contractAsset.tokenInfo.maxEditions >= this.item.contractAsset.editionCounter)
    },
    editionCounter: function () {
      const firstEdition = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH_EDITION]({ assetHash: this.item.assetHash, edition: 1 })
      return (firstEdition) ? firstEdition.contractAsset.editionCounter : 0
    },
    currentMaxEditions: function () {
      return this.item.contractAsset.tokenInfo.maxEditions
    },
    currentCost: function () {
      return this.item.contractAsset.tokenInfo.editionCost
    }
  }
}
</script>

<style>
</style>
