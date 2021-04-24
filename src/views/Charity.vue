<template>
<div>
  <div class="mt-3" v-if="gaiaAsset">
    <charity-section id="charity-section" :artistId="getArtistPrismicId(gaiaAsset.artist)" />
  </div>
</div>
</template>

<script>
import CharitySection from '@/components/asset-details/CharitySection'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'Charity',
  components: {
    CharitySection
  },
  data () {
    return {
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME)
  },
  methods: {
    getArtistPrismicId (artist) {
      const artistId = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](artist)
      return artistId
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

<style>
#deep-logos li {
  cursor: pointer;
}
</style>
