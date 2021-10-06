<template>
<div>
  <div class="bg-danger text-white text-center">
    <p class="pt-3">Alpha Test: <span class="text-bold">DO NOT BUY</span> as you’ll lose your NFT. The official release of Collections on ThisIsNumberOne is SOON!</p>
    <p class="pb-3 text-warning">All NFTs minted in this run will be burned baby!</p>
  </div>
  <div class="my-5">
    <h1 class="text-white">#1 NFT Marketplace</h1>
    <b-container fluid>
      <b-row>
        <b-col cols="4">
          <div v-for="(application, index) in applications" :key="index" class="mb-3">
            <div>
              <img width="150px" :src="application.project.imageUrl"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Contract\n' + application.contractId"/>
            </div>
            {{application.project.title}}
          </div>
        </b-col>
        <b-col cols="4">
          <div v-for="(loopRun, index) in loopRuns" :key="index" class="mb-3">
            <div>
              <img width="150px" :src="loopRun.imageUrl"  v-b-tooltip.hover="{ variant: 'warning' }" :title="'Contract\n' + application.contractId"/>
            </div>
            {{application.project.title}}
          </div>
        </b-col>
        <b-col cols="4">
          <PageableItems/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</div>
</template>

<script>
import PageableItems from '@/views/marketplace/components/gallery/PageableItems'

export default {
  name: 'NftMarketplace',
  components: {
    PageableItems
  },
  data () {
    return {
      applications: [],
      loopRuns: []
    }
  },
  mounted () {
    this.fetchFullRegistry()
    this.fetchCollections()
  },
  methods: {
    fetchFullRegistry () {
      this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
        this.$store.dispatch('rpayProjectStore/fetchProjects').then((projects) => {
          registry.applications.forEach((application) => {
            const project = projects.find((o) => o.contractId === application.contractId)
            application.project = project || {}
            this.applications.push(application)
          })
        })
      })
    },
    fetchCollections () {
      this.$store.dispatch('rpayCategoryStore/fetchLoopRunsForContract').then((loopRuns) => {
        this.loopRuns = loopRuns
      })
    }
  },
  computed: {
  }
}
</script>
