<template>
<div id="one-nav" class="px-2" @mouseover="transme" @mouseout="transbackme">
<b-navbar class="p-4" variant="transparent">
  <b-navbar-brand href="#">
    <div class="">
      <router-link to="/home" class="navbar-brand"><img height="36px" :src="getLogo()" alt="logo"/></router-link>
    </div>
  </b-navbar-brand>
  <b-navbar-nav class="ml-auto ">
    <b-nav-item><b-link class="mr-4 text-white top-content" to="/my-items/minted">NFT Library</b-link></b-nav-item>
    <b-nav-item><b-link class="text-white top-content" to="/about">About</b-link></b-nav-item>
  </b-navbar-nav>
  <!--
  <b-navbar-nav class="ml-auto toggle-icon">
    <b-nav-item v-b-toggle.collapse @click="collapsed = !collapsed, noScroll()">
      <img style="width: 40px; height: 40px;" :src="toggleIcon">
    </b-nav-item>
  </b-navbar-nav>
    <b-collapse id="collapse" :style="'background-image: url(' + getPixelBackground + ')'">
      <b-navbar-nav class="top-content">
        <b-navbar-brand v-b-toggle.collapse @click="noScroll()" class="mr-0" href="#">
          <div class="">
            <router-link to="/home" class="navbar-brand mr-0"><img :src="logo" alt="logo"/></router-link>
          </div>
        </b-navbar-brand>
        <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="/number-one"><img :src="hollowWhiteOne"/></router-link></b-nav-item>
        <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="/about">About</router-link></b-nav-item>
        <b-nav-item v-b-toggle.collapse @click="noScroll()" v-if="!loggedIn"><b-link variant="light" @click.prevent="startLogin()">Login</b-link></b-nav-item>
        <b-nav-item v-b-toggle.collapse @click="noScroll()" v-else><b-link variant="light" @click.prevent="startLogout()">Logout</b-link></b-nav-item>
      </b-navbar-nav>

      <div class="break-line"><img :src="getBreakLine"></div>

      <b-navbar-nav class="bottom-content">
        <div class="bottom-content--container">
          <b-nav-item v-b-toggle.collapse @click="gotoLink('https://www.chemicalx.co.uk/')"><router-link to="#">Chemical X</router-link></b-nav-item>
          <b-nav-item v-b-toggle.collapse @click="gotoLink('https://discord.com/')"><router-link to="#">Get In Touch</router-link></b-nav-item>
        </div>
        <div class="bottom-content--container">
          <b-nav-item><b-icon @click="gotoLink('https://facebook.com/')" width="27px" height="27px" icon="facebook"></b-icon></b-nav-item>
          <b-nav-item><b-icon @click="gotoLink('https://instagram.com/')" width="27px" height="27px" icon="instagram"></b-icon></b-nav-item>
          <b-nav-item><b-icon @click="gotoLink('https://twitter.com/')" width="27px" height="27px" icon="twitter"></b-icon></b-nav-item>
        </div>
        <div class="bottom-content--container">
          <b-nav-item v-b-toggle.collapse @click="gotoLink('https://stacks.org/')"><router-link to="#">Stacks Foundation</router-link></b-nav-item>
          <b-nav-item v-b-toggle.collapse @click="gotoLink('https://tchange.risidio.com/')"><router-link to="#">Risidio Xchange</router-link></b-nav-item>
        </div>
      </b-navbar-nav>
    </b-collapse>
  -->
  </b-navbar>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainNavbar',
  components: {
  },
  data () {
    return {
      logo: require('@/assets/img/navbar-footer/logo.svg'),
      hollowWhiteOne: require('@/assets/img/Group 97.svg'),
      rainbowOne: require('@/assets/img/Group 76.svg'),
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      numberOne: require('@/assets/img/navbar-footer/n1.svg'),
      collapsed: true
    }
  },
  methods: {
    // test methods - just anticipating the design...
    gotoLink (link) {
      window.open(link)
    },
    getLogo () {
      if (this.$route.name === 'about') return this.rainbowOne
      return this.logo
    },
    transme () {
      const nav = document.getElementById('one-nav')
      if (nav) nav.style.depth = '100px'
    },
    transbackme () {
      const nav = document.getElementById('one-nav')
      if (nav) nav.style.depth = '100px'
    },
    headerClass () {
      return (this.$route.name === 'home' || this.$route.name === 'login') ? '' : 'header-class'
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username
    },
    noScroll () {
      document.body.classList.toggle('no-scroll')
    },
    startLogout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        // localStorage.clear()
        // sessionStorage.clear()
        this.$router.push('/')
      })
    },
    startLogin () {
      this.$store.dispatch('rpayAuthStore/startLogin').then((profile) => {
        console.log(profile)
      })
    }
  },
  computed: {
    avatar () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        if (profile.avatarUrl) {
          return (
            '<img style="width: 30px; height: 30px; border-radius: 20px;" src="' +
            profile.avatarUrl +
            '"/>'
          )
        }
      }
      return null
    },
    getPixelBackground () {
      return this.$store.getters[APP_CONSTANTS.KEY_PIXEL_BACKGROUND]
    },
    myAssets () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
        const assets = this.$store.getters[APP_CONSTANTS.KEY_ASSETS_BY_CONTRACT_ID_AND_OWNER]({ stxAddress: profile.stxAddress, contractId: STX_CONTRACT_ADDRESS })
        return assets
      }
      return null
    },
    getBreakLine () {
      return this.$store.getters[APP_CONSTANTS.KEY_BREAK_LINE]
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    },
    toggleIcon () {
      return this.collapsed ? this.grid : this.cross
    }
  }
}
</script>

<style lang="scss">
/* NAVBAR GENERAL STYLE */
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
