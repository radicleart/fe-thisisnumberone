<template>
<div class="row text-small" v-if="editionsMintable">
  <div class="col-12">
    <div>
      <b-link router-tag="span" class="text-white" @click.prevent="openEditionDialog()">
        <span class="text-warning">{{currentMaxEditions - (editionCounter - 1)}} editions available at <span class="text-warning">{{currentCost}}</span> STX</span>
      </b-link>
    </div>
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
