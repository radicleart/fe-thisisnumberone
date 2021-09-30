<template>
<div v-if="loopRun && application">
  <div class="d-flex justify-content-center" v-if="!parent">
    <div class="nav-bar bg-dark text-warning d-flex justify-content-between">
      <div>
        <span v-b-tooltip.hover="{ variant: 'warning' }" :title="'Your daily spin quota gives everyone equal opportunity to mine a lovely loop!'"><span class="">{{credits}}</span> more spins today</span>
      </div>
      <div v-if="limitReached">
        <span class="text-danger" router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Each LoopRun is its own limited set and features the artwork of different contemporary artists!'">
          Sorry, all Loopbomb STX V1 are minted for this run. Visit the <b-link class="text-info" to="/nft-marketplace">Marketplace</b-link>
        </span>
      </div>
      <div v-else>
        <span>
          <span class="text-warning mr-2" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Each LoopRun is its own limited set and features the artwork of different contemporary artists!'">{{loopRun.currentRun}}</span>
          <span class="text-xsmall" v-b-tooltip.hover="{ variant: 'warning' }" :title="nftsLeft + ' Loopbombs remain to be claimed in this run!'">{{nftsRemaining}} Minted (@{{application.tokenContract.mintPrice}} STX Each)</span>
        </span>
      </div>
    </div>
  </div>
  <div class="mt-5" v-else-if="parent === 'minting'">
    <div>
      Collection: <a class="text-info" :href="origin + '/nft-marketplace/' + loopRun.currentRunKey" target="_blank">{{loopRun.currentRun}}</a>
    </div>
    <div>
       Minting Fee: {{application.tokenContract.mintPrice}} STX
    </div>
  </div>
</div>
<div v-else>
  <div class="py-5 px-5 bg-white text-danger d-flex justify-content-center">
    <div>
      Expecting Loopbomb contract <span class="text-bold">{{contractName}}</span> to be deployed and connected?
    </div>
  </div>
</div>
</template>
<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'LoopRun',
  components: {
  },
  props: ['parent'],
  data () {
    return {
      origin: location.origin,
      contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME
    }
  },
  mounted () {
    if (this.loopRun) {
      const runKey = this.loopRun.currentRunKey
      this.$store.dispatch('rpayCategoryStore/fetchMintCountForCollection', runKey)
    }
  },
  methods: {
  },
  computed: {
    limitReached () {
      return (this.loopRun.versionLimit - this.mintCounter) <= 0
    },
    nftsLeft () {
      return this.loopRun.versionLimit - this.mintCounter
    },
    nftsRemaining () {
      return this.mintCounter + '/' + this.loopRun.versionLimit
    },
    credits() {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN]
      if (loopRun) {
        const remaining = loopRun.spinsPerDay - loopRun.spinsToday
        return (remaining > 0) ? remaining : 0
      }
      return 0
    },
    mintCounter () {
      if (!this.application) return -1
      return Math.min(this.loopRun.versionLimit, this.application.tokenContract.mintCounter)
    },
    profile() {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    loopRun() {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN]
      return loopRun
    },
    application() {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application
    }
  },
};
</script>
<style scoped>
.nav-bar {
  height: 30px;
  padding: 0.3rem 15px;
  margin: 0 1rem 0 1rem;
  min-height: 30px;
  font-size: 1.0rem;
  width: 1024px;
}
</style>
