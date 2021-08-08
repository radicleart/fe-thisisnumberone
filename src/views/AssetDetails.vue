<template>
<div>
  <div v-if="gaiaAsset">
    <asset-details-section :gaiaAsset="gaiaAsset" />
    <artist-section id="artist-section" :parentPage="'about'" :artistId="getArtistPrismicId(gaiaAsset.artist)" />
    <charity-section :showButton="false" id="charity-section" :artistId="getArtistPrismicId(gaiaAsset.artist)" />
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
    }
  },
  mounted () {
    if (this.$route.name === 'asset-by-index') {
      this.$store.dispatch('rpayStacksContractStore/fetchAssetByNftIndex', this.$route.params.nftIndex)
      this.$store.dispatch('assetGeneralStore/cacheUpdate', { nftIndex: this.$route.params.nftIndex })
    } else {
      this.$store.dispatch('rpayStacksContractStore/fetchAssetByHash', this.$route.params.assetHash)
      this.$store.dispatch('assetGeneralStore/cacheUpdate', { assetHash: this.$route.params.assetHash })
    }
  },
  methods: {
    getArtistPrismicId (artist) {
      const artistId = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](artist)
      return artistId
    }
  },
  computed: {
    gaiaAsset () {
      if (this.$route.name === 'asset-by-index') {
        return this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_NFT_INDEX](Number(this.$route.params.nftIndex))
      } else {
        return this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.$route.params.assetHash)
      }
    }
  }
}
</script>

<style scoped>
</style>
