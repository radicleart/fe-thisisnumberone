<template>
<section v-if="item" class="container-fluid p-5 hundred-vh bg-black text-white">
  <b-container>
    <b-row>
      <div id="video-column" class="col-md-6 col-sm-12">
        <video :poster="poster()" controls :style="'height:' + videoHeight + 'px;'">
          <source :src="item.nftMedia.artworkFile.fileUrl" :type="item.nftMedia.artworkFile.type">
        </video>
      </div>
      <div class="col-md-6 col-sm-12">
        <b-row align-v="stretch" :style="'height:' + videoHeight + 'px;'">
          <b-col cols="12"><router-link to="/"><b-icon icon="chevron-left" shift-h="-4" variant="danger"></b-icon> Back</router-link></b-col>
          <b-col cols="12" align-self="end">
            <h1>Artist {{item.artist}}</h1>
            <h2>{{item.name}}</h2>
            <p class="border-top text-small">{{item.description}}</p>
            <div class="mb-5 d-flex justify-content-between">
              <div class=""><router-link :to="'/charity/' + item.assetHash">Find out more</router-link></div>
              <div class=""><router-link :to="'/charity/' + item.assetHash">Charity</router-link></div>
            </div>
            <div class="d-flex justify-content-between">
              <b-button class="mr-2 w-50" variant="light">Find out more</b-button>
              <b-button class="ml-2 w-50" variant="dark">Charity</b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-row>
  </b-container>
</section>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'AssetDetailsSection',
  components: {
  },
  data: function () {
    return {
      dims: { width: 768, height: 768 },
      videoHeight: 2000,
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      this.loading = false
      if (!item) {
        this.$router.push('/404')
      }
    })
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientWidth
    }, this)
  },
  methods: {
    poster: function () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      if (item.nftMedia.coverImage) {
        return item.nftMedia.coverImage.fileUrl
      }
    }
  },
  computed: {
    item () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return item
    },
    nftMedia () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return item.nftMedia
    },
    keywords () {
      return this.$store.getters['myItemStore/myItem'](this.assetHash)
    }
  }
}
</script>

<style scoped>
</style>
