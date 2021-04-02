<template>
<div id="one-nav" class="px-5" @mouseover="transme" @mouseout="transbackme">
<b-navbar toggleable="lg" variant="transparent">
    <b-navbar-brand href="#">
      <div class="">
        <router-link to="/" class="navbar-brand"><img :src="logo"/></router-link>
      </div>
    </b-navbar-brand>
    <b-navbar-toggle class="" target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon class="text-white" width="40px" height="40px" v-if="expanded" icon="grid-fill"></b-icon>
        <b-icon class="text-white" width="40px" height="40px" v-else icon="grid"></b-icon>
      </template>
    </b-navbar-toggle>
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
    <b-collapse id="nav-collapse" is-nav align="end">
        <b-navbar-nav class="ml-auto" is-nav>
          <b-nav-item><router-link class="text-white" to="/how-it-works">How It Works</router-link></b-nav-item>
          <b-nav-item><router-link class="text-white" to="/upload-item">Protect Your Music</router-link></b-nav-item>
          <b-dropdown right v-if="loggedIn" size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
              <b-icon scale="1.5" class="text-white" icon="person"/><span class="sr-only">Account</span>
            </template>
            <b-dropdown-item>{{username()}}</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item><router-link class="text-dark" to="/profile">My Profile</router-link></b-dropdown-item>
            <b-dropdown-item><router-link class="text-dark" to="/my-items">My Items</router-link></b-dropdown-item>
            <b-dropdown-item><router-link class="text-dark" to="/admin">Admin</router-link></b-dropdown-item>
            <b-dropdown-item><span @click="logout()">Logout</span></b-dropdown-item>
          </b-dropdown>
          <b-nav-item v-else><b-button variant="light" @click.prevent="startLogin()">Login</b-button></b-nav-item>
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
      toggler: require('@/assets/img/navbar/Icon_ionic-md-options.svg'),
      // logo: require('@/assets/img/sticksnstones_logo.png'),
      logo: 'https://images.prismic.io/risidio-journal/b4154a9e-2f1e-433e-b95f-fbd403dc866a_risidio_white1.png?auto=compress,format'
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
      this.$store.dispatch('authStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username
    },
    startLogin () {
      this.$store.dispatch('authStore/startLogin')
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
    }
  }
}
</script>

<style lang="scss">
/* NAVBAR PADDING AND WIDTH */
.navbar-light .navbar-nav .nav-link {
    color: #fff;
}
/**
#nav-collapse {
  position: absolute;
  height: 80vh;
  width: 1000px;
  left: -100px;
  right: 100px;
  margin-left: calc(-100vw / 2 + 940px / 2);
  margin-right: calc(-100vw / 2 + 940px / 2);
  background-color: rgb(223, 166, 82);
  color: #fff !important;
  top: 100px;
  padding: 50px;
  text-align: center;
  z-index: 3;
}
#nav-collapse a {
  color: #000;
}
**/
</style>
