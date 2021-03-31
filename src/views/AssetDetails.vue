<template>
<div>
  <div class="mt-3" v-if="loading">
    {{message}}
  </div>
  <asset-details-section />
  <artist-section />
  <charity-section />
</div>
</template>

<script>
import AssetDetailsSection from '@/components/asset-details/AssetDetailsSection'
import ArtistSection from '@/components/asset-details/ArtistSection'
import CharitySection from '@/components/asset-details/CharitySection'

export default {
  name: 'AssetDetails',
  components: {
    AssetDetailsSection,
    CharitySection,
    ArtistSection
  },
  data: function () {
    return {
      loading: true,
      message: 'loading siite...'
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      this.loading = false
      if (!item) {
        this.$router.push('/404')
      }
    })
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
