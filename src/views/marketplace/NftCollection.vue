<template>
<div v-if="loopRun">
  <b-container :key="componentKey" fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row>
      <b-col md="4" sm="12">
        <h1 class="border-bottom mb-5">{{loopRun.currentRun}}</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="8" sm="12">
        <h1 class="mb-4 border-bottom">Collection</h1>
        <b-row>
          <b-col class="text-center">
            <div class="d-flex justify-content-start">
              <img :src="getCollectionImageUrl(loopRun)" width="150px" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
              <div class="ml-5 text-small">
                <p>{{loopRun.currentRun}}</p>
                <p>by: <span class="text-warning">{{loopRun.makerName}}</span></p>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row class="mb-4" v-if="loopRun">
          <PageableItems :loopRun="loopRun"/>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PageableItems from '@/views/marketplace/components/gallery/PageableItems'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'

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
      componentKey: 0,
      minted: false,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
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
