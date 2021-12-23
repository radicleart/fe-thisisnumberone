<template>
<section id="homeSection" style="min-height: 85vh;">
  <b-container class="my-5 container text-white" v-if="!content">
    <div class="row">
      <div class="col-12">
        Content missing for key {{getKey()}}
      </div>
    </div>
  </b-container>
  <b-container class="text-white text-left home-content mt-5" v-else>
    <b-row class="my-5" v-if="!profile.loggedIn">
      <b-col v-if="webWalletNeeded">
        <h1><a :href="webWalletLink" target="_blank">Get a Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></h1>
      </b-col>
      <b-col v-else>
        <PrismicItems :prismicItems="content" class="child-information"/>
        <div class="mt-5 text-left"><b-button class="btn-action" variant="outline-warning" @click.prevent="startLogin()">Login to Begin</b-button> <span router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'You\'ll need a Stacks Wallet to own your NFTs - NFTs are a new form of digital property that you own!'" class="text-white ml-3" variant="outline-success"> <b-icon class="ml-0" icon="question-circle"/></span></div>
      </b-col>
    </b-row>
    <b-row class="my-5" v-else>
      <b-col>
        <prismic-items :prismicItems="content" class="child-information"/>
        <div class="mt-5 text-left"><b-button class="btn-action" to="/exhibit-here" variant="outline-warning">Apply Now!</b-button> <span router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'You\'ll need a Stacks Wallet to own your NFTs - NFTs are a new form of digital property that you own!'" class="text-white ml-3" variant="outline-success"> <b-icon class="ml-0" icon="question-circle"/></span></div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'Login',
  components: {
    PrismicItems
  },
  data () {
    return {
      loading: true,
      exhibitFlow: false
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.redirect === '/exhibit-here') {
      this.exhibitFlow = true
    }
    if (this.profile.loggedIn) this.$router.push('/exhibit-here')
    this.loaded = true
  },
  methods: {
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
    },
    startLogin () {
      if (this.profile.loggedIn) {
        this.$emit('connect-login', this.profile)
      } else {
        this.$store.dispatch('rpayAuthStore/startLogin').then((profile) => {
          localStorage.removeItem('UPGRADE_TX')
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN, stxAddress: profile.stxAddress }, { root: true })
        }).catch(() => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForAnon', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN }, { root: true })
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_INFO_PAGE]('login-page')
      // if (!content) content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_INFO_PAGE]('info-privacy-policy')
      if (content && content.data && content.data.information) return content.data.information
      return null
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    webWalletNeeded () {
      const webWalletNeeded = this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_NEEDED]
      return webWalletNeeded
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    }
  }
}
</script>

<style>
</style>
