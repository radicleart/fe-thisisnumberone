<template>
<div v-if="loaded">
  <Banner/>
  <div>
    <b-container>
      <h1 class="my-5 text-white">#1 NFT Collection</h1>
      <div v-if="!loopRun">Sorry no collection found here</div>
      <div>
        <b-row>
          <b-col class="text-center">
            <h2 class="">{{loopRun.currentRun}}</h2>
            <div>
              <img :src="getCollectionImageUrl(loopRun)" width="150px" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
            </div>
            <div class="text-small">by: <span class="text-warning">{{loopRun.makerName}}</span></div>
          </b-col>
        </b-row>
        <b-row class="mb-4" v-if="loopRun">
          <PageableItems :loopRun="loopRun"/>
        </b-row>
      </div>
    </b-container>
  </div>
</div>
</template>

<script>
import Banner from '@/views/marketplace/components/gallery/common/Banner'
import { APP_CONSTANTS } from '@/app-constants'
import PageableItems from '@/views/marketplace/components/gallery/PageableItems'

// let imagePath = 'https://loopbomb.io/mijo-enterprises/image/upload/v1593596116/lb-v4/'

export default {
  name: 'NftCollection',
  components: {
    Banner,
    PageableItems
  },
  data () {
    return {
      loaded: false,
      minted: false,
      loopRun: null,
      makerUrlKey: null,
      currentRunKey: null
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    this.$store.dispatch('rpayCategoryStore/fetchLoopRuns').then((loopRuns) => {
      this.loopRun = loopRuns.find((o) => o.makerUrlKey === this.makerUrlKey && o.currentRunKey === this.currentRunKey)
      this.loaded = true
    })
  },
  methods: {
    getCollectionImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    }
  },
  computed: {
  }
}
</script>
