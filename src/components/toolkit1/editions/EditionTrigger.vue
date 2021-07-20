<template>
<div class="my-5" v-if="editionsMintable">
  <div class="mx-5 text-center">
      <!--
        <b-link router-tag="span" class="text-white" @click.prevent="openEditionDialog()">
        <b-icon icon="chevron-right" class="mr-3"/><span class="text-warning">{{currentMaxEditions - (editionCounter - 1)}} Editions available</span>! The next edition could be yours for a mere <span class="text-warning">{{currentCost}}</span> STX
        </b-link>
      -->
      <div class="mb-3"><b-button @click.prevent="openEditionDialog()" style="font-size: 1.4rem;" variant="outline-warning">Start</b-button></div>
      <div class="text-white">Claim a Fatboy Slim meets Stacks NFT for <span class="text-warning">FREE</span></div>
  </div>
  <b-modal size="lg" id="edition-modal" class="text-left">
    <edition-flow v-if="showRpayEditions" :assetHash="assetHash" @mintedEvent="mintedEvent"/>
    <template #modal-header></template>
    <template #modal-footer><div></div></template>
  </b-modal>
</div>
<!-- <div class="my-5" v-else>
   You missed out this time but stay tuned for more special NFT giveaways - coming soon!
</div> -->
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import EditionFlow from './EditionFlow'

export default {
  name: 'EditionTrigger',
  components: {
    EditionFlow
  },
  props: ['assetHash'],
  data () {
    return {
      showRpayEditions: false
    }
  },
  methods: {
    openEditionDialog: function () {
      this.showRpayEditions = true
      this.$bvModal.show('edition-modal')
    },
    mintedEvent: function (data) {
      this.showRpayEditions = false
      this.$bvModal.hide('edition-modal')
      this.$emit('mintedEvent', data)
    }
  },
  computed: {
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
    currentCost: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.editionCost
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
</style>
