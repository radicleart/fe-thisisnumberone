<template>
<section class="" id="section-minting">
  <div class="mt-3" v-if="!item">
    {{message}}
  </div>
  <b-container class="my-5 pt-5" v-if="item">
    <b-row style="min-height: 40vh" >
      <b-col md="4" sm="12" align-self="start" class="text-center">
        <div class="">
          <MediaItemGeneral :classes="'item-image-preview'" :options="options" :mediaItem="getMediaItem().artworkFile"/>
        </div>
        <div class="text-left text-small mt-3">
          <b-link to="/my-nfts"><b-icon icon="chevron-left"/> Back</b-link>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="mb-4 text-white">
        <div>
          <div class="mb-2 d-flex justify-content-between">
            <h2 class="d-block border-bottom mb-5">{{item.name}}</h2>
            <ItemActionMenu :item="item" />
          </div>
          <h6 class="text-small">By : {{item.artist}}</h6>
        </div>
        <p class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        <MintInfo :item="item" />
        <div>
          <MintingTools class="w-100" :item="item" v-if="iAmOwner || edition === 0" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import ItemActionMenu from '@/components/items/ItemActionMenu'
import MintInfo from '@/components/toolkit/mint-setup/MintInfo'
import MintingTools from '@/components/toolkit/MintingTools'

export default {
  name: 'ItemPreview',
  components: {
    MintingTools,
    MediaItemGeneral,
    ItemActionMenu,
    MintInfo
  },
  watch: {
    item () {
      if (this.item && this.item.mintInfo) this.checkMinting(this.item)
    }
  },
  data: function () {
    return {
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.edition = Number(this.$route.params.edition)
    if (this.edition > 0) {
      this.$store.dispatch('rpayStacksContractStore/fetchAssetByHashAndEdition', { assetHash: this.assetHash, edition: this.edition })
    }
  },
  methods: {
    checkMinting (item) {
      if (item.mintInfo) {
        if (!item.mintInfo.txId) {
          item.mintInfo = null
          this.$store.dispatch('rpayMyItemStore/saveItem', item)
        } else {
          if (item.mintInfo.txStatus === 'pending') {
            this.$store.dispatch('rpayTransactionStore/fetchTransactionFromChainByTxId', item.mintInfo.txId, { root: true }).then((txData) => {
              if (txData.txStatus !== 'pending') {
                item.mintInfo = txData
                this.$store.dispatch('rpayMyItemStore/saveItem', item)
              }
            })
          } else if (item.mintInfo.txStatus === 'sent') {
            item.mintInfo = null
            this.$store.dispatch('rpayMyItemStore/saveItem', item)
          }
        }
      }
    },
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](this.item)
      return attributes
    },
    deleteMediaItem: function (mediaId) {
      this.$store.dispatch('rpayMyItemStore/deleteMediaItem', { item: this.item, id: mediaId }).then(() => {
        this.$emit('delete-cover')
      })
    },
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">' + content + '</span>'
    },
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.item)
    }
  },
  computed: {
    options () {
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: false,
        poster: (this.item.attributes.coverImage) ? this.item.attributes.coverImage.fileUrl : null,
        sources: [
          { src: this.item.attributes.artworkFile.fileUrl, type: this.item.attributes.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    item () {
      // get the item from my uploads - then try my nfts
      let item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      if (this.edition > 0) {
        item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH_EDITION]({ assetHash: this.assetHash, edition: this.edition })
      }
      return item
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    iAmOwner () {
      if (process.env.VUE_APP_NETWORK === 'local') {
        return this.item.contractAsset && this.item.contractAsset.owner === 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      return this.item.contractAsset && this.item.contractAsset.owner === this.profile.stxAddress
    },
    minted () {
      // const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      // return !this.item.contractAsset && this.item.contractAsset.owner === profile.stxAddress
      return this.item.contractAsset
    },
    attributes () {
      return this.item.attributes
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
