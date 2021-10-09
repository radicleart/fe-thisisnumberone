<template>
<div v-if="loaded">
  <Banner/>
  <div>
    <b-container>
      <h1 class="my-5 text-white">#1 NFT Marketplace</h1>
      <b-row>
        <b-col cols="2">
          <h2 class="">Projects</h2>
          <div v-for="(application, index) in applications" :key="index" class="mb-5">
            <div @click="contractId = application.contractId">
              <img width="100%" :src="getImageUrl(application.project)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'View Collections for Contract\n' + application.contractId"/>
            </div>
            <div class="text-small d-flex justify-content-between">
              <div>{{application.project.title}}</div>
              <div><b-link :href="application.project.platformAddress" target="_blank" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Visit project website.'"><b-icon icon="arrow-up-right-square"/></b-link></div>
            </div>
          </div>
        </b-col>
        <b-col cols="8">
          <b-row>
            <b-col class="text-center">
              <h2 class="">Collections</h2>
              <h4 class="mb-5">{{contractId}}</h4>
              <div v-for="(loopRun, index) in loopRunsByProject()" :key="index" class="mb-3">
                <div>
                  <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">
                    <img width="150px" :src="getImageUrl(loopRun)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
                  </b-link>
                </div>
                <div>{{loopRun.currentRun}}</div>
                <div class="text-small"><span class="text-warning">{{loopRun.tokenCount}} / {{loopRun.versionLimit}}</span></div>
                <div class="text-small">by: <span class="text-warning">{{loopRun.makerName}}</span></div>
                <div class="text-small">URL: <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.makerUrlKey + '/' + loopRun.currentRunKey}}</b-link></div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Banner from '@/views/marketplace/components/gallery/common/Banner'

export default {
  name: 'NftMarketplace',
  components: {
    Banner
  },
  data () {
    return {
      loaded: false,
      applications: [],
      loopRuns: [],
      contractId: null,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.fetchFullRegistry()
    this.fetchCollections()
  },
  methods: {
    loopRunsByProject () {
      return this.loopRuns.filter((o) => o.contractId === this.contractId)
    },
    getImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    },
    fetchFullRegistry () {
      this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
        this.contractId = registry.applications[0].contractId
        this.$store.dispatch('rpayProjectStore/fetchProjects').then((projects) => {
          registry.applications.forEach((application) => {
            const project = projects.find((o) => o.contractId === application.contractId)
            application.project = project || {}
            this.applications.push(application)
            this.loaded = true
          })
        })
      })
    },
    fetchCollections () {
      this.$store.dispatch('rpayCategoryStore/fetchLoopRuns').then((loopRuns) => {
        this.makerUrlKey = loopRuns[0].makerUrlKey
        this.currentRunKey = loopRuns[0].currentRunKey
        this.loopRuns = loopRuns
      })
    }
  },
  computed: {
  }
}
</script>
