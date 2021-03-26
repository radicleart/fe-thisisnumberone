<template>
  <div id="app" v-if="!loading">
    <div :key="componentKey">
      <div></div>
      <router-view name="header"/>
      <router-view class="container-fluid mt-5" style="min-height: 50vh;"/>
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

export default {
  name: 'App',
  components: {
    SuccessModal,
    WaitingModal
  },
  data () {
    return {
      loading: true,
      componentKey: 0,
      manWithGuitar: 'https://images.prismic.io/radsoc/dcda9455-1a85-4dd2-a172-7c07dd8a71dc_Download+%284%29.png?auto=compress,format',
      background: 'https://images.prismic.io/radsoc/acaba7f7-b0b7-4149-948e-d4814a8ca873_bg_img.png?auto=compress,format'
    }
  },
  mounted () {
    this.$store.dispatch('initApplication').then(() => {
      this.loading = false
    })
    const $self = this
    let resizeTimer
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
  },
  methods: {
    scrollMeTo (data) {
      const element = document.getElementById(data.refName)
      const top = element.offsetTop
      window.scrollTo(0, top)
    }
  },
  computed: {
    guitarMan () {
      if (this.$route.name === 'home') {
        const image = this.manWithGuitar
        const I_W = 'getInnerWidth'
        const innerWidth = this.$store.getters[I_W]
        if (innerWidth < 1000) return
        return {
          position: 'absolute',
          padding: '0 0 0 0',
          height: '100vh',
          width: '100%',
          top: '0px',
          'background-image': `url(${image})`,
          'background-repeat': 'no-repeat',
          'background-position': 'bottom right',
          '-webkit-background-size': '600px',
          '-moz-background-size': '600px',
          '-o-background-size': '600px',
          'background-size': '600px'
        }
      }
      return null
    },
    bannerImage () {
      if (this.$route.name === 'home' || this.$route.name === 'login' || this.$route.name === 'how-it-works') {
        const height = '103vh'
        // if (this.$route.name === 'how-it-works') height = '53vh'
        return {
          padding: '0 0 0 0',
          height: height,
          width: '100%',
          position: 'relative',
          top: '0px',
          'background-image': `url(${this.background})`,
          'background-repeat': 'no-repeat',
          'background-position': 'center center',
          '-webkit-background-size': 'cover',
          '-moz-background-size': 'cover',
          '-o-background-size': 'cover',
          'background-size': 'cover'
        }
      }
      return null
    }
  }
}
</script>
