<template>
<section id="splash-section" style="height: 100vh;" class="d-flex flex-column justify-content-center align-items-center text-white" v-if="content">
  <b-row class="mt-auto w-100">
    <b-col cols="12" class="text-center">
      <div><router-link to="/home" class="navbar-brand"><img height="36px" :src="logo" alt="logo"/></router-link></div>
      <!-- <div class="mt-5"><h1>{{content.splashtext[0].text}}</h1></div> -->
      <div class="mt-5 description-text">
        <p class="text-center">{{content.splashtext[1].text}}</p>
      </div>
      <div class="mt-5">
        <square-button @clickButton="$router.push('/home')" :theme="'light'" :label1="'Enter Website'" :icon="'arrow-right'" :iconColor="'text-white'"/>
      </div>
    </b-col>
  </b-row>
  <div class="footer-break-line w-100 mt-auto" :style="'background-image: url(' + getBreakLine + ')'"></div>
</section>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'
import { APP_CONSTANTS } from '@/app-constants'
export default {
  name: 'Splash',
  components: {
    SquareButton
  },
  data () {
    return {
      logo: require('@/assets/img/navbar-footer/logo.svg')
    }
  },
  methods: {
  },
  computed: {
    getBreakLine () {
      return this.$store.getters[APP_CONSTANTS.KEY_BREAK_LINE]
    },
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    }
  }
}
</script>

<style>

#splash-section .bottom-logo-container {
  text-align: right;
  margin-top: auto;
  margin-bottom: 24px;
}

#splash-section .description-text {
  margin: 0 auto;
  max-width: 475px;
  padding: 0 20px;
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
  font-size: 4.4rem;
}
#homeSection h3 {
  margin-bottom: 50px;
}
#homeSection p {
  margin-bottom: 20px;
}
*/
</style>
