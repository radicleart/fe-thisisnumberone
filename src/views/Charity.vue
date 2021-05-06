<template>
<div>
  <div class="mt-3" v-if="artistId">
    <charity-section :showButton="false" id="charity-section" :artistId="getArtistPrismicId()" />
    <number-one-section />
  </div>
</div>
</template>

<script>
import CharitySection from '@/components/asset-details/CharitySection'
import NumberOneSection from '@/components/asset-details/NumberOneSection'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Charity',
  components: {
    CharitySection,
    NumberOneSection
  },
  data () {
    return {
      artistId: null
    }
  },
  mounted () {
    this.artistId = this.$route.params.charityId
  },
  methods: {
    getArtistPrismicId () {
      const artist = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_ID](this.artistId)
      return artist
    }
  },
  computed: {
  }
}
</script>

<style>
#deep-logos li {
  cursor: pointer;
}
</style>
