<template>
<div>
  <div class="mt-3" v-if="gaiaAsset">
    <asset-details-section :gaiaAsset="gaiaAsset" />
    <artist-section :artistId="getArtistPrismicId(gaiaAsset.artist)" />
    <charity-section />
  </div>
</div>
</template>

<script>
import AssetDetailsSection from '@/components/asset-details/AssetDetailsSection'
import ArtistSection from '@/components/asset-details/ArtistSection'
import CharitySection from '@/components/asset-details/CharitySection'
import { APP_CONSTANTS } from '@/app-constants'

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
    this.findAssets()
  },
  methods: {
    getArtistPrismicId (artist) {
      return artist.toLowerCase().replace(/ /g, '')
    },
    findAssets () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      let searchKey = 'rpaySearchStore/findBySearchTerm'
      let arg = Object.assign({}, this.$route.query)
      if (configuration.risidioProjectId) {
        searchKey = 'rpaySearchStore/findByProjectId'
        arg = configuration.risidioProjectId
      }
      this.$store.dispatch(searchKey, arg).then((results) => {
        this.results = results
      })
    }
  },
  computed: {
    gaiaAsset () {
      let gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.$route.params.assetHash)
      if (!gaiaAsset) gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.$route.params.assetHash)
      return gaiaAsset
    }
  }
}
</script>

<style scoped>
</style>
