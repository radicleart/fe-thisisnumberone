<template>
<div v-if="item && item.nftMedia" class="mt-1">
  <media-item :videoOptions="videoOptions" :dims="dims" :nftMedia="item.nftMedia" :targetItem="targetItem()"/>
  <div class="text-white">
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="">
        <b-link class="text-white" router-tag="a" :to="assetUrl">{{item.name}}</b-link>
      </div>
      <!--
      <div class="">
        <span v-if="contractAsset">Edition {{contractAsset.tokenInfo.edition}} of {{contractAsset.tokenInfo.maxEditions}}</span>
      </div>
      -->
    </div>
    <div class="mt-5 mb-2 d-flex justify-content-between">
      <div class="">
        <EditionTrigger :assetHash="item.assetHash" @mintedEvent="mintedEvent"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import { APP_CONSTANTS } from '@/app-constants'
import MediaItem from '@/components/utils/MediaItem'
import EditionTrigger from '@/components/toolkit/editions/EditionTrigger'

export default {
  name: 'MarketableNft',
  components: {
    EditionTrigger,
    MediaItem
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
    mintedEvent (data) {
      this.$store.commit('setModalMessage', 'Sent request off to the blockchain - should be ready in an hour or so. <br/>You can find it on the /my-nfts page here and in your Stacks Wallet.<br/>Please fill <a style="font-size: 2.0rem !important" href="https://shrl.ink/HPyh">this short survey</a> to tell us more about your experience !<br/><a href="' + this.explorer + data.txId + '?chain=mainnet" target="_blank">Track the transaction here</a>')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
    },
    mintEdition: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      const methos = (process.env.VUE_APP_NETWORK === 'local') ? 'callContractRisidio' : 'callContractBlockstack'
      const data = {
        owner: contractAsset.owner,
        editionCost: contractAsset.tokenInfo.editionCost,
        action: methos,
        nftIndex: contractAsset.nftIndex,
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        functionName: 'mint-edition'
      }
      this.$store.dispatch('rpayPurchaseStore/mintEdition', data).then((result) => {
        this.result = result
      })
    },
    salesButtonLabel () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      if (!contractAsset) return 'NOT MINTED'
      return this.$store.getters[APP_CONSTANTS.KEY_SALES_BUTTON_LABEL](contractAsset.saleData.saleType)
    },
    targetItem: function () {
      return this.$store.getters[APP_CONSTANTS.KEY_TARGET_FILE_FOR_DISPLAY](this.item)
    },
    hoverIn (index) {
      this.dHover[index] = true
      this.componentKey += 1
    },
    isAllowed (opcode) {
      if (opcode === 'delete' || opcode === 'edit') {
        return this.item.nftIndex === -1
      }
    },
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    toggleFavourite () {
      utils.makeFlasher(this.$refs.lndQrcode)
    },
    deleteItem () {
      this.$store.dispatch('myItemStore/deleteItem', this.item)
    }
  },
  computed: {
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      return contractAsset
    },
    videoOptions () {
      let file = this.item.nftMedia.artworkFile
      if (!file) {
        file = this.item.nftMedia.artworkClip
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
        poster: (this.item.nftMedia.coverImage) ? this.item.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: this.item.nftMedia.artworkFile.fileUrl, type: this.item.nftMedia.artworkFile.type }
        ],
        fluid: false
      }
      return videoOptions
    },
    bannerImage () {
      let imageUrl = this.item.nftMedia.imageUrl
      if (!imageUrl) {
        imageUrl = this.waitingImage
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](imageUrl)
    },
    assetUrl () {
      return '/nft-preview/' + this.item.assetHash
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
