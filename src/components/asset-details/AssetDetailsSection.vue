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
              <b-button @click="openMakeOffer()" class="mr-1 w-50" variant="light">MAKE AN OFFER</b-button>
              <b-button @click="openUpdates()" class="ml-1 w-50" variant="dark">GET UPDATES</b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-row>
  </b-container>
  <asset-updates-modal :assetHash="assetHash" @registerForUpdates="registerForUpdates"/>
  <asset-offer-modal :assetHash="assetHash"/>
</section>
</template>

<script>
import Vue from 'vue'
import AssetUpdatesModal from './AssetUpdatesModal'
import AssetOfferModal from './AssetOfferModal'

export default {
  name: 'AssetDetailsSection',
  components: {
    AssetUpdatesModal,
    AssetOfferModal
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
    },
    openUpdates: function () {
      this.$bvModal.show('asset-updates-modal', { assetHash: this.assetHash })
    },
    openMakeOffer: function () {
      this.$bvModal.show('asset-offer-modal', { assetHash: this.assetHash })
    },
    registerForUpdates: function (email) {
      const data = {
        status: 1,
        domain: location.host,
        assetHash: this.assetHash,
        email: email
      }
      this.$store.dispatch('assetGeneralStore/registerForUpdates', data).then((result) => {
        this.$store.commit('setModalMessage', 'Thanks for registering an interest - we will keep you updated.')
        this.$bvModal.hide('asset-updates-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.message = result
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Thanks for re-registering an interest - we will keep you updated.')
        this.$bvModal.hide('asset-updates-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
      })
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
