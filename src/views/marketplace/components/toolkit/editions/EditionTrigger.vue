<template>
<div class="row text-small" v-if="editionsMintable">
  <div class="col-12">
    <div class="mt-4 mb-3">
      <b-button variant="outline-warning" @click.prevent="openEditionDialog()">Mint Edition</b-button>
    </div>
    <div>
      <span>{{currentMaxEditions - (editionCounter - 1)}} editions available at <span class="">{{currentCost}}</span> STX</span>
    </div>
  </div>
  <b-modal size="lg" id="edition-modal" class="text-left">
    <edition-flow @mintedEvent="mintedEvent" v-if="showRpayEditions" :item="item"/>
    <template #modal-header></template>
    <template #modal-footer><div></div></template>
  </b-modal>
</div>
</template>

<script>
import EditionFlow from './EditionFlow'

export default {
  name: 'EditionTrigger',
  components: {
    EditionFlow
  },
  props: ['item'],
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
    mintedEvent (data) {
      this.$bvModal.hide('edition-modal')
      this.$emit('mintedEvent', data)
    }
  },
  computed: {
    editionsMintable: function () {
      return (this.item.contractAsset.tokenInfo.maxEditions >= this.item.contractAsset.editionCounter)
    },
    editionCounter: function () {
      return this.item.contractAsset.editionCounter
    },
    currentCost: function () {
      return this.item.contractAsset.tokenInfo.editionCost
    },
    currentMaxEditions: function () {
      return this.item.contractAsset.tokenInfo.maxEditions
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
