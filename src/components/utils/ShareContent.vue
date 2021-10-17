<template>
<div class="d-flex justify-content-between">
  <ShareNetwork v-if="network"
      :network="network"
      :url="assetUrl()"
      :title="title()"
      :description=gaiaAsset.description
      :quote="'Stacks Network - the user owned Internet uses Smart Contracts on Bitcoin'"
      :hashtags="gaiaAsset.artist"
    >
    <b-icon width="20" height="20" class="text-white" :icon="icon"/>
  </ShareNetwork>
</div>
</template>

<script>

export default {
  name: 'ShareContent',
  components: {
  },
  props: ['network', 'gaiaAsset', 'icon'],
  data () {
    return {
    }
  },
  methods: {
    title: function () {
      if (this.gaiaAsset.contractAsset) {
        return '#' + this.gaiaAsset.contractAsset.nftIndex + ' ' + this.gaiaAsset.name + ' @loopb0mb #NFTs Immutable Collectibles Minted with @Stacks on #Bitcoin'
      }
      return '#? ' + this.gaiaAsset.name + ' @thisisnumberone #NFTs Immutable Collectibles Minted with @Stacks on #Bitcoin'
    },
    assetUrl: function () {
      if (this.$route.name === 'item-preview') {
        if (this.gaiaAsset.contractAsset) {
          return 'https://thisisnumberone.com/nfts/' + this.gaiaAsset.contractAsset.nftIndex
        }
        return 'https://thisisnumberone.com/nft-marketplace'
      }
      if (window.location.href.indexOf('localhost') > -1) {
        return 'https://thisisnumberone.com' + window.location.pathname
      }
      return window.location.href
    },
    imageUrl: function () {
      if (this.gaiaAsset.image) {
        return this.gaiaAsset.image
      }
      return this.gaiaAsset.attributes.artworkFile.fileUrl
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
