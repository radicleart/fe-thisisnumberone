<template>
<section id="homeSection" style="min-height: 85vh;">
  <div class="container text-white text-left home-content mt-5">
    <b-row class="my-5" v-if="profile.loggedIn">
      <b-col>
        <h1 class="my-5 pointer" @click.prevent="startLogin()">Welcome to #1</h1>
        <ul>
          <li v-if="canUpload()"><h2><b-link to="/exhibit-here">Become a resident artist and exhibit your Artwork here</b-link></h2></li>
          <li v-else><h2><b-link to="/create">Become a resident artist and exhibit your Artwork here</b-link></h2></li>
          <li><h2><b-link to="/nft-gallery">Visit the #1 Gallery</b-link></h2></li>
        </ul>
      </b-col>
    </b-row>
    <b-row class="my-5" v-else>
      <b-col v-if="webWalletNeeded">
        <h1><a :href="webWalletLink" target="_blank">Get a Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></h1>
      </b-col>
      <b-col v-else>
        <h1 class="pointer" @click.prevent="startLogin()">Welcome to #1</h1>
        <ul>
          <li>
            <h2>
              <b-link @click.prevent="startLogin()">Please login to apply for Artist Status <span router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'You\'ll need a Stacks Wallet - this is so you can own your NFTs (aka digital artwork) '" class="text-white ml-3" variant="outline-success"> <b-icon class="ml-0" icon="question-circle"/></span></b-link>
            </h2>
          </li>
          <li><h2><b-link to="/nft-gallery">Visit the #1 Gallery</b-link></h2></li>
        </ul>
      </b-col>
    </b-row>
  </div>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      loading: true,
      exhibitFlow: false
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.referer === 'exhibit-here') {
      this.exhibitFlow = true
    }
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
        this.$store.dispatch('rpayAuthStore/startLogin').catch(() => {
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    }
  },
  computed: {
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
