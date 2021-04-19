<template>
<section id="home-section" class="" v-if="resultSet" :style="'background-image: url(' + background + ')'">
    <!--  <result-grid class="container text-center" :key="componentKey" :resultSet="resultSet"/> -->
    <div class="main-content-container ">
      <div class="d-flex justify-content-center">
        <div class="artist-image"><a href="#"><img :src="content.body[0].items[0].artist_image.url" :alt="content.body[0].items[0].artist_image.alt"></a></div>
        <div class="artist-image"><a href="#"><img :src="content.body[0].items[1].artist_image.url" :alt="content.body[0].items[1].artist_image.alt"></a></div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="artist-image"><a href="#"><img :src="content.body[0].items[2].artist_image.url" :alt="content.body[0].items[2].artist_image.alt"></a></div>
        <div class="artist-image"><a href="#"><img :src="content.body[0].items[3].artist_image.url" :alt="content.body[0].items[3].artist_image.alt"></a></div>
      </div>
    </div>
    <div class="bottom-logo-container"><img :src="content.logo.url" :alt="content.logo.alt"></div>
</section>
</template>

<script>
// import ResultGrid from '@/components/marketplace/ResultGrid'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Home',
  components: {
    // ResultGrid
  },
  data () {
    return {
      componentKey: 0,
      loading: true,
      showRpay: false,
      background: require('@/assets/img/navbar-footer/main-navbar-BG.svg')
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
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
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
#home-section {
  height: 100vh;
  width: 100%;
  margin-top: -60px;
  padding: 0 24px;
  display: flex;
  flex-flow: column;
  background-repeat: no-repeat;
  background-size: cover;
}

.main-content-container {
  height: 100%;
  width: 100%;
  padding-top: 60px;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.bottom-logo-container {
  text-align: right;
  margin-top: auto;
  margin-bottom: 24px;
}

/*
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
*/
</style>
