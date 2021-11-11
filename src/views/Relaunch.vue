<template>
<b-container style="width:100%" class="mt-4 text-center">
  <b-row class="vh-100 text-center" align-v="center">
    <b-col>
      <img style="width:65%; padding-bottom:20px" src="https://images.prismic.io/dbid/2ad7e97c-417a-4c24-bfa1-91a2a0be391e_WTF2_1200.gif?auto=compress,format" />
      <p style="width:100%;" class="border-bottom">A CURATED GALLERY OF NFTS SECURED ON BITCOIN VIA STACKS.</p>
      <p style="width:100%;">NEW SHIT COMING SOON. <span class="text-warning">CLICK HERE</span> TO GET WORD ON THE DROP.</p>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Relaunch',
  components: {
  },
  data () {
    return {
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
</style>
