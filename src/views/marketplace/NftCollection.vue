<template>
<div v-if="loopRun && loopRun.status !== 'disabled'">
  <b-container :key="componentKey" fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row id="video-column">
      <b-col md="3" sm="12">
        <h1 class="border-bottom mb-5">{{loopRun.currentRun}}</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="9" sm="12">
        <h1 class="mb-4 border-bottom">Collection</h1>
        <b-row class="mb-4" align-v="stretch" style="height: auto">
          <b-col cols="3" class="">
            <div class="d-flex justify-content-start">
              <img width="100%" :src="getCollectionImageUrl(loopRun)" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
            </div>
          </b-col>
          <b-col cols="4" class="" align-self="end">
              <div class="text-small">
                <h2>{{loopRun.currentRun}}</h2>
                <p>by: <span class="text-warning">{{loopRun.makerName}}</span></p>
                <p><b-link :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.versionLimit - loopRun.tokenCount}} still available</b-link></p>
              </div>
          </b-col>
        </b-row>
        <div class="mb-4" v-if="loopRun">
          <PageableItems :loopRun="loopRun"/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
<b-container v-else>
  Collection not found.
  <span v-if="loopRun && loopRun.status === 'disabled'">This collection has been disabled.</span>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PageableItems from '@/views/marketplace/components/gallery/PageableItems'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import Vue from 'vue'

export default {
  name: 'NftCollection',
  components: {
    PageableItems,
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
      videoHeight: 0,
      componentKey: 0,
      minted: false,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientHeight
    }, this)
  },
  methods: {
    refresh (data) {
      if (data.opcode === 'show-collection') {
        this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      }
    },
    update (data) {
      if (data.opcode === 'show-collection') {
        this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      }
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
