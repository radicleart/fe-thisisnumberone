<template>
<div class="text-small">
  <h3 class="border-bottom pointer" @click="showColls = !showColls">Collections <b-icon v-if="showColls" icon="chevron-down"/> <b-icon v-else icon="chevron-right"/></h3>
  <div v-for="(project, index) in projects" :key="index" class="mb-5">
    <!--
    <div @click="contractId = project.contractId">
      <img width="100%" :src="getImageUrl(project)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'View Collections for Contract\n' + project.contractId"/>
    </div>
    <div class="text-small d-flex justify-content-between">
      <div>{{projectId(project)}}</div>
      <div><b-link :href="project.platformAddress" target="_blank" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Visit project website.'"><b-icon icon="arrow-up-right-square"/></b-link></div>
    </div>
     -->
    <div class="" v-if="showColls">
      <div class="ml-5 my-3" v-for="(loopRun, index) in loopRunsByProject" :key="index">
        <!--
        <div class="mb-3 mx-5">
          <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">
            <img height="150px" :src="getImageUrl(loopRun)"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
          </b-link>
        </div>
        <div class="text-small"><b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'View collection in marketplace.'">{{loopRun.tokenCount}} / {{loopRun.versionLimit}}</span></b-link></div>
        <div class="text-small">by: <b-link class="text-warning" :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey"><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Mint new pieces in this collection.'">{{loopRun.makerName}}</span></b-link></div>
        -->
        <h4 v-if="project.contractId === loopRun.contractId" class="pointer" @click="showCollection(loopRun)">{{loopRun.currentRun}}</h4>
      </div>
    </div>
  </div>
  <div v-if="canUpload()">
    <h3 class="border-bottom mt-5">Uploads</h3>
    <div class="ml-5 my-3">
      <h4 class="pointer" @click="showUploads()">manage</h4>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

export default {
  name: 'CollectionSidebar',
  components: {
  },
  props: ['allowUploads'],
  data () {
    return {
      loaded: false,
      showColls: true,
      projects: [],
      contractId: null,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.fetchFullRegistry()
  },
  methods: {
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return this.allowUploads && hasUploadPriv
    },
    showCollection (loopRun) {
      this.$emit('update', { opcode: 'show-collection', loopRun: loopRun })
    },
    showUploads () {
      this.$emit('update', { opcode: 'show-uploads' })
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
      this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then(() => {
        this.$store.dispatch('rpayProjectStore/fetchProjectsByStatus', 'active').then((projects) => {
          projects.forEach((p) => {
            const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](p.contractId)
            p.application = application
          })
          this.projects = utils.sortResults(projects)
          this.makerUrlKey = this.loopRuns[0].makerUrlKey
          this.currentRunKey = this.loopRuns[0].currentRunKey
          this.contractId = this.loopRuns[0].contractId
          /**
          this.$store.dispatch('rpayCategoryStore/fetchLoopRuns').then((loopRuns) => {
            this.makerUrlKey = loopRuns[0].makerUrlKey
            this.currentRunKey = loopRuns[0].currentRunKey
            this.contractId = loopRuns[0].contractId
            this.loopRuns = loopRuns
            this.loaded = true
          })
          **/
        })
      })
    }
  },
  computed: {
    loopRunsByProject () {
      return this.loopRuns.filter((o) => o.contractId === this.contractId)
    },
    loopRuns () {
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
