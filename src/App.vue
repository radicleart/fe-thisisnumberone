<template>
<b-container v-if="loading">
  <b-row class="splash-screen vh-100 text-center" align-v="center">
    <b-col><b-button class="main-navigation-button" variant="primary">#1</b-button></b-col>
  </b-row>
</b-container>
<div id="app" v-else>
  <div>
    <risidio-pay :configuration="configuration"/>
  </div>
  <div :key="componentKey" v-if="configured">
    <div></div>
    <router-view name="header"/>
    <router-view class="" style="min-height: 50vh;"/>
    <router-view name="footer"/>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
    <waiting-modal/>
    <success-modal />
  </div>
</div>
</template>

<script>
import SuccessModal from '@/components/utils/SuccessModal'
import WaitingModal from '@/components/utils/WaitingModal'
import RisidioPay from 'risidio-pay'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'App',
  components: {
    SuccessModal,
    WaitingModal,
    RisidioPay
  },
  data () {
    return {
      loading: true,
      configured: false,
      componentKey: 0,
      manWithGuitar: 'https://images.prismic.io/radsoc/dcda9455-1a85-4dd2-a172-7c07dd8a71dc_Download+%284%29.png?auto=compress,format',
      background: 'https://images.prismic.io/radsoc/acaba7f7-b0b7-4149-948e-d4814a8ca873_bg_img.png?auto=compress,format'
    }
  },
  mounted () {
    const $self = this
    let resizeTimer
    this.loading = false

    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow' })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'configured') {
          $self.$store.dispatch('initApplication').then(() => {
            // $self.$store.dispatch('rpayStacksContractStore/fetchContractData', configuration).then(() => {
            $self.configured = true
            // })
          })
        } else if (data.opcode === 'configured-logged-in') {
          $self.$store.commit('rpayAuthStore/setAuthResponse', data.session)
          $self.$store.dispatch('rpayAuthStore/fetchMyAccount')
        }
      })
    }
    window.addEventListener('resize', function () {
      const currentComponent = $self.$route.name
      if (currentComponent === 'upload-item' || currentComponent === 'edit-item') {
        return
      }
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.$store.commit('setWinDims')
        $self.componentKey += 1
      }, 400)
    })
    this.$prismic.client.getSingle('homepage').then(document => {
      if (document) {
        this.$store.commit('contentStore/addHomeContent', document.data)
      }
    })
    this.$prismic.client.getSingle('how-it-works').then(document => {
      if (document) {
        this.$store.commit('contentStore/addHowItWorks', document.data)
      }
    })
    this.$prismic.client.getSingle('mainfooter').then((document) => {
      if (document) {
        this.$store.commit('contentStore/addMainFooter', document.data)
      }
    })
    this.$prismic.client.query(
      this.$prismic.Predicates.at('document.type', 'charity'),
      { pageSize: 20, page: 1 }
    ).then((response) => {
      this.$store.commit('contentStore/addCharities', response.results)
    })
    this.$prismic.client.query(
      this.$prismic.Predicates.at('document.type', 'artist'),
      { pageSize: 20, page: 1 }
    ).then((response) => {
      this.$store.commit('contentStore/addArtists', response.results)
    })
  },
  methods: {
    scrollMeTo (data) {
      const element = document.getElementById(data.refName)
      const top = element.offsetTop
      window.scrollTo(0, top)
    }
  },
  computed: {
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    }
  }
}
</script>
<style lang="scss" scoped>
.splash-screen {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  background-color: aqua;
  text-align: center;
  vertical-align: middle;
}
</style>
