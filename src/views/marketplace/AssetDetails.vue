<template>
<div id="asset-details">
  <div v-if="!loading && gaiaAsset && loopRun">
    <AssetDetailsSectionV1 :gaiaAsset="gaiaAsset" :loopRun="loopRun"/>
    <ArtistSection id="artist-section" :parentPage="'about'" :artistId="getArtistPrismicId()" />
    <CharitySection :showButton="false" id="charity-section" :artistId="getArtistPrismicId()" />
    <section id="number-one-section" class="">
      <NumberOneSection />
    </section>
  </div>
</div>
</template>

<script>
import AssetDetailsSectionV1 from '@/views/marketplace/components/gallery/AssetDetailsSectionV1'
import ArtistSection from '@/components/asset-details/ArtistSection'
import CharitySection from '@/components/asset-details/CharitySection'
import NumberOneSection from '@/components/asset-details/NumberOneSection'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AssetDetails',
  components: {
    AssetDetailsSectionV1,
    CharitySection,
    ArtistSection,
    NumberOneSection
  },
  data: function () {
    return {
      nftIndex: null,
      assetHash: null,
      loading: true,
      gaiaAsset: null,
      loopRun: null,
      contractId: null
    }
  },
  mounted () {
    this.contractId = this.$route.params.contractId
    if (this.$route.name === 'asset-by-index') {
      this.nftIndex = Number(this.$route.params.nftIndex)
      this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndNftIndex', { contractId: this.contractId, nftIndex: this.nftIndex }).then((gaiaAsset) => {
        this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.parseRunKey(gaiaAsset)).then((loopRun) => {
          this.gaiaAsset = gaiaAsset
          this.loopRun = loopRun
          this.$store.dispatch('rpayManageCacheStore/cacheUpdate', { contractId: this.contractId, nftIndex: this.nftIndex })
          this.loading = false
        })
      })
    } else {
      this.assetHash = this.$route.params.assetHash
      this.$store.dispatch('rpayStacksContractStore/fetchTokenByContractIdAndAssetHash', { contractId: this.contractId, assetHash: this.assetHash }).then((gaiaAsset) => {
        this.gaiaAsset = gaiaAsset
        this.$store.dispatch('rpayManageCacheStore/cacheUpdate', { contractId: this.contractId, assetHash: this.assetHash })
        this.loading = false
      })
    }
  },
  methods: {
    parseRunKey (gaiaAsset) {
      if (gaiaAsset.currentRunKey) {
        return (gaiaAsset.currentRunKey.indexOf('/') > -1) ? gaiaAsset.currentRunKey.split('/')[0] : gaiaAsset.currentRunKey
      }
      return process.env.VUE_APP_DEFAULT_LOOP_RUN
    },
    getArtistPrismicId () {
      const artistId = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](this.gaiaAsset.artist)
      return artistId
    }
  },
  computed: {
    gaiaAsset1 () {
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
