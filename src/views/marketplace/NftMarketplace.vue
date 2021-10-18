<template>
<div v-if="loaded">
  <b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row>
      <b-col md="4" sm="12">
        <h1 class="border-bottom mb-5">Marketplace</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="8" sm="12">
        <h1 class="mb-4 border-bottom">Collections</h1>
        <b-row>
          <b-col md="3" sm="6" xs="12" v-for="(loopRun, index) in loopRuns" :key="index">
            <div>
              <b-link class="text-warning" :to="collectionUrl(loopRun)">
                <img width="100%" :src="getImageUrl(loopRun)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
              </b-link>
            </div>
            <div class="py-3 border">
              <div class="text-center text-small"><b-link :to="collectionUrl(loopRun)">{{loopRun.currentRun}}</b-link></div>
              <!--
              <div class="text-small"><b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'View collection in marketplace.'">{{loopRun.tokenCount}} / {{loopRun.versionLimit}}</span></b-link></div>
              <div class="text-small">by: <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Mint new pieces in this collection.'">{{loopRun.makerName}}</span></b-link></div>
              -->
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import Banner from '@/views/marketplace/components/gallery/common/Banner'
import utils from '@/services/utils'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'

export default {
  name: 'NftMarketplace',
  components: {
    CollectionSidebar
  },
  data () {
    return {
      loaded: false,
      projects: [],
      loopRuns: [],
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.fetchFullRegistry()
  },
  methods: {
    update (data) {
      if (data.opcode === 'show-uploads') {
        this.showUploads = true
      } else if (data.opcode === 'show-collection') {
        this.showUploads = false
        this.loopRun = data.loopRun
        this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      }
    },
    collectionUrl (loopRun) {
      if (loopRun.type === 'punk') {
        return '/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey
      } else {
        return '/nft-marketplace/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey
      }
    },
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
      const $self = this
      this.$store.dispatch('rpayProjectStore/fetchProjectsByStatus', 'active').then((projects) => {
        $self.projects = utils.sortResults(projects)
        $self.loopRuns = this.allLoopRuns
        $self.projects.forEach((p) => {
          const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](p.contractId)
          p.application = application
          // $self.loopRuns.concat(loopRuns.filter((o) => o.contractId === p.contractId))
        })
        $self.loaded = true
      })
    }
  },
  computed: {
    allLoopRuns () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUNS]
      return loopRuns
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      return application
    }
  }
}
</script>
