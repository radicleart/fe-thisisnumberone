<template>
<section class="" id="section-minting">
  <b-container class="my-5 pt-5" v-if="!item">
    <h1>{{message}}</h1>
  </b-container>
  <b-container :key="componentKey" class="my-3" v-else>
    <b-row style="min-height: 40vh;" >
      <b-col md="4" sm="12" align-self="start" class="text-center">
        <MediaItemGeneral :classes="'item-image-preview'" :options="options" :mediaItem="getMediaItem().artworkFile"/>
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
          <h6 v-if="item.artist" class="text-small">By : {{item.artist}}</h6>
        </div>
        <p v-if="item.description" class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        <MintInfo :item="item" />
        <PendingTransactionInfo v-if="pending && pending.txStatus === 'pending'" :pending="pending"/>
        <div v-else>
          <MintingTools class="w-100" :item="item" @update="update"/>
        </div>
        <NftHistory class="mt-5" @update="update" @setPending="setPending" :nftIndex="(item.contractAsset) ? item.contractAsset.nftIndex : -1" :assetHash="item.assetHash"/>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/views/marketplace/components/media/MediaItemGeneral'
import ItemActionMenu from '@/views/marketplace/components/update/ItemActionMenu'
import PendingTransactionInfo from '@/views/marketplace/components/toolkit/nft-history/PendingTransactionInfo'
import NftHistory from '@/views/marketplace/components/toolkit/nft-history/NftHistory'
import MintInfo from '@/views/marketplace/components/toolkit/mint-setup/MintInfo'
import MintingTools from '@/views/marketplace/components/toolkit/MintingTools'

export default {
  name: 'ItemPreview',
  components: {
    MediaItemGeneral,
    NftHistory,
    MintingTools,
    PendingTransactionInfo,
    MintInfo,
    ItemActionMenu
  },
  data: function () {
    return {
      showHash: false,
      componentKey: 0,
      nftIndex: null,
      assetHash: null,
      pending: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.state = this.$route.query.state
    this.assetHash = this.$route.params.assetHash
    this.edition = Number(this.$route.params.edition)
    this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndAssetHash', this.assetHash)
    if (window.eventBus && window.eventBus.$on) {
      const $self = this
      window.eventBus.$on('rpayEvent', function (data) {
        if ($self.$route.name !== 'item-preview') return
        if (data.opcode === 'stx-transaction-sent') {
          // save transaction but not on gaia asset
          if (data.txId && data.functionName === 'mint-token' && data.txStatus === 'success') {
            const item = $self.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](data.assetHash)
            item.mintInfo = {
              txId: data.txId,
              txStatus: data.txStatus
            }
            $self.$store.dispatch('rpayMyItemStore/quickSaveItem', item)
          }
          $self.update()
        }
      })
    }
  },
  methods: {
    setPending (result) {
      if (this.pending) {
        if (!result || !result.txStatus || result.txStatus === 'pending') {
          this.pending = result
        } else if (result.txStatus === 'success' && result.functionName === 'mint-token') {
          this.updateCacheByHash(result.assetHash)
        } else if (result.txStatus === 'success' && result.functionName !== 'mint-token') {
          this.updateCacheByNftIndex(result.nftIndex)
        } else {
          this.$notify({ type: 'danger', title: 'Transaction Info', text: 'Transaction failed - check blockchain for cause.' })
        }
      }
      this.pending = result
    },
    updateCacheByHash (assetHash) {
      this.$store.dispatch('rpayStacksContractStore/updateCacheByHash', assetHash).then((result) => {
        if (result && typeof result.nftIndex !== 'undefined') this.nftIndex = result.nftIndex
        this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', result.nftIndex).then(() => {
          // this.componentKey++
          // window.location.reload()
        })
      })
    },
    updateCacheByNftIndex (nftIndex) {
      this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', nftIndex).then(() => {
        this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', nftIndex).then(() => {
          // this.componentKey++
          // window.location.reload()
        })
      })
    },
    update () {
      this.componentKey++
    },
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_MEDIA_ATTRIBUTES](this.item)
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
    transactionUrl: function () {
      if (!this.item.mintInfo || !this.item.mintInfo.txId) return '#'
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      let txId = this.item.mintInfo.txId
      if (!txId.startsWith('0x')) txId = '0x' + txId
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    txPending () {
      let transactions = []
      if (this.item.contractAsset) {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_TX_ID](this.item.contractAsset.nftIndex)
      } else {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_ASSET_HASH](this.item.assetHash)
      }
      return transactions
    },
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
      if (this.nftIndex !== null && typeof this.nftIndex !== 'undefined' && this.nftIndex > -1) {
        return this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_NFT_INDEX](Number(this.nftIndex))
      }
      let item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      if (this.edition > 0) {
        item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH_EDITION]({ assetHash: this.assetHash, edition: this.edition })
        if (!item) {
          item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
        }
      }
      return item
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    iAmOwner () {
      if (process.env.VUE_APP_NETWORK === 'local') {
        return this.item.contractAsset && (this.item.contractAsset.owner === 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG' || this.item.contractAsset.owner === this.profile.stxAddress)
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
