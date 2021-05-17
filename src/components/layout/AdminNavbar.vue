<template>
  <div class="p-5">
    <b-navbar toggleable="md" class="p-5" fixed="top" type="dark" variant="black" style="height: 15vh;">
      <b-navbar-brand href="#"><b-link to="/"><img width="45px" :src="rainbowOne" /></b-link></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="text-white">
        <template #default="{ expanded }">
          <img width="60px" height="30px" class="text-white" v-if="expanded" :src="cross">
          <img width="60px" height="30px" class="text-white" v-else :src="grid">
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav align="center">

        <!-- Right aligned nav items -->
        <b-navbar-nav class="mx-auto mt-3 ">
          <b-nav-item v-if="loggedIn"><router-link class="text-white" to="/my-items/minted">NFT Library</router-link></b-nav-item>
          <b-nav-item v-if="loggedIn"><router-link class="text-white" to="/upload-item">Create NFT</router-link></b-nav-item>
          <b-nav-item v-if="loggedIn"><router-link class="text-white" to="/admin">Admin</router-link></b-nav-item>
          <b-nav-item v-if="!loggedIn"><b-link class="text-white" to="/admin" @click.prevent="startLogin">Login</b-link></b-nav-item>
          <b-nav-item v-else><b-link class="text-white" to="/admin" @click.prevent="logout">Logout</b-link></b-nav-item>
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
      rainbowOne: require('@/assets/img/Group 76.svg'),
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg')
    }
  },
  methods: {
    // test methods - just anticipating the design...
    headerClass () {
      return (this.$route.name === 'home' || this.$route.name === 'login') ? '' : 'header-class'
    },
    logout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        // localStorage.clear()
        // sessionStorage.clear()
        this.$router.push('/')
      })
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username
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
