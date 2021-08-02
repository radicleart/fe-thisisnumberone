<template>
<section class="" id="section-minting" v-if="item && item.contractAsset">
  <div class="mt-3" v-if="item.contractAsset.owner !== profile.stxAddress">
    {{message}}
  </div>
  <b-container class="my-5">
    <b-row>
      <b-col md="4" sm="12">
        <div>
          <MediaItemGeneral :classes="'nft-display-image'" v-on="$listeners" :options="videoOptions" :mediaItem="item.attributes.coverImage"/>
        </div>
      </b-col>
      <b-col md="8" sm="12" align-self="start" class="text-white">
        <div class="mt-2 mb-2 d-flex justify-content-between">
            <h1 class="mb-3">{{item.name}}</h1>
          <div class="">
            <b-link class="" :to="'/nft-gallery'"><b-icon icon="chevron-left"></b-icon> Back</b-link>
          </div>
        </div>
        <h2>{{item.artist}}</h2>
        <p class="border-bottom pb-4" style="font-size: 1.2rem;">{{item.contractAsset.owner}}</p>
        <div class="w-100">
          <p class="pt-4 text-small" v-html="preserveWhiteSpace(item.description)"></p>
        </div>
        <p class="px-4"><a class="text-white" :href="marketplaceLink()" target="_blank"><b-icon class="mr-3" icon="arrow-up-right-square"/> View on marketplace</a></p>
        <p class="px-4"><a class="text-white" href="#" @click.prevent="action = 1"><b-icon class="mr-3" icon="chevron-right"/> Transfer NFT</a></p>
        <p class="px-4"><a class="text-white" href="#" @click.prevent="action = 2"><b-icon class="mr-3" icon="chevron-right"/> Mint Edition</a></p>
        <TransferNft :myNft="item" v-if="action === 1" />
        <EditionTrigger v-if="action === 2" :assetHash="item.assetHash" @mintedEvent="mintedEvent"/>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import TransferNft from '@/components/toolkit/TransferNft'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import { APP_CONSTANTS } from '@/app-constants'
import EditionTrigger from '@/components/toolkit/editions/EditionTrigger'

export default {
  name: 'NftDisplay',
  components: {
    TransferNft,
    MediaItemGeneral,
    EditionTrigger
  },
  data: function () {
    return {
      action: 0,
      dims: { width: 768, height: 432 },
      showHash: false,
      assetHash: null,
      message: 'Not allowed - no NFT available...',
      item: null
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpayMyItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      if (item) {
        const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](item.assetHash)
        item.contractAsset = contractAsset
        this.item = item
      }
    })
  },
  methods: {
    marketplaceLink: function () {
      return process.env.VUE_APP_MARKETPLACE_URL + '/assets/' + this.item.assetHash
    },
    mintedEvent (data) {
      this.$store.commit('setModalMessage', 'Request sent to the blockchain - should be ready in an hour or so. <br/>While you are waiting please take a minute to fill in <a style="font-size: 2.0rem; color: blue" href="https://shrl.ink/HPyh" target="_blank" rel="noopener noreferrer"> this survey.</a><br/> You can find your NFT on the /my-nfts page here and in your Stacks Wallet.<br/><br/><a href="' + this.explorer + data.txId + '?chain=mainnet" target="_blank">Track the transaction here</a>')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
    },
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">' + content + '</span>'
    }
  },
  computed: {
    videoOptions () {
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
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>

<style scoped>
</style>
