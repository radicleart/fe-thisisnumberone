<template>
<!--
<div>
  <about-section1 :content="content"></about-section1>
</div>
-->
<b-container fluid id="number-one-section" class="mt-5 pt-2" v-if="content">
  <b-row class="mt-2 pt-5 center" align-h="center" style="'min-height: 80vh'">
    <b-col lg="6" md="12" class="text-center">
      <div><img :src="rainbowOne" width="300rem;"/></div>
      <PrismicItems v-if="content" class="mt-5 mx-2 text-center" :prismicItems="content.newhometext"></PrismicItems>
    </b-col>
    <b-col lg="6" md="12" style="min-height: 400px;" class="text-center m-0 p-0 pl-4">
      <b-row style="height: 100%;">
        <b-col cols="6" class="p-0 px-2">
          <div class="border text-center " id="container">
            <div id="content">
              <h3><b-link to="/nft-marketplace">Artists & Collections</b-link></h3>
            </div>
          </div>
        </b-col>
        <b-col cols="6" class="p-0 px-2">
          <div class="border text-center " id="container">
            <div id="content">
              <h3><b-link to="/nft-marketplace">Marketplace</b-link></h3>
            </div>
          </div>
        </b-col>
        <b-col cols="6" class="p-0 px-2 mt-3">
          <div class="border text-center " id="container">
            <div id="content">
              <div v-if="profile.loggedIn"><h3><b-link :to="'/my-nfts/' + loopRun.currentRunKey">My NFTs</b-link></h3></div>
              <div v-else><h3><b-link :to="'/my-nfts/' + loopRun.currentRunKey">Login</b-link></h3></div>
            </div>
          </div>
        </b-col>
        <b-col cols="6" class="p-0 px-2 mt-3">
          <div class="border text-center " id="container">
            <div id="content">
              <h3><b-link to="/about">WTF?</b-link></h3>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Homepage',
  components: {
    PrismicItems
  },
  data () {
    return {
      rainbowOne: require('@/assets/img/Group 76.svg')
    }
  },
  mounted () {
    // this.findAssets()
  },
  methods: {
    findAssets () {
      // const pid = STX_CONTRACT_NAME.split('-')[0]
      // this.$store.dispatch('rpayStacksContractStore/fetchContractDataFirstEditions').then(() => {
      // this.resultSet = results
      this.loaded = true
      // })
    }
  },
  computed: {
    loopRun () {
      let loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.runKey)
      if (!loopRun) {
        loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](process.env.VUE_APP_DEFAULT_LOOP_RUN)
      }
      return loopRun
    },
    runKey () {
      const defaultLoopRun = process.env.VUE_APP_DEFAULT_LOOP_RUN
      let runKey = (this.item && this.item.currentRunKey) ? this.item.currentRunKey : defaultLoopRun
      if (runKey.indexOf('/') > -1) {
        runKey = runKey.split('/')[0]
      }
      return runKey
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    }
  }
}
</script>

<style scoped>
#container {
  border: 1pt solid white;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#content {
  flex: 0 0 120px;
}
</style>
