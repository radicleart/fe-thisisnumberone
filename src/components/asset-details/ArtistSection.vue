<template>
<section v-if="content" :class="getArtistTheme()">
  <!-- <div class="spaced-name spaced-name--artist-section" :class="getArtistText1()">{{content.data.description[0].text}}</div> -->
  <b-container fluid class="center-section">
    <b-row align-h="center">
      <b-col align-self="end" md="6" sm="10" xs="8" class="d-flex justify-content-end mb-5">
        <img style="width: 100%; max-width: 450px;" :src="content.data.image.url"/>
      </b-col>
      <b-col md="6" sm="10" xs="8" align-self="end" class="text-left text-white">
        <prismic-items :prismicItems="content.data.description"></prismic-items>
        <social-links class="mt-5" :themeClass="getArtistText1()" :socialLinks="content.data['social_links']" />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SocialLinks from './SocialLinks'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'ArtistSection',
  components: {
    SocialLinks,
    PrismicItems
  },
  props: ['artistId', 'parentPage'],
  data: function () {
    return {
    }
  },
  methods: {
    getArtistTheme: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_BY_ID](this.artistId)
        const bgcolor = content.data.theme[0].text.split(',')[0]
        const fgcolor = content.data.theme[0].text.split(',')[1]
        return 'bg-' + bgcolor + ' text-' + fgcolor
      } catch {
        return 'bg-primary text-info text-danger'
      }
    },
    getArtistText1: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_BY_ID](this.artistId)
        const fgcolor = content.data.theme[0].text.split(',')[2]
        return 'text-' + fgcolor
      } catch {
        return 'text-info'
      }
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_BY_ID](this.artistId)
      return (content && content.data) ? content : null
    }
  }
}
</script>

<style scoped>
/* General style */
section {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 100vh;
}

.spaced-name--artist-section {
  margin: -3.5rem -3rem 8rem auto;
  max-width: 952px;
  text-align: right;
  font-size: 15rem;
}
h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}
.artist-section--text {
  font-size: 1.4rem;
}

/* Spaced name responsive design */
@media only screen and (max-width: 1023px) {
  .spaced-name--artist-section {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 787px) {
  .spaced-name--artist-section {
    font-size: 8rem;
  }
}
@media only screen and (max-width: 600px) {
  .spaced-name--artist-section {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 475px) {
  .spaced-name--artist-section {
    font-size: 5rem;
  }
}
@media only screen and (max-width: 350px) {
  .spaced-name--artist-section {
    font-size: 4rem;
  }
}
</style>
