<template>
<div v-if="loopRun && application">
  <div class="d-flex justify-content-center" v-if="!parent">
    <div class="nav-bar bg-dark text-warning d-flex justify-content-between">
      <div>
        <span v-b-tooltip.hover="{ variant: 'warning' }" :title="'Your daily spin quota gives everyone equal opportunity to mine a lovely loop!'"><span class="">{{credits}}</span> more spins today</span>
      </div>
      <div v-if="limitReached">
        <span class="text-danger" router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Each run has unique elements that increase in scarcity with the expansion of each new version!'">
          Sorry, all minted for this run. Visit the <b-link class="text-info" to="/nft-marketplace">Marketplace</b-link>
        </span>
      </div>
      <div v-else>
        <span>
          <span class="text-warning mr-2" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Each run has unique elements that increase in scarcity with the expansion of each new version!'">{{loopRun.currentRun}}</span>
          <span class="text-xsmall" v-b-tooltip.hover="{ variant: 'warning' }" :title="nftsLeft + ' Loopbombs remain to be claimed in this run!'">{{nftsRemaining}} Minted (@{{mintPrice}} STX Each)</span>
        </span>
      </div>
    </div>
  </div>
  <div class="text-small" v-else-if="parent === 'minting'">
      <div v-if="limitReached">
        <span class="text-danger" router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Each run has unique elements that increase in scarcity with the expansion of each new version!'">
          Sorry, all minted for this run. Visit the <b-link class="text-info" to="/nft-marketplace">Marketplace</b-link>
        </span>
      </div>
      <div v-else>
        <div>
          <a class="text-warning" :href="origin + '/nft-marketplace/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey" target="_blank">{{loopRun.currentRun}}</a>
        </div>
        <div>
          Minting: {{mintPrice}} STX
        </div>
      </div>
  </div>
</div>
<div v-else>
  <div class="py-5 px-5 bg-white text-danger d-flex justify-content-center">
    <div v-if="loopRun">
      Expecting contract <span class="text-bold">{{loopRun.contractId}}</span> to be deployed and connected?
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
  props: ['parent', 'currentLoopRun'],
  data () {
    return {
      origin: location.origin
    }
  },
  mounted () {
    if (this.loopRun) {
      if (this.limitReached) {
        this.$emit('loopRun', { opcode: 'limit-reached' })
      }
    }
  },
  methods: {
  },
  computed: {
    mintPrice () {
      const defaultMintPrice = Number(process.env.VUE_APP_DEFAULT_MINT_PRICE)
      const mintPrice = Math.max(this.application.tokenContract.mintPrice, defaultMintPrice)
      return mintPrice
    },
    limitReached () {
      return (this.loopRun.versionLimit - this.mintCounter) <= 0
    },
    nftsLeft () {
      return this.loopRun.versionLimit - this.mintCounter
    },
    nftsRemaining () {
      return this.mintCounter + '/' + this.loopRun.versionLimit
    },
    credits () {
      if (this.loopRun) {
        const remaining = this.loopRun.spinsPerDay - this.loopRun.spinsToday
        return (remaining > 0) ? remaining : 0
      }
      return 0
    },
    mintCounter () {
      if (!this.application) return -1
      return Math.min(this.loopRun.versionLimit, this.loopRun.tokenCount)
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    loopRun () {
      if (this.currentLoopRun) return this.currentLoopRun
      const defaultLoopRun = process.env.VUE_APP_DEFAULT_LOOP_RUN
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](defaultLoopRun)
      return loopRun
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      return application
    }
  }
}
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
