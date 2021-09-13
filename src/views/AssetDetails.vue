<template>
<div>
  <div v-if="!loading && gaiaAsset">
    <asset-details-section :gaiaAsset="gaiaAsset" />
    <artist-section id="artist-section" :parentPage="'about'" :artistId="getArtistPrismicId()" />
    <charity-section :showButton="false" id="charity-section" :artistId="getArtistPrismicId()" />
    <section id="number-one-section" class="">
      <number-one-section />
    </section>
  </div>
</div>
</template>

<script>
import AssetDetailsSection from '@/components/asset-details/AssetDetailsSection'
import ArtistSection from '@/components/asset-details/ArtistSection'
import CharitySection from '@/components/asset-details/CharitySection'
import NumberOneSection from '@/components/asset-details/NumberOneSection'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AssetDetails',
  components: {
    AssetDetailsSection,
    CharitySection,
    ArtistSection,
    NumberOneSection
  },
  data: function () {
    return {
      nftIndex: null,
      assetHash: null,
      loading: true
    }
  },
  mounted () {
    if (this.$route.name === 'asset-by-index') {
      this.nftIndex = Number(this.$route.params.nftIndex)
      this.$store.dispatch('rpayStacksContractStore/fetchAssetByNftIndex', this.nftIndex).then(() => {
        this.$store.dispatch('assetGeneralStore/cacheUpdate', { nftIndex: this.nftIndex })
        this.loading = false
      })
    } else {
      this.assetHash = this.$route.params.assetHash
      this.$store.dispatch('rpayStacksContractStore/fetchAssetByHash', this.assetHash).then(() => {
        this.$store.dispatch('assetGeneralStore/cacheUpdate', { assetHash: this.assetHash })
        this.loading = false
      })
    }
  },
  methods: {
    getArtistPrismicId () {
      const artistId = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](this.gaiaAsset.artist)
      return artistId
    }
  },
  computed: {
    gaiaAsset () {
      if (this.nftIndex || this.nftIndex === 0) {
        return this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_NFT_INDEX](this.nftIndex)
      } else {
        return this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.assetHash)
      }
    }
  }
}
</script>

<style scoped>
</style>
