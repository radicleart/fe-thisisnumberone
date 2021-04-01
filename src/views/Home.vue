<template>
<section id="home-section" v-if="slices">
  <div class="">
    <result-grid />
  </div>
</section>
</template>

<script>
import ResultGrid from '@/components/marketplace/ResultGrid'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Home',
  components: {
    ResultGrid
  },
  data () {
    return {
      loading: true,
      showRpay: false
    }
  },
  mounted () {
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'marketplace-flow' })
    this.showRpay = true
  },
  methods: {
  },
  computed: {
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
