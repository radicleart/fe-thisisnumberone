<template>
<div v-if="loopRun && loopRun.status !== 'disabled'">
  <b-container :key="componentKey" fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row id="video-column">
      <b-col md="3" sm="12">
        <h1 class="border-bottom mb-5">All Collections</h1>
        <CollectionSidebar @updateResults="updateResults" :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="9" sm="12">
        <div v-if="!showSearch">
          <h1 class="mb-4 border-bottom">{{loopRun.currentRun}}</h1>
          <b-row class="mb-4" align-v="stretch" style="min-height: 150px;" v-if="showCollectionData">
            <b-col cols="3" class="">
              <div class="d-flex justify-content-start">
                <img width="100%" :src="getCollectionImageUrl(loopRun)" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
              </div>
            </b-col>
            <b-col cols="9" class="" align-self="end">
                <div class="">
                  <div v-if="loopRun.type === 'punks'"><b-link :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.versionLimit - loopRun.tokenCount}} still available</b-link></div>
                  <div v-else>{{numbTokens}} artworks</div>
                  <div>by: <span class="text-warning">{{loopRun.makerName}}</span></div>
                </div>
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <div class="mb-4 border-bottom d-flex justify-content-between">
                <h1 class="">NFTs</h1>
                <div><SearchBar :displayClass="'text-small d-flex justify-content-end'" @updateResults="updateResults" :mode="loopRun.type"/></div>
              </div>
            </b-col>
          </b-row>
        </div>
        <div :key="searchKey" class="mb-4" v-if="loopRun && (loopRun.status === 'unrevealed' || loopRun.status === 'active' || loopRun.status === 'inactive')">
          <PageableItems @tokenCount="tokenCount" :defQuery="defQuery" :loopRun="loopRun"/>
        </div>
        <div class="mb-4" v-else-if="loopRun && loopRun.status === 'unrevealed'">
          <p v-if="loopRun.type === 'punks'"><b-link :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.currentRun}} artwork available - mint here!</b-link></p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
<b-container v-else>
  Collection not found.
  <span v-if="loopRun && loopRun.status === 'disabled'">This collection can't be shown at the present time.</span>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PageableItems from '@/views/marketplace/components/gallery/PageableItems'
import SearchBar from '@/views/marketplace/components/gallery/SearchBar'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import Vue from 'vue'

export default {
  name: 'NftCollection',
  components: {
    PageableItems,
    SearchBar,
    CollectionSidebar
  },
  watch: {
    '$route' () {
      this.makerUrlKey = this.$route.params.maker
      this.currentRunKey = this.$route.params.collection
      this.componentKey++
    }
  },
  data () {
    return {
      showMinted: true,
      showCollectionData: true,
      showSearch: false,
      defQuery: {
        query: null,
        allCollections: 'one',
        onSale: false,
        onAuction: false,
        editions: false,
        createdBefore: null,
        createdAfter: null,
        sortField: 'nftIndex',
        sortDir: 'sortDown'
      },
      videoHeight: 0,
      componentKey: 0,
      searchKey: 0,
      minted: false,
      makerUrlKey: null,
      numbTokens: 0,
      currentRunKey: null
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.makerß
    this.currentRunKey = this.$route.params.collection
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientHeight
    }, this)
  },
  methods: {
    tokenCount (data) {
      this.numbTokens = data.numbTokens
    },
    updateResults (data) {
      this.defQuery = data.query
      this.searchKey++
    },
    refresh (data) {
      if (data.opcode === 'show-collection') {
        if (this.$route.path !== '/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey) this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      }
    },
    resetFilters () {
      this.defQuery.allCollections = 'one'
      this.defQuery.query = null
      this.defQuery.onAuction = false
      this.defQuery.onSale = false
      this.defQuery.allEditions = false
      this.defQuery.sortField = 'nftIndex'
      this.defQuery.sortDir = 'sortDown'
    },
    update (data) {
      if (data.opcode === 'show-collection') {
        this.showSearch = false
        this.resetFilters()
        if (this.$route.path !== '/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey) this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      } else if (data.opcode === 'show-search') {
        this.showSearch = !this.showSearch
        if (this.showSearch) {
          this.defQuery.allCollections = 'all'
        } else {
          this.defQuery.allCollections = 'one'
        }
      }
      this.searchKey++
    },
    getCollectionImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    }
  },
  computed: {
    loopRun () {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.currentRunKey)
      return loopRun
    }
  }
}
</script>
