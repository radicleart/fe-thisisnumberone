<template>
<div id="one-nav" class="px-2" @mouseover="transme" @mouseout="transbackme">
<b-navbar variant="transparent">
  <b-navbar-brand href="#">
    <div class="">
      <router-link to="/" class="navbar-brand"><img :src="logo" alt="logo"/></router-link>
    </div>
  </b-navbar-brand>
  <b-navbar-nav class="ml-auto toggle-icon">
    <b-nav-item v-b-toggle.collapse @click="collapsed = !collapsed, noScroll()">
      <img style="width: 40px; height: 40px;" :src="toggleIcon">
    </b-nav-item>
  </b-navbar-nav>

<!--
    <b-collapse id="nav-collapse" is-nav align="end">
        <b-navbar-nav class="ml-auto" is-nav>
          <b-nav vertical>
            <b-nav-item class="mb-5"><router-link class="text-black" to="/how-it-works">How It Works</router-link></b-nav-item>
            <b-nav-item class="mb-5"><router-link class="text-black" to="/upload-item">Protect Your Music</router-link></b-nav-item>
            <b-nav-item class="mb-5" v-if="loggedIn"><router-link class="text-black" to="/profile">My Profile</router-link></b-nav-item>
            <b-nav-item class="mb-5" v-if="loggedIn"><router-link class="text-black" to="/my-items">My Items</router-link></b-nav-item>
            <b-nav-item class="mb-5" v-if="loggedIn"><span @click="logout()">Logout</span></b-nav-item>
            <b-nav-item class="mb-5" v-if="!loggedIn"><b-button variant="light" @click.prevent="startLogin()">Login</b-button></b-nav-item>
        </b-nav>
        </b-navbar-nav>
    </b-collapse>
    -->

    <b-collapse id="collapse" :style="'background-image: url(' + background + ')'">
      <b-navbar-nav class="top-content">
        <b-navbar-brand v-b-toggle.collapse @click="noScroll()" class="mr-0" href="#">
          <div class="">
            <router-link to="/" class="navbar-brand mr-0"><img :src="logo" alt="logo"/></router-link>
          </div>
        </b-navbar-brand>
        <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="/how-it-works">About</router-link></b-nav-item>
        <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="/upload-item">News</router-link></b-nav-item>
        <b-dropdown right v-if="loggedIn" size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <b-icon scale="1.5" icon="person"/><span class="sr-only">Account</span>
          </template>
          <b-dropdown-item>{{username()}}</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item v-b-toggle.collapse @click="noScroll()"><router-link class="text-dark" to="/profile">My Profile</router-link></b-dropdown-item>
          <b-dropdown-item v-b-toggle.collapse @click="noScroll()"><router-link class="text-dark" to="/my-items">My Items</router-link></b-dropdown-item>
          <b-dropdown-item v-b-toggle.collapse @click="noScroll()"><router-link class="text-dark" to="/admin">Admin</router-link></b-dropdown-item>
          <b-dropdown-item v-b-toggle.collapse @click="noScroll()"><span @click="logout()">Logout</span></b-dropdown-item>
        </b-dropdown>
        <b-nav-item v-else><b-button variant="light" @click.prevent="startLogin()">Login</b-button></b-nav-item>
      </b-navbar-nav>

      <div class="break-line"><img :src="line"></div>

      <b-navbar-nav class="bottom-content">
        <div class="bottom-content--container">
          <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="#">Collaborate</router-link></b-nav-item>
          <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="#">Get In Touch</router-link></b-nav-item>
        </div>
        <div class="bottom-content--container">
          <b-nav-item><b-icon width="27px" height="27px" icon="facebook"></b-icon></b-nav-item>
          <b-nav-item><b-icon width="27px" height="27px" icon="instagram"></b-icon></b-nav-item>
          <b-nav-item><b-icon width="27px" height="27px" icon="twitter"></b-icon></b-nav-item>
        </div>
        <div class="bottom-content--container">
          <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="#">Stacks Foundation</router-link></b-nav-item>
          <b-nav-item v-b-toggle.collapse @click="noScroll()"><router-link to="#">Risidio</router-link></b-nav-item>
        </div>
      </b-navbar-nav>
    </b-collapse>

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
      background: require('@/assets/img/navbar-footer/main-navbar-BG.svg'),
      line: require('@/assets/img/navbar-footer/break-line.svg'),
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      collapsed: true
    }
  },
  methods: {
    // test methods - just anticipating the design...
    transme () {
      const nav = document.getElementById('one-nav')
      if (nav) nav.style.depth = '100px'
    },
    transbackme () {
      const nav = document.getElementById('one-nav')
      if (nav) nav.style.depth = '100px'
    },
    headerClass () {
      return (this.$route.name === 'home' || this.$route.name === 'login' || this.$route.name === 'how-it-works') ? '' : 'header-class'
    },
    logout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username
    },
    startLogin () {
      this.$store.dispatch('rpayAuthStore/startLogin')
    },
    noScroll () {
      document.body.classList.toggle('no-scroll')
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
  font-size: 35px;
}
#collapse .top-content {
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-top: 91px;
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
  font-size: 14px;
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
  #collapse .top-content {
    padding-top: 60px;
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
    font-size: 30px;
  }
}

</style>
