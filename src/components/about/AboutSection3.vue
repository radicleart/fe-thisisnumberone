<template>
<div id="chemicalx">
<div id="about-number-3">
<section class="bg-black">
  <artist-section :artistId="'chemicalx'" :parentPage="'about'" />
</section>
</div>
</div>
</template>

<script>
import ArtistSection from '@/components/asset-details/ArtistSection'

export default {
  name: 'AboutSection3',
  components: {
    ArtistSection
  },
  props: ['content'],
  computed: {
  }
}
</script>

<style>
#about-number-3 h1 {
  color: #FF9900 !important;
}

</style>
