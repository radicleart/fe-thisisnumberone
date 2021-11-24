<template>
<div class="w-100 mb-3" role="group">
  <h1 for="status-name">Choose a Collection</h1>
  <b-form-select v-if="currentRuns && currentRuns.length > 0" @change="changeCollection" id="status-name" v-model="currentRunKey" :options="currentRuns"></b-form-select>
  <div v-else>No collections available</div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ChooseCollection',
  components: {
  },
  props: ['type', 'runKey'],
  data: function () {
    return {
      currentRunKey: null
    }
  },
  mounted () {
    if (this.runKey) {
      this.currentRunKey = this.runKey
    }
  },
  methods: {
    changeCollection () {
      const loopRun = this.loopRuns.find((o) => o.currentRunKey === this.currentRunKey)
      this.$emit('updateCollection', { loopRun: loopRun })
    }
  },
  computed: {
    currentRuns () {
      const mapped = []
      const $self = this
      this.loopRuns.forEach(function (loopRun) {
        if (loopRun.status === 'active' && loopRun.type === $self.type) {
          mapped.push({ text: loopRun.currentRun, value: loopRun.currentRunKey })
        }
      })
      return mapped
    },
    loopRuns () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUNS]
      return loopRuns
    }
  }
}
</script>

<style>
#toAddress {
  font-size: 1.0rem !important;
}
</style>
