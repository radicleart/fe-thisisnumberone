<template>
<div  class="mt-3">
  <div class="">
    <div class="row mb-4">
      <div class="col-12">
        <square-button @clickButton="indexRootFile()" :theme="'light'" :label1="'RE-INDEX ITEM'" :icon="'eye'"/>
        <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="ttReindex" class="text-white ml-3" variant="outline-success"><b-icon class="ml-2" icon="question-circle"/></b-link>
      </div>
      <div class="col-12 mt-5" v-if="showTips">
        <p>Reindexing takes a few seconds and ensures everyone sees recent changes.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'GaiaHubRelay',
  components: {
    SquareButton
  },
  props: ['assetHash'],
  data: function () {
    return {
      result: false,
      showTips: false
    }
  },
  methods: {
    indexRootFile: function () {
      this.showTips = true
      this.$store.dispatch('rpayStacksContractStore/indexGaiaData').then((result) => {
        this.result = result
      }).catch((err) => {
        this.result = err
      })
      this.$store.dispatch('myItemStore/indexRootFile').then((result) => {
        this.result = result
      }).catch((err) => {
        this.result = err
      })
    }
  },
  computed: {
    ttReindex () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-reindex')
      return (tooltip) ? tooltip[0].text : ''
    }
  }
}
</script>

<style>
</style>
