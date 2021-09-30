<template>
<b-row style="min-height: 30vh" class="text-center" v-if="loggedIn">
  <b-col cols="12" v-if="getBalance > 0">
    <p>You have {{getBalance}} STX tokens in this account - more than enough to pay the
      mint fees!</p>
    <p><b-button variant="outline-success" to="/upload-item">Upload and Mint Your NFTs</b-button></p>
  </b-col>
  <b-col cols="12" v-else>
    <p>Minting NFT's requires a tiny amount of STX - get some now?</p>
    <p><b-button variant="outline-warning" @click="gotoStacksMateUrl">Get some STX</b-button></p>
    <p class="mt-5">Get STX later - uploading files is completely free</p>
    <p><b-button variant="outline-success" to="/upload-item">Upload Files</b-button></p>
  </b-col>
</b-row>
<b-row style="min-height: 30vh" class="text-center" v-else-if="webWalletNeeded">
  <b-col cols="12">You need to download the web wallet to login and start minting your very own NFTs!</b-col>
  <b-col cols="12"><a class="pointer mx-4" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></b-col>
</b-row>
<b-row style="min-height: 30vh" class="text-center" v-else>
  <b-col cols="12">Login / download the Stacks Wallet to get started</b-col>
</b-row>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WalletStates',
  components: {
  },
  data: function () {
    return {
      nftState: 0
    }
  },
  mounted () {
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    if (profile.loggedIn) {
      // this.$router.push('/upload-item')
      this.nftState = 3
    } else {
      this.nftState = 1
    }
  },
  methods: {
    gotoStacksMateUrl: function () {
      location.href = this.getStacksMateUrl
    }
  },
  computed: {
    getBalance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.accountInfo) ? profile.accountInfo.balance : 0
    },
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
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    }
  }
}
</script>

<style>
</style>
