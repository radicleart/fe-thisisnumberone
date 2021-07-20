<template>
<section class="" id="section-minting">
  <div class="mt-3" v-if="!item">
    {{message}}
  </div>
  <b-container class="my-5 pt-5" v-if="item">
    <b-row style="min-height: 40vh" >
      <b-col md="4" sm="12" align-self="start" class=" text-center">
        <div  class="" style="width:100%;">
          <!-- <media-item :videoOptions="videoOptions" :dims="dims" :attributes="item.attributes" :targetItem="'artworkFile'"/> -->
          <NftCoverImage :item="item" :displayHeader="false"/>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="mb-4 text-white">
        <div>
          <div class="mb-2 d-flex justify-content-between">
            <h2 class="d-block border-bottom mb-5">{{item.name}}</h2>
            <div class="">
              <router-link v-if="!contractAsset" class="mr-2" :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"></b-icon></router-link>
              <a v-if="!contractAsset" href="#" @click.prevent="deleteItem" class="text-danger"><b-icon icon="trash"></b-icon></a>
            </div>
          </div>
          <h6 class="text-small">By : {{item.artist}}</h6>
        </div>
        <!--
          <div class="mb-2 text-bold">Editions {{item.editions}}</div>
          <span class="text-small mr-1" v-for="(kw, index) in item.keywords" :key="index">#{{kw.name}}</span>
        -->
        <p class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        <minting-tools class="w-100" :assetHash="item.assetHash" />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import MintingTools from '@/components/toolkit/MintingTools'
import { APP_CONSTANTS } from '@/app-constants'
import NftCoverImage from '@/components/upload/NftCoverImage'

export default {
  name: 'ItemPreview',
  components: {
    MintingTools,
    NftCoverImage
  },
  data: function () {
    return {
      dims: { width: 768, height: 432 },
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpayMyItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      if (!item) {
        this.$router.push('/my-items')
      }
    })
  },
  methods: {
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">' + content + '</span>'
    },
    targetItem: function () {
      const item = this.$store.getters['rpayMyItemStore/myItem'](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](item)
    }
  },
  computed: {
    videoOptions () {
      const item = this.$store.getters['rpayMyItemStore/myItem'](this.assetHash)
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: true,
        poster: (item.attributes.coverImage) ? item.attributes.coverImage.fileUrl : null,
        sources: [
          { src: item.attributes.artworkFile.fileUrl, type: item.attributes.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    attributes () {
      const item = this.$store.getters['rpayMyItemStore/myItem'](this.assetHash)
      return item.attributes
    },
    keywords () {
      return this.$store.getters['rpayMyItemStore/myItem'](this.assetHash)
    }
  }
}
</script>

<style>
#minting-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}

</style>
