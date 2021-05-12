<template>
<section id="asset-charity" v-if="content" :class="getArtistBgTheme()">
  <b-container class="center-section" v-for="(charity, index) in content" :key="index">
    <b-row align-h="center" v-if="(index % 2) === 0">
      <b-col md="6" sm="10" xs="8" align-self="end" class="text-left" style="max-width: 450px; position: relative; top: 15px;">
        <prismic-items :prismicItems="charity.data.description"></prismic-items>
        <social-links :type="'socials'" class="mt-4" :themeClass="getArtistText1()" :socialLinks="charity.data['social_links']" />
        <div v-if="showButton">
          <square-button :theme="'dark'" :label1="'Find out more'" :icon="'chat-left'" :route="'/charity/' + charity.data.artist_id[0].text" :usePixelBg="true"/>
        </div>
      </b-col>
      <b-col align-self="end" md="6" sm="10" xs="8" class="d-flex justify-content-start">
        <img style="width: 100%; max-width: 450px;" :src="charity.data.image.url"/>
      </b-col>
    </b-row>
    <b-row align-h="center" v-else>
      <b-col align-self="end" md="6" sm="10" xs="8" class="d-flex justify-content-start">
        <img style="width: 100%; max-width: 450px;" :src="charity.data.image.url"/>
      </b-col>
      <b-col md="6" sm="10" xs="8" align-self="end" class="text-left" style="max-width: 450px; position: relative; top: 15px; left: 0px;">
        <prismic-items :prismicItems="charity.data.description"></prismic-items>
        <social-links :type="'socials'" class="mt-4" :themeClass="getArtistText1()" :socialLinks="charity.data['social_links']" />
        <div v-if="showButton">
          <square-button :theme="'dark'" :label1="'Find out more'" :icon="'chat-left'" :route="'/charity/' + charity.data.artist_id[0].text" :usePixelBg="true"/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SocialLinks from '@/components/utils/SocialLinks'
import SquareButton from '@/components/utils/SquareButton'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'ArtistSection',
  components: {
    SocialLinks,
    SquareButton,
    PrismicItems
  },
  props: ['artistId', 'showButton'],
  data: function () {
    return {
    }
  },
  methods: {
    getArtistBgTheme: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const bgcolor = content[0].data.theme[0].text.split(',')[0]
        return 'bg-' + bgcolor
      } catch {
        return 'bg-primary text-info text-danger'
      }
    },
    getArtistText1: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const fgcolor = content[0].data.theme[0].text.split(',')[1]
        return 'text-' + fgcolor
      } catch {
        return 'text-info'
      }
    },
    getArtistText2: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const fgcolor = content[0].data.theme[0].text.split(',')[2]
        return 'text-' + fgcolor
      } catch {
        return 'text-info'
      }
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
      return (content && content.length > 0) ? content : null
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
  min-height: 70vh;
}
.center-section {
  margin: auto;
  width: 90%;
  border: 0px solid green;
  padding: 50px 10px;
}
@media only screen and (max-width: 900px) {
  .center-section {
    width: 85%;
  }
}

h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}
</style>
