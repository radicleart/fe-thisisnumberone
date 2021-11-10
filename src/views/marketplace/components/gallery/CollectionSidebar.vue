<template>
<div class="text-small">
  <div class="mb-5">
    <h3 class="mb-4 border-bottom pointer" @click="showSearch"><b-icon font-scale="0.8" v-if="showSearchFilters" icon="chevron-down"/> <b-icon font-scale="0.8" v-else icon="chevron-right"/> Search Filters</h3>
    <div v-if="showSearchFilters">
      <SearchBar v-on="$listeners" :displayClass="''" :mode="'search'"/>
    </div>
  </div>
  <div class="mb-5">
    <h3 class="border-bottom pointer mb-4" @click="showColls = !showColls"><b-icon font-scale="0.8" v-if="showColls" icon="chevron-down"/> <b-icon font-scale="0.8" v-else icon="chevron-right"/> Collections</h3>
    <div class="" v-if="showColls">
      <div class="ml-5 my-3" v-for="(loopRun, index) in allLoopRuns" :key="index">
        <p :class="isSelected(loopRun.currentRunKey)" v-if="loopRun.status !== 'disabled'" class="pointer" @click="showCollection(loopRun)">{{loopRun.currentRun}}</p>
      </div>
    </div>
  </div>
  <div v-if="canUpload()">
    <h3 class="border-bottom mb-4">Uploads</h3>
    <div class="ml-5 my-3">
      <h4 class="pointer" @click="showUploads()">manage</h4>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'
import SearchBar from '@/views/marketplace/components/gallery/SearchBar'

export default {
  name: 'CollectionSidebar',
  components: {
    SearchBar
  },
  props: ['allowUploads'],
  data () {
    return {
      loaded: false,
      showColls: true,
      showSearchFilters: false,
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
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return this.$route.name === 'my-nfts' && ((this.allowUploads && hasUploadPriv) || this.profile.superAdmin)
    },
    showSearch () {
      this.showSearchFilters = !this.showSearchFilters
      this.$emit('update', { opcode: 'show-search' })
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
    isSelected (runKey) {
      return (!this.showSearchFilters && this.$route.path.indexOf(runKey) > -1) ? 'text-warning' : ''
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
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
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
