<template>
<div v-if="loaded">
  <Banner/>
  <div>
    <b-container>
      <b-row>
        <b-col cols="2">
          <h2 class="">Marketplace</h2>
          <div v-for="(project, index) in projects" :key="index" class="mb-5">
            <div @click="contractId = project.contractId">
              <img width="100%" :src="getImageUrl(project)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'View Collections for Contract\n' + project.contractId"/>
            </div>
            <div class="text-small d-flex justify-content-between">
              <div>{{projectId(project)}}</div>
              <div><b-link :href="project.platformAddress" target="_blank" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Visit project website.'"><b-icon icon="arrow-up-right-square"/></b-link></div>
            </div>
          </div>
        </b-col>
        <b-col cols="10">
          <b-row>
            <b-col class="text-center">
              <h2 class="">Collections</h2>
              <h4 class="mb-5">{{contractId}}</h4>
              <div class="d-flex justify-content-start">
              <div v-for="(loopRun, index) in loopRunsByProject" :key="index" class="mb-3">
                  <div class="mb-3 mx-5">
                    <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">
                      <img height="150px" :src="getImageUrl(loopRun)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
                    </b-link>
                  </div>
                  <div>{{loopRun.currentRun}}</div>
                  <div class="text-small"><b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'View collection in marketplace.'">{{loopRun.tokenCount}} / {{loopRun.versionLimit}}</span></b-link></div>
                  <div class="text-small">by: <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Mint new pieces in this collection.'">{{loopRun.makerName}}</span></b-link></div>
                </div>
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
import utils from '@/services/utils'

export default {
  name: 'NftMarketplace',
  components: {
    Banner
  },
  data () {
    return {
      loaded: false,
      projects: [],
      loopRuns: [],
      contractId: null,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.fetchFullRegistry()
  },
  methods: {
    projectId (project) {
      try {
        return project.contractId.split('.')[1] // + project.application.tokenContract.mintCounter
      } catch (e) {
        return project.title
      }
    },
    getImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    },
    fetchFullRegistry () {
      this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then(() => {
        this.$store.dispatch('rpayProjectStore/fetchProjectsByStatus', 'active').then((projects) => {
          projects.forEach((p) => {
            const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](p.contractId)
            p.application = application
          })
          this.projects = utils.sortResults(projects)
          this.$store.dispatch('rpayCategoryStore/fetchLoopRuns').then((loopRuns) => {
            this.makerUrlKey = loopRuns[0].makerUrlKey
            this.currentRunKey = loopRuns[0].currentRunKey
            this.contractId = loopRuns[0].contractId
            this.loopRuns = loopRuns
            this.loaded = true
          })
        })
      })
    }
  },
  computed: {
    loopRunsByProject () {
      return this.loopRuns.filter((o) => o.contractId === this.contractId)
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      return application
    }
  }
}
</script>
