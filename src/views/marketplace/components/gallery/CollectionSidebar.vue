<template>
<div class="text-small">
  <div class="mb-5" v-if="isMyNfts()">
    <h3 class="border-bottom mb-4">My Wallet</h3>
    <div class="ml-5 my-3">
      <h4 class="pointer" @click="showNftWallet()">all my nfts</h4>
    </div>
  </div>
  <div class="mb-5">
    <h3 class="border-bottom pointer mb-4" @click="showColls = !showColls"><b-icon font-scale="0.8" v-if="showColls" icon="chevron-down"/> <b-icon font-scale="0.8" v-else icon="chevron-right"/> #1 Collections</h3>
    <div class="" v-if="showColls">
      <div class="ml-5 my-3" v-for="(loopRun, index) in allLoopRuns" :key="index">
        <p :class="isSelected(loopRun.currentRunKey)" v-if="loopRun.status !== 'disabled'" class="pointer" @click="showCollection(loopRun)">{{loopRun.currentRun}}</p>
      </div>
    </div>
  </div>
  <div v-if="canUpload()">
    <h3 class="border-bottom mb-4">Uploads</h3>
    <div class="ml-5 my-3">
      <h4 class="pointer" @click="showUploads()">all uploads</h4>
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
      if (this.profile.exhibitRequest && this.profile.exhibitRequest.status === 2) return true
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return this.$route.name === 'my-nfts' && ((this.allowUploads && hasUploadPriv) || this.profile.superAdmin)
    },
    isMyNfts () {
      return this.$route.name === 'my-nfts'
    },
    showNftWallet () {
      this.$emit('update', { opcode: 'show-wallet-nfts' })
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
      return (this.$route.path.indexOf('/' + runKey) > -1) ? 'text-warning' : ''
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
