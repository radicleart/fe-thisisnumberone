<template>
<div id="chemicalx">
<section>
  <artist-section :artistId="'chemicalx'" :parentPage="'about'" />
</section>
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
  data () {
    return {
      quotes: require('@/assets/img/Blackswannew_fat_font.jpg')
    }
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
