<template>
<div>
  <div class="d-flex justify-content-center" v-for="(n, i) in gridSize" :key="i">
    <div v-for="(result, index) in resultSet" :key="index">
      <div class="100vh flex-column align-items-center d-flex justify-content-center">
        <result-item :result="result" />
      </div>
    </div>
  </div>
  <!--
  <risidio-pay v-if="showRpay" :configuration="configuration"/>
  -->
</div>
</template>

<script>
// import RisidioPay from 'risidio-pay'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'RpayResultGrid',
  components: {
    // RisidioPay
  },
  props: ['resultSet'],
  data () {
    return {
      showRpay: false,
      gridSize: 2
    }
  },
  mounted () {
    const $self = this
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'marketplace-flow' })
    this.showRpay = true
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        $self.mintResult = data.message
        if (data.opcode === 'save-selling-data') {
          $self.$bvModal.hide('rpay-modal')
        }
      })
    }
  },
  methods: {
    breakLine: function (index) {
      return (index % 2 === 1) ? '<br/>' : ''
    },
    cols: function () {
      if (this.resultSet.length < 4) return 12
      else if (this.resultSet.length < 9) return 6
      else return 4
    },
    results (i) {
      const results = this.resultSet
      try {
        const start = i * this.gridSize
        const end = this.gridSize * (i + 1)
        return results.slice(start, end)
      } catch (e) {
        return null
      }
    }
  },
  computed: {
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    assets1 () {
      return this.resultSet.slice(0, 2)
    },
    assets2 () {
      return this.resultSet.slice(2)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
