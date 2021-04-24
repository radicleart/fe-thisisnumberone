<template>
<b-row style="min-height: 100vh;" class="text-white" v-if="content">
  <b-col cols="12" class="text-center" align-self="center">
    <div><router-link to="/home" class="navbar-brand"><img height="36px" :src="logo" alt="logo"/></router-link></div>
    <!-- <div class="mt-5"><h1>{{content.splashtext[0].text}}</h1></div> -->
    <b-row>
      <b-col cols="6" offset="3" class="mt-5" align-self="center">
        <div><p class="text-center">{{content.splashtext[1].text}}</p></div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" offset="3" class="mt-5" align-self="center">
        <div><square-button @clickButton="$router.push('/home')" :theme="'light'" :label1="'Enter Website'" :icon="'arrow-right'"/></div>
      </b-col>
    </b-row>
  </b-col>
</b-row>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'
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
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    }
  }
}
</script>

<style>

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
