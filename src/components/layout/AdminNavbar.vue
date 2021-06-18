<template>
  <div class="" style="height: 100px;">
    <b-navbar toggleable="md" class="" fixed="top" type="dark" variant="transparent">
      <b-navbar-brand href="#"><b-link to="/"><img :src="logo" /></b-link></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="text-white">
        <template #default="{ expanded }">
          <img width="60px" height="30px" class="text-white" v-if="expanded" :src="cross">
          <img width="60px" height="30px" class="text-white" v-else :src="grid">
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav align="right">

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto mt-3">
          <b-nav-item v-if="loggedIn"><router-link class="mx-4 text-white" to="/my-items/minted">NFT Library</router-link></b-nav-item>
          <b-nav-item v-if="loggedIn"><router-link class="mx-4 text-white" to="/offers">Offers</router-link></b-nav-item>
          <b-nav-item v-if="loggedIn"><router-link class="mx-4 text-white" to="/upload-item">Create NFT</router-link></b-nav-item>
          <b-nav-item v-if="loggedIn"><router-link class="mx-4 text-white" to="/admin">Admin</router-link></b-nav-item>
          <b-nav-item v-if="!loggedIn && webWalletNeeded"><a class="mx-4 text-white" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></b-nav-item>
          <b-nav-item v-if="!loggedIn"><b-link class="mx-4 text-white logIn" to="/admin" @click.prevent="startLogin">Login</b-link></b-nav-item>
          <b-nav-item v-else><b-link class="mx-4 text-white logOut" to="/admin" @click.prevent="logout">Logout</b-link></b-nav-item>
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
      grid: require('@/assets/img/navbar-footer/grid.svg'),
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      webWalletNeeded: false
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
      }).catch((err) => {
        console.log(err)
        // https://www.hiro.so/wallet/install-web
        this.webWalletNeeded = true
      })
    }
  },
  computed: {
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
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

.logIn{
 border: 1px solid white;
  padding: 0px 15px;
}
.logIn:hover {
 border: 1px solid white;
  background: rgb(65, 65, 65);
  color: black;
}

.logOut{border: 1px solid white;
  padding: 0px 15px;

  }
.logOut:hover{
  border: 1px solid white;
  background: rgb(65, 65, 65);
  color: black;
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
