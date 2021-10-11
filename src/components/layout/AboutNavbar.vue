<template>
<div id="about-bar">
    <b-navbar toggleable="true" class="p-4" :fixed="getFixed()" type="dark" :variant="bgVariant()">
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
          <b-nav-item class="text-white top-content" to="/about"><img height="30px" :src="wtf" alt="about link"/></b-nav-item>
          <div v-if="profile.loggedIn" class="mt-5 my-4 text-white text-center">
            <div>
              <span class="mr-3">Welcome</span>
              <span class="mr-3 stx-username">{{profile.username}}</span>
            </div>
            <div class="text-small mt-0" v-if="profile.username !== profile.stxAddress">
              <span class="text-warning">{{profile.stxAddress}}</span>
            </div>
            <div v-if="profile.accountInfo" class="text-small">
              <span class="mr-5"><a style="font-size: 1.2rem;" :href="getStacksMateUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Top up your Stacks at Stacks Mate'" class="text-white text-small ml-3" target="_blank">Balance:</a> <span class="text-warning">{{profile.accountInfo.balance}}</span> STX</span>
            </div>
          </div>
          <b-nav-item class="text-white" to="/nft-gallery">Gallery</b-nav-item>
          <!-- <b-nav-item class="text-white" to="/nft-marketplace"><span class="text-danger">New</span> Marketplace</b-nav-item> -->
          <b-nav-item v-if="!canUpload()">
            <b-link v-if="profile.loggedIn" to="/exhibit-here">Apply to Exhibit</b-link>
            <b-link v-else to="/login?redirect=%2Fexhibit-here">Exhibit Here?</b-link>
          </b-nav-item>
          <b-nav-item class="text-white" v-if="canUpload()" to="/upload-item">Create NFT</b-nav-item>
          <b-nav-item class="text-white" v-if="profile.loggedIn" to="/profile">My Profile</b-nav-item>
          <b-nav-item class="text-white mt-5 pt-5 border-top" v-if="profile.loggedIn" to="/my-nfts">My NFTs</b-nav-item>
          <b-nav-item class="text-white" v-if="profile.superAdmin"><b-link to="/mgmnt/registry">Admin</b-link></b-nav-item>
          <b-nav-item class="text-white" v-if="!profile.loggedIn && webWalletNeeded">
            <h1><a :href="webWalletLink" target="_blank">Get a Stacks Web Wallet <b-icon class="ml-3 mb-3" icon="arrow-up-right-square-fill"/></a></h1>
          </b-nav-item>
          <b-nav-item v-if="profile.loggedIn"><b-link @click.prevent="logout()">Logout</b-link></b-nav-item>
          <b-nav-item v-else-if="!webWalletNeeded"><b-link @click.prevent="startLogin()">Login</b-link></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</div>
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
      collapsed: true,
      rawResponse: '0x07070c000000080f62656e6566696369617279446174610a0c00000002096164647265737365730b0000000a05163f8538a288aac151ab76d1c4a70fdda68ba57c440516ea4549ffff9845cd298947db226d875f0b8ad8cd05164c26a0ecf2097ded9494eb384587843af8281a56051659923f7d6153931583e8643ee2bf8735010452d10516a102be07f10550249bcf84dea4b343ba5fd3a36c0516ef954ae47291ceb9b9c6274ffc49ac521dfccc2f0516ef954ae47291ceb9b9c6274ffc49ac521dfccc2f0516ef954ae47291ceb9b9c6274ffc49ac521dfccc2f0516ef954ae47291ceb9b9c6274ffc49ac521dfccc2f0516ef954ae47291ceb9b9c6274ffc49ac521dfccc2f067368617265730b0000000a01000000000000000000000000773594000100000000000000000000000077359400010000000000000000000000007735940001000000000000000000000000773594000100000000000000000000000077359400010000000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000000000000000000000000000000001000000000000000000000000000000000a626964436f756e74657201000000000000000000000000000000000e65646974696f6e436f756e7465720100000000000000000000000000000002086e6674496e64657801000000000000000000000000000004870c6f66666572436f756e7465720100000000000000000000000000000000056f776e657206162bcf9762d5b90bc36dc1b4759b1727690f92ddd30e6d61726b6574706c6163652d76320873616c65446174610a0c000000060a616d6f756e742d73747801000000000000000000000000000000001062696464696e672d656e642d74696d6501000000000000000000000000000000000d696e6372656d656e742d73747801000000000000000000000000000000000b726573657276652d73747801000000000000000000000000000000001073616c652d6379636c652d696e64657801000000000000000000000000000000020973616c652d74797065010000000000000000000000000000000009746f6b656e496e666f0a0c000000070a61737365742d686173680200000020e5507c8d9a71a1c13d1cfed19264d4dcea9adbe3ed544a1a1928146879468d760765646974696f6e01000000000000000000000000000000010c65646974696f6e2d636f737401000000000000000000000000000f42400c6d61782d65646974696f6e7301000000000000000000000000000000010d6d6574612d646174612d75726c020000008868747470733a2f2f676169612e626c6f636b737461636b2e6f72672f6875622f31356a6b36625455317276764c61355166687674684b5750784a74774e36586b54502f653535303763386439613731613163313364316366656431393236346434646365613961646265336564353434613161313932383134363837393436386437362e6a736f6e116d696e742d626c6f636b2d6865696768740100000000000000000000000000007e640f7365726965732d6f726967696e616c0100000000000000000000000000000487'
    }
  },
  mounted () {
    // const jsonValue = utils.fromHex(this.rawResponse)
    // console.log(jsonValue)
  },
  methods: {
    bgVariant: function () {
      if (this.$route.name === 'profile') return 'black'
      return 'transparent'
    },
    gotoStacksMateUrl: function () {
      location.href = this.getStacksMateUrl
    },
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
    },
    startExhibit () {
      if (!this.profile.loggedIn) {
        this.$router.push('/login?redirect=exhibit-here')
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
        this.$store.dispatch('rpayAuthStore/startLogin').then((profile) => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { stxAddress: profile.stxAddress }, { root: true })
        }).catch(() => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForAnon', { root: true })
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
#about-bar.nav-link {
  color: #fff !important;
}
#about-bar >>> .navbar-dark .navbar-nav .nav-link {
    color: #fff !important;
}
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
