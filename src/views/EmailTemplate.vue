<template>
<div id="etemplate" class="px-5">
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
      webWalletNeeded: false
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
