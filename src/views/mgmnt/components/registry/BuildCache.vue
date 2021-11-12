<template>
<div>
<div>
  <h1>Tools for Building the Cache</h1>
  <p class="mt-4">The cache is a mirror of the contract data. It is stateless and can be built
    from scratch - not recommended in production as this is resource intensive action
    but in development it is useful.
  </p>
  <p class="mt-4">The cache is segmented by the projects/contracts connected to the
    registry (appmap.clar) contract. The cache tools follow this pattern and there
    are no tools which clear or rebuild the cache for all projects.
  </p>
  <p>Note: there are two caches - contract data cache and Meta Data cache.
    The latter is usually stored via users Gaia hubs. Urls to the meta data
    are stored in the contract.</p>
  <a href="#" class="mr-2 bg-warning px-3 text-info" @click.prevent="buildCacheAll">Build Cache</a>
  <div v-if="registry && registry.applications">
    <div class="row my-5" v-for="(application, index) in registry.applications" :key="index">
      <div class="col-2">Contract</div><div class="col-10 text-bold pb-3">{{application.contractId}}</div>
      <div class="col-2"></div>
      <div class="col-10">
        <div class="text-left mb-4">
          <a href="#" class="mr-2 bg-warning px-3 text-info" @click.prevent="buildCache(application.contractId)">Build Cache</a>
          <a href="#" class="mr-2 bg-warning px-3 text-info" @click.prevent="buildSearchIndex(application.contractId)">Build Meta Data</a>
          <a href="#" class="mr-2 bg-warning px-3 text-info" @click.prevent="clearCache(application.contractId)">Clear Cache</a>
          <a href="#" class="mr-2 bg-warning px-3 text-info" @click.prevent="clearSearchIndex(application.contractId)">Clear Meta Data</a>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
  </div>

</div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'BuildCache',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    buildSearchIndex: function (contractId) {
      this.$store.dispatch('rpayManageCacheStore/buildSearchIndex', contractId).then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    buildCacheAll: function () {
      this.$store.dispatch('rpayManageCacheStore/buildCacheAll').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    buildCache: function (contractId) {
      this.$store.dispatch('rpayManageCacheStore/buildCache', contractId).then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearSearchIndex: function (contractId) {
      this.$store.dispatch('rpayManageCacheStore/clearSearchIndex', contractId).then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    clearCache: function (contractId) {
      this.$store.dispatch('rpayManageCacheStore/clearCache', contractId).then((result) => {
        this.$notify({ type: 'success', title: 'clear indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'clear indexing', text: err })
      })
    }
  },
  computed: {
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      return registry
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-preview {
  padding: 10px;
  height: auto;
  border: 0pt dashed rgb(146, 146, 38);
  background-color: #FCFCFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 9px #00000029;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: normal;
}
</style>
