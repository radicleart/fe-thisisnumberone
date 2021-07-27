<template>
    <b-navbar toggleable="true" class="p-4" :fixed="getFixed()" type="dark" variant="transparent">
      <b-navbar-brand href="#"><b-link to="/"><img height="30px" :src="logo" /></b-link></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="text-white">
        <template #default="{ expanded }">
          <img width="60px" height="30px" class="text-white" v-if="expanded" :src="cross">
          <img width="60px" height="30px" class="text-white" v-else :src="grid">
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav align="center">

        <!-- Right aligned nav items -->
        <b-navbar-nav class="wtf-menu mx-auto" v-if="showAbout()">
          <b-nav-item href="#"><a class="text-nowrap text-white mx-md-5 mx-sm-3" v-scroll-to="{ offset: -60, element: '#thisisone', duration: 1000 }" href="#thisisone">This Is #1</a></b-nav-item>
          <b-nav-item href="#"><a class="text-nowrap text-white mx-md-5 mx-sm-3" v-scroll-to="{ offset: -60, element: '#chemicalx', duration: 1000 }" href="#chemicalx">Chemical X</a></b-nav-item>
          <b-nav-item href="#"><a class="text-nowrap text-white mx-md-5 mx-sm-3" v-scroll-to="{ offset: -80, element: '#charity-grid', duration: 1000 }" href="#charity">Charity</a></b-nav-item>
          <b-nav-item href="#"><a class="text-nowrap text-white mx-md-5 mx-sm-3" v-scroll-to="{ offset: -60, element: '#about-section5', duration: 1000 }" href="#about-section5">Environment</a></b-nav-item>
          <b-nav-item href="#"><a class="text-nowrap text-white mx-md-5 mx-sm-3" v-scroll-to="{ offset: 50, element: '#collaborate', duration: 1000 }" href="#collaborate">Collaborate</a></b-nav-item>
          <b-nav-item class="mt-5" href="#"><b-link to="/">Home</b-link></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="wtf-menu mx-auto" v-else>
          <b-nav-item><b-link class="text-white top-content" to="/about"><img height="30px" :src="wtf" alt="about link"/></b-link></b-nav-item>
          <div v-if="profile.loggedIn" class="mt-5 my-4 text-white text-center">
            <div>
              <span class="mr-3">Welcome</span>
              <span class="mr-3 stx-username">{{profile.username}}</span>
            </div>
            <div class="text-small mt-0">
              <span class="text-warning">{{profile.stxAddress}}</span>
            </div>
            <div v-if="profile.accountInfo" class="text-small">
              <span class="mr-5"><a style="font-size: 1.2rem;" :href="getStacksMateUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Top up your Stacks at Stacks Mate'" class="text-white text-small ml-3" target="_blank">Balance:</a> <span class="text-warning">{{profile.accountInfo.balance}}</span> STX</span>
              <span v-if="profile.accountInfo.balance === 0"><b-link variant="outline-warning" @click="gotoStacksMateUrl">Get some STX</b-link></span>
            </div>
          </div>
          <b-nav-item active><b-link to="/nft-gallery">Gallery</b-link></b-nav-item>
          <b-nav-item v-if="!canUpload()"><b-link to="/exhibit-here">Exhibit Here?</b-link></b-nav-item>
          <b-nav-item class="mt-5 pt-5 border-top" v-if="profile.loggedIn"><b-link to="/my-nfts">My NFTs</b-link></b-nav-item>
          <b-nav-item v-if="profile.superAdmin"><b-link to="/offers">Offers</b-link></b-nav-item>
          <b-nav-item v-if="canUpload()"><b-link to="/my-items">My Items</b-link></b-nav-item>
          <b-nav-item v-if="canUpload()"><b-link to="/upload-item">Create NFT</b-link></b-nav-item>
          <b-nav-item v-if="profile.superAdmin" active><b-link to="/app-admin">Admin</b-link></b-nav-item>
          <b-nav-item v-if="!profile.loggedIn && webWalletNeeded">
            <h1><a :href="webWalletLink" target="_blank">Get a Stacks Web Wallet <b-icon class="ml-3 mb-3" icon="arrow-up-right-square-fill"/></a></h1>
          </b-nav-item>
          <b-nav-item v-if="profile.loggedIn"><b-link @click.prevent="logout()">Logout</b-link></b-nav-item>
          <b-nav-item v-else-if="!webWalletNeeded"><b-link @click.prevent="startLogin()">Login</b-link></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AboutNavbar',
  components: {
  },
  data () {
    return {
      wtf: 'https://images.prismic.io/dbid/5b31fbd1-ca16-4fa0-bd5c-2d82b3ef98cc_WTF.png?auto=compress,format',
      logo: require('@/assets/img/navbar-footer/logo.svg'),
      hollowWhiteOne: require('@/assets/img/Group 97.svg'),
      rainbowOne: require('@/assets/img/Group 76.svg'),
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      collapsed: true
    }
  },
  methods: {
    gotoStacksMateUrl: function () {
      location.href = this.getStacksMateUrl
    },
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
    },
    startExhibit () {
      if (!this.profile.loggedIn) {
        this.$router.push('/login?referer=exhibit-here')
      } else {
        this.$router.push('/exhibit-here')
      }
    },
    showAbout () {
      return this.$route.name === 'about'
    },
    getFixed () {
      return (this.$route.name === 'about') ? 'top' : 'none'
    },
    getLogo () {
      return this.logo
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username
    },
    logout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        if (this.$route.name !== 'home') {
          this.$router.push('/')
        }
      }).catch((err) => {
        console.log(err)
        this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
      })
    },
    startLogin () {
      const myProfile = this.$store.getters['rpayAuthStore/getMyProfile']
      if (myProfile.loggedIn) {
        this.$emit('connect-login', myProfile)
      } else {
        this.$store.dispatch('rpayAuthStore/startLogin').catch(() => {
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
          if (!this.profile.loggedIn) {
            this.$router.push('/login?referer=navbar')
          }
        })
      }
    }
  },
  computed: {
    getStacksMateUrl () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return this.$store.getters[APP_CONSTANTS.KEY_STACKS_MATE_URL](profile)
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
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    hasNfts () {
      const purchased = this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      return this.profile.loggedIn && purchased && purchased.length > 0
    },
    toggleIcon () {
      return this.collapsed ? this.grid : this.cross
    }
  }
}
</script>

<style lang="scss">
/* NAVBAR GENERAL STYLE */
.wtf-menu {
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80%;
  min-height: 70vh;
  margin-top: 20px;
  padding: 30px 20px;
  background-color: #000000;
}
.wtf-menu a {
  font-size: 2.5rem;
  margin-top: 30px;
  color: #fff;
}
.top-content {
  font-size: 2.6rem;
}
#one-nav nav {
  height: 60px;
}
.navbar-light .navbar-nav .nav-link {
    color: #fff;
}

.navbar-nav {
  z-index: 4;
}

#one-nav .toggle-icon .nav-link {
  padding: 0;
}

/* COLLAPSIBLE PART OF NAVBAR STYLE */
#collapse {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  background-color: #000000;
  color: #ffffff;
  top: 0px;
  text-align: center;
  z-index: 3;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all 0.3s ease-out;
}
#collapse a {
  color: #ffffff;
}

/* Top collapse section style */
#collapse .top-content li {
  list-style: none;
  padding-top: 50px;
}
#collapse .top-content li a {
  font-size: 3.5rem;
}
#collapse .top-content {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding-top: 60px;
}

/* Bottom collapse section style */
#collapse .bottom-content {
  width: 90%;
  display: flex;
  justify-content: space-between;
  padding: 50px 0;
}
#collapse .bottom-content--container {
  display: flex;
}
#collapse .bottom-content--container .nav-item:not(:last-child) {
  padding-right: 20px;
}

/* Break line img style */
#collapse .break-line {
  padding-top: 50px;
  width: 75%;
}
#collapse .break-line img {
  max-width: 100%;
}

/* MOBILE DESIGN */
@media only screen and (max-width: 700px) {
  #collapse .bottom-content {
    width: 90%;
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 20px 0;
  }
  #collapse .bottom-content--container:not(:last-child) {
    padding-bottom: 20px;
  }
}

@media only screen and (max-width: 500px) {
  #collapse .bottom-content--container:not(:last-child) {
    padding-bottom: 0;
  }
}

@media only screen and (max-width: 376px) {
  #collapse .top-content li {
    padding-top: 30px;
  }
}

@media only screen and (max-width: 350px) {
  #collapse .break-line {
    padding-top: 0;
  }
  #collapse .top-content li {
    padding-top: 20px;
    font-size: 3rem;
  }
}

</style>
