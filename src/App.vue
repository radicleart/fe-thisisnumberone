<template>
<splash v-if="loading"/>
<div id="app" v-else :style="'min-height: 100vh; background-size: contain; background-image: url(' + getPixelBackground + ')'">
  <div v-if="!configured">
    <risidio-pay :configuration="configuration"/>
  </div>
  <div :key="componentKey" v-else>
    <div></div>
    <router-view name="header"/>
    <router-view />
    <router-view name="footer"/>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
    <waiting-modal/>
    <success-modal />
  </div>
</div>
</template>

<script>
import Splash from '@/views/Splash'
import SuccessModal from '@/components/utils/SuccessModal'
import WaitingModal from '@/components/utils/WaitingModal'
import RisidioPay from 'risidio-pay'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'App',
  components: {
    Splash,
    SuccessModal,
    WaitingModal,
    RisidioPay
  },
  data () {
    return {
      loading: true,
      configured: false,
      componentKey: 0
    }
  },
  mounted () {
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow', asset: this.gaiaAsset })
    const $self = this
    let resizeTimer
    this.loading = false
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'configured') {
          $self.$store.dispatch('initApplication').then(() => {
            // $self.$store.dispatch('rpaySearchStore/fetchContractData')
            $self.configured = true
          })
        } else if (data.opcode === 'stx-transaction-mint') {
          const item = $self.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](data.assetHash)
          item.stacksTransactions.splice(0, 0, { txId: data.txId, type: 'mint-token' })
          // commit it straight away to avoid double clicks on the minting button
          $self.$store.commit('myItemStore/setMintTxId', item)
          $self.$store.dispatch('myItemStore/saveItem', item)
        } else if (data.opcode === 'stx-transaction-mint-error') {
          const item = $self.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](data.assetHash)
          // commit it straight away to avoid double clicks on the minting button
          $self.$store.commit('myItemStore/setMintTxId', item)
          $self.$store.dispatch('myItemStore/saveItem', item)
        } else if (data.opcode === 'configured-logged-in') {
          $self.$store.commit('rpayAuthStore/setAuthResponse', data.session)
          $self.$store.dispatch('rpayAuthStore/fetchMyAccount')
        }
      })
    }
    window.addEventListener('resize', function () {
      $self.loading = true
      const currentComponent = $self.$route.name
      if (currentComponent === 'upload-item' || currentComponent === 'edit-item') {
        return
      }
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.$store.commit('setWinDims')
        $self.componentKey += 1
        $self.loading = false
      }, 400)
    })
    this.$prismic.client.getSingle('homepage').then(document => {
      if (document) {
        this.$store.commit('contentStore/addHomeContent', document.data)
      }
    })
    this.$prismic.client.getSingle('about').then(document => {
      if (document) {
        this.$store.commit('contentStore/addAboutContent', document.data)
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
    getPixelBackground () {
      return this.$store.getters[APP_CONSTANTS.KEY_PIXEL_BACKGROUND]
    },
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
