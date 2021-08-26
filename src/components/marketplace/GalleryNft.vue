<template>
<div v-if="item && item.attributes" class="mt-1">
  <b-link :to="assetUrl">
    <MediaItemGeneral :classes="'item-image text-center'" class="p-0 m-0" v-on="$listeners" :options="videoOptions" :mediaItem="item.attributes.coverImage"/>
  </b-link>
  <div class="mt-3 text-white">
    <div class="mt-2 mb-2">
      <div v-if="item.contractAsset">
        #{{item.contractAsset.nftIndex}} {{item.name}}
      </div>
      <div class="text-small">
        by <span class="text-warning">{{item.artist}}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'

export default {
  name: 'GalleryNft',
  components: {
    MediaItemGeneral
  },
  props: ['item'],
  data () {
    return {
      dims: { width: 360, height: 360 },
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png'),
      explorer: 'https://explorer.stacks.co/txid/'
    }
  },
  methods: {
    marketplaceLink: function () {
      return process.env.VUE_APP_MARKETPLACE_URL + '/nfts/' + this.item.contractAsset.nftIndex
    },
    mintedEvent (data) {
      // this.$store.commit('setModalMessage', 'Transaction sent. <br/>While you are waiting please take a minute to fill in <a style="font-size: 2.0rem; color: blue" href="https://shrl.ink/HPyh" target="_blank" rel="noopener noreferrer"> this survey.</a><br/> You can find your NFT on the /my-nfts page here and in your Stacks Wallet.<br/><br/><a href="' + this.explorer + data.txId + '?chain=mainnet" target="_blank">Track the transaction here</a>')
      this.$store.commit('setModalMessage', 'Transaction sent.<br/>You can find your NFTs here by clicking on My NFTs in the account section.<br/><a class="text-white" href="' + this.explorer + data.txId + '?chain=mainnet" target="_blank">Track your transaction here</a>')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
    },
    salesButtonLabel () {
      if (!this.item.contractAsset) return 'NOT MINTED'
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](this.item.contractAsset.saleData.saleType)
    }
  },
  computed: {
    contractAsset () {
      return this.item.contractAsset
    },
    videoOptions () {
      let file = this.item.attributes.artworkFile
      if (!file) {
        file = this.item.attributes.artworkClip
      }
      if (!file) return {}
      const videoOptions = {
        emitOnHover: true,
        playOnHover: false,
        bigPlayer: true,
        assetHash: this.item.assetHash,
        autoplay: false,
        muted: false,
        controls: true,
        showMeta: false,
        dimensions: 'max-width: 100%; max-height: auto;',
        aspectRatio: '1:1',
        poster: (this.item.attributes.coverImage) ? this.item.attributes.coverImage.fileUrl : null,
        sources: [
          { src: this.item.attributes.artworkFile.fileUrl, type: this.item.attributes.artworkFile.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    assetUrl () {
      if (this.item.contractAsset) {
        // return '/nfts/' + this.item.contractAsset.nftIndex
      }
      return '/assets/' + this.item.contractAsset.tokenInfo.assetHash + '/1'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
