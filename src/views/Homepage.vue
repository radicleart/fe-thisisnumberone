<template>
<b-container fluid id="number-one-section" class="mt-5 pt-5">
  <b-row class="mt-5 pt-5 center" align-h="center" style="'min-height: 80vh'">
    <b-col class="text-center">
      <div><img :src="rainbowOne" width="300rem;"/></div>
      <!-- <PrismicItems v-if="content && !artistId" class="mx-5 text-center" :prismicItems="content.splashtext"/> -->
      <div class="mt-5">{{content}}</div>
    </b-col>
    <b-col class="text-center m-0 p-0 pl-4">
      <b-row class="mt-5">
        <b-col cols="5" class="mr-3 border p-2 text-center">
          <div class="mt-3 px-4 py-5"><h3><b-link to="/nft-marketplace">Artists & Collections</b-link></h3></div>
        </b-col>
        <b-col cols="5" class="border p-2 text-center">
          <div class="mt-3 px-4 py-5"><h3><b-link to="/nft-marketplace">Marketplace</b-link></h3></div>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col cols="5" class="mr-3 border p-2 text-center">
          <div v-if="profile.loggedIn" class="mt-3 px-4 py-5"><h3><b-link to="/my-nfts">My NFTs</b-link></h3></div>
        </b-col>
        <b-col cols="5" class="border p-2 text-center">
          <div class="mt-3 px-4 py-5"><h3><b-link to="/about">WTF?</b-link></h3></div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
// import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'Homepage',
  components: {
    // PrismicItems
  },
  data () {
    return {
      rainbowOne: require('@/assets/img/Group 76.svg')
    }
  },
  mounted () {
    this.findAssets()
  },
  methods: {
    findAssets () {
      // const pid = STX_CONTRACT_NAME.split('-')[0]
      this.$store.dispatch('rpayStacksContractStore/fetchContractDataFirstEditions').then(() => {
        // this.resultSet = results
        this.loaded = true
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    content () {
      // const content = this.$store.getters['contentStore/getHomepage']
      return 'The artist Chemical X presents a curated collection of unique NFT artworks, made in collaboration with iconic figures from the Arts and built on Bitcoin via the Stacks Blockchain.'
    }
  }
}
</script>

<style>
</style>
