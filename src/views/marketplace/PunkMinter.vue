<template>
<div class="mb-5" v-if="loaded">
  <Banner/>
  <div>
    <b-container>
      <h1 class="my-5 text-white">#1 NFT Collection</h1>
      <div v-if="!loopRun">Collection not found</div>
      <div v-else>
        <PunkTracker @updateAllocation="updateAllocation" :items="items" :loopRun="loopRun" :mintAllocations="mintAllocations"/>
        <b-row>
          <b-col class="text-center">
            <h2 class="">{{loopRun.currentRun}}</h2>
            <div class="mb-2 text-small">{{loopRun.description}}</div>
            <div class="mb-5 text-small">by: <span class="text-warning">{{loopRun.makerName}}</span></div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <MaybeMintable :mintAllocations="mintAllocations" :items="items" :loopRun="loopRun" :uiState="uiState"/>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</div>
</template>

<script>
import PunkTracker from '@/views/marketplace/components/toolkit/nft-history/PunkTracker'
import Banner from '@/views/marketplace/components/gallery/common/Banner'
import MaybeMintable from '@/views/marketplace/components/gallery/MaybeMintable'
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'

// let imagePath = 'https://loopbomb.io/mijo-enterprises/image/upload/v1593596116/lb-v4/'

export default {
  name: 'PunkMinter',
  components: {
    MaybeMintable,
    Banner,
    PunkTracker
  },
  data () {
    return {
      imagePath: 'https://res.cloudinary.com/mijo-enterprises/image/upload/v1633523528/collections/artists/artist1/set1/',
      loaded: false,
      items: [],
      uiState: 'locking',
      mintAllocations: [],
      gaiaAssets: [],
      loopRun: null,
      makerUrlKey: null,
      currentRunKey: null,
      counter: 0
    }
  },
  watch: {
    'items' () {
      if (this.fetchedItems) {
        this.uiState = 'ready'
      }
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    // const lockData = { stxAddress: this.profile.stxAddress, currentRunKey: this.currentRunKey }
    this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.currentRunKey).then((loopRun) => {
      this.loopRun = loopRun
      // utils.fetchBase64FromImageUrl(this.imagePath + '1.png', document).then((data) => {
      this.loaded = true
      const endPointer = this.loopRun.batchPointer + this.loopRun.batchSize
      for (let index = this.loopRun.batchPointer; index < endPointer; index++) {
        this.createMetaData(index)
      }
    })
    // })
  },
  methods: {
    updateAllocation (data) {
      this.uiState = 'locked'
      this.$notify({ type: 'warning', title: 'Upload File', text: 'Allocation event - ' + data })
    },
    createMetaData (index) {
      // create but don't store - wait till the last minute to register the batch!
      // see component MintingFlow.vue
      const image = this.imagePath + index + '.png'
      const imgHash = utils.buildHash(image)
      const myAsset = {
        assetHash: imgHash,
        attributes: {
          artworkFile: {
            type: 'image/png',
            fileUrl: image
          }
        },
        cryptoPunk: true,
        image: image,
        name: index
      }
      myAsset.currentRunKey = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
      this.gaiaAssets.push(myAsset)
      this.mintAllocations.push({
        stxAddress: this.profile.stxAddress,
        currentRunKey: myAsset.currentRunKey,
        punkIndex: index,
        assetHash: imgHash,
        status: 'reserved'
      })
      /**
      this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((gaiaAsset) => {
        this.items.push(gaiaAsset)
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Upload File', text: 'Collision - please reload to check for next available item!' })
        this.errored = true
      })
      **/
    },
    getCollectionImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    fetchedItems () {
      return this.items.length === this.loopRun.batchSize
    }
  }
}
</script>
