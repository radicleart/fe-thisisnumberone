<template>
<section class="" id="section-minting">
  <b-container class="my-5 pt-5" v-if="!item || !loopRun">
    <h1>{{message}}</h1>
  </b-container>
  <b-container class="my-3" v-else>
    <b-row :key="componentKey" style="min-height: 40vh;" >
      <b-col md="4" sm="12" align-self="start" class="text-center">
        <MediaItemGeneral :classes="'item-image-preview'" :options="options" :mediaItem="getMediaItem().artworkFile"/>
        <div class="text-left text-small mt-3">
          <b-link :to="'/my-nfts/' + loopRun.currentRunKey"><b-icon icon="chevron-left"/> Back</b-link>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="mb-4 text-white">
        <div>
          <div class="mb-2 d-flex justify-content-between">
            <h2 class="d-block border-bottom mb-5">{{mintedMessage}}</h2>
            <ItemActionMenu :item="item" :loopRun="loopRun"/>
          </div>
          <h6 v-if="item.artist" class="text-small">By : {{item.artist}}</h6>
        </div>
        <p v-if="item.description" class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        <MintInfo :item="item" :loopRun="loopRun"/>
        <PendingTransactionInfo v-if="pending && pending.txStatus === 'pending'" :pending="pending"/>
        <div v-else>
          <MintingTools class="w-100" :items="[item]" :loopRun="loopRun" @update="update"/>
        </div>
        <div>
          <NftHistory class="mt-5" @update="update" @setPending="setPending" :loopRun="loopRun" :nftIndex="(item.contractAsset) ? item.contractAsset.nftIndex : -1" :assetHash="item.assetHash"/>
        </div>
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
      contractId: null,
      componentKey: 0,
      nftIndex: null,
      notCount: 0,
      assetHash: null,
      pending: null,
      item: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.contractId = this.$route.params.contractId
    this.state = this.$route.query.state
    this.fetchItem()
    if (window.eventBus && window.eventBus.$on) {
      const $self = this
      window.eventBus.$on('rpayEvent', function (data) {
        if ($self.$route.name !== 'item-preview' && $self.$route.name !== 'nft-preview') return
        if (data.opcode === 'stx-transaction-sent') {
          $self.componentKey++
          // save transaction but not on gaia asset
          if (data.txId && data.functionName === 'mint-token' && data.txStatus === 'success') {
            const item = $self.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](data.assetHash)
            item.mintInfo = {
              txId: data.txId,
              txStatus: data.txStatus
            }
            $self.$store.dispatch('rpayMyItemStore/quickSaveItem', item).then(() => {
              $self.setPending(data)
            })
          }
          $self.setPending(data)
        }
      })
    }
  },
  methods: {
    fetchItem () {
      if (this.$route.name === 'nft-preview') {
        const data = { contractId: this.contractId, nftIndex: Number(this.$route.params.nftIndex) }
        this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then((item) => {
          this.item = item
        })
      } else {
        this.assetHash = this.$route.params.assetHash
        this.edition = Number(this.$route.params.edition)
        this.$store.dispatch('rpayMyItemStore/findItemByAssetHash', this.assetHash).then((item) => {
          this.item = item
          const data = {
            asc: true,
            page: 0,
            pageSize: 100,
            stxAddress: (process.env.VUE_APP_NETWORK !== 'local') ? this.profile.stxAddress : 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
          }
          this.$store.dispatch('rpayStacksContractStore/fetchMyTokens', data).then((results) => {
            if (results && results.tokenCount > 0) {
              const item = results.gaiaAssets.find((o) => o.assetHash === this.assetHash)
              if (item) this.item = item
            }
          })
        })
      }
    },
    setPending (result) {
      if (this.pending) {
        const data = {
          contractId: this.loopRun.contractId
        }
        if (!result || !result.txStatus || result.txStatus === 'pending') {
          this.pending = result
        } else if (result.txStatus === 'success' && result.functionName === 'mint-token') {
          data.assetHash = result.assetHash
          this.updateCacheByHash(data)
        } else if (result.txStatus === 'success' && result.functionName !== 'mint-token') {
          data.nftIndex = result.nftIndex
          this.updateCacheByNftIndex(data)
        } else {
          if (this.notCount === 0) this.$notify({ type: 'danger', title: 'Transaction Info', text: 'Transaction failed - check blockchain for cause.' })
          this.notCount++
        }
      }
      this.pending = result
    },
    updateCacheByHash (data) {
      this.$store.dispatch('rpayStacksContractStore/updateCacheByHash', data).then((result) => {
        if (result && typeof result.nftIndex !== 'undefined') {
          this.nftIndex = result.nftIndex
          data.nftIndex = result.nftIndex
          this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then(() => {
            if (this.nftIndex && this.$route.name !== 'nft-preview') this.$router.push('/nft-preview/' + this.loopRun.contractId + '/' + result.nftIndex)
            else this.fetchItem()
          })
        } else {
          this.fetchItem()
        }
      })
    },
    updateCacheByNftIndex (data) {
      this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', data).then(() => {
        this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', data).then(() => {
          this.fetchItem()
        })
      })
    },
    update () {
      this.fetchItem()
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
    mintedMessage () {
      if (this.item.contractAsset && this.loopRun && this.loopRun.type === 'punks') {
        return this.loopRun.currentRun + ' #' + this.item.contractAsset.nftIndex
      }
      if (this.item.contractAsset) {
        return '#' + this.item.contractAsset.nftIndex + ' ' + this.item.name
      }
      return this.item.name
    },
    loopRun () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUNS]
      if (!loopRuns || !this.contractId) {
        return this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.runKey)
      }
      return loopRuns.find((o) => o.contractId === this.contractId && o.currentRunKey.indexOf(this.runKey > -1))
    },
    runKey () {
      const defaultLoopRun = process.env.VUE_APP_DEFAULT_LOOP_RUN
      let runKey = (this.item && this.item.attributes.collection) ? this.item.attributes.collection : defaultLoopRun
      if (runKey.indexOf('/') > -1) {
        runKey = runKey.split('/')[0]
      }
      return runKey
    },
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
    /**
    item1 () {
      // get the item from my uploads - then try my nfts
      if (this.nftIndex !== null && typeof this.nftIndex !== 'undefined' && this.nftIndex > -1) {
        return this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_NFT_INDEX](Number(this.nftIndex))
      }
      let item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH_EDITION]({ assetHash: this.assetHash, edition: 1 })
      if (!item) {
        item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      }
      if (this.edition > 1) {
        item = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH_EDITION]({ assetHash: this.assetHash, edition: this.edition })
      }
      return item
    },
    **/
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
