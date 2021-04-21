<template>
<div>
  <div class="mt-3" v-if="gaiaAsset">
    <asset-details-section :gaiaAsset="gaiaAsset" />
    <artist-section id="artist-section" :artistId="getArtistPrismicId(gaiaAsset.artist)" />
    <charity-section id="charity-section" />
  </div>
</div>
</template>

<script>
import AssetDetailsSection from '@/components/asset-details/AssetDetailsSection'
import ArtistSection from '@/components/asset-details/ArtistSection'
import CharitySection from '@/components/asset-details/CharitySection'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'AssetDetails',
  components: {
    AssetDetailsSection,
    CharitySection,
    ArtistSection
  },
  data: function () {
    return {
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME)
  },
  methods: {
    getArtistPrismicId (artist) {
      return artist.toLowerCase().replace(/ /g, '')
    }
  },
  computed: {
    gaiaAsset () {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.$route.params.assetHash)
      // if (!gaiaAsset) gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.$route.params.assetHash)
      return gaiaAsset
    }
  }
}
</script>

<style scoped>
</style>
