<template>
<div class="my-5 row text-small" v-if="editionsMintable">
  <div class="col-12">
    <b-link router-tag="span" class="text-white" @click.prevent="openEditionDialog()">
      <b-icon icon="chevron-right" class="mr-3"/><span class="text-warning">{{currentMaxEditions - (editionCounter - 1)}} Editions available</span>! The next edition could be yours for a mere <span class="text-warning">{{currentCost}}</span> STX
    </b-link>
  </div>
  <b-modal size="lg" id="edition-modal" class="text-left">
    <edition-flow v-if="showRpayEditions" :assetHash="assetHash"/>
    <template #modal-header></template>
    <template #modal-footer><div></div></template>
  </b-modal>
</div>
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
