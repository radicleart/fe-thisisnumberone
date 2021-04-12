<template>
<div>
  <div class="mt-3" v-if="gaiaAsset">
    <asset-details-section :gaiaAsset="gaiaAsset" />
    <artist-section />
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
  },
  methods: {
  },
  computed: {
    gaiaAsset () {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](this.$route.params.assetHash)
      return gaiaAsset
    }
  }
}
</script>

<style scoped>
</style>
