<template>
<div class="px-5" :class="headerClass()">
<b-navbar toggleable="lg" variant="transparent">
    <b-navbar-brand href="#">
      <div class="">
        <router-link to="/" class="navbar-brand"><img :src="logo"/></router-link>
      </div>
    </b-navbar-brand>
    <b-navbar-toggle class="" target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon width="20px" height="30px" v-if="expanded" icon="chevron-contract"></b-icon>
        <img width="20px" v-else :src="toggler"/>
      </template>
    </b-navbar-toggle>

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
.header-class {
  background: transparent linear-gradient(105deg, #FF0552 0%, #EC776B 100%) 0% 0% no-repeat padding-box;
}
</style>
