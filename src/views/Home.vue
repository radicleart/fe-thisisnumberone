<template>
<section id="home-section" class="container text-center" v-if="!useSearchIndex && resultSet" style="min-height: 100vh;">
    <result-grid class="container text-center" :key="componentKey" :resultSet="resultSet"/>
</section>
<section id="home-section" class="container text-center" v-else style="min-height: 100vh;">
    <rpay-result-grid class="container text-center" :key="componentKey" :resultSet="resultSet"/>
</section>
</template>

<script>
import RpayResultGrid from '@/components/marketplace/RpayResultGrid'
import ResultGrid from '@/components/marketplace/ResultGrid'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Home',
  components: {
    ResultGrid,
    RpayResultGrid
  },
  data () {
    return {
      componentKey: 0,
      loading: true,
      showRpay: false,
      useSearchIndex: true
    }
  },
  mounted () {
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow' })
    this.showRpay = true
  },
  methods: {
  },
  computed: {
    resultSet () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      return resultSet
    },
    resultSetFromIndex () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      return resultSet
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    slices () {
      const content = this.$store.getters['contentStore/getHomepage']
      return (content) ? content.body : null
    },
    buttonLabel () {
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) return null
      return content.credits[0].text
    }
  }
}
</script>

<style>
.market-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 200px;
  background-color: rgb(2, 0, 0) !important;
  text-align: center;
}

.home-content {
  position: relative;
  top: 140px;
}
#homeSection h2 {
  margin-bottom: 10px;
  font-size: 3.4rem;
}
#homeSection h3 {
  margin-bottom: 50px;
}
#homeSection p {
  margin-bottom: 20px;
}
</style>
