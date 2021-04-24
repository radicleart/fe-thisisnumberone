<template>
<section v-if="content" :class="getArtistBgTheme()" class="container-fluid p-5">
  <div class="spaced-name">{{content.data.description[0].text}}</div>
  <b-container>
    <b-row style="margin-bottom: 100px">
      <b-col cols="12" lg="6" class="pr-lg-5 mb-lg-0 mb-5">
        <img style="width: 100%;" :src="content.data.image.url"/>
      </b-col>
      <b-col cols="12" lg="6" align-self="end" class="text-left pl-lg-5">
        <h1 :class="getArtistText1()" v-if="content.data.description[1]">{{content.data.description[1].text}}</h1>
        <div class="artist-section--text" :class="getArtistText2()" v-if="content.data.description[2]">{{content.data.description[2].text}}</div>
        <div class="artist-section--text" :class="getArtistText2()" v-if="content.data.description[3]">{{content.data.description[3].text}}</div>
        <div class="artist-section--text" :class="getArtistText2()" v-if="content.data.description[4]">{{content.data.description[4].text}}</div>
        <div class="artist-section--text" :class="getArtistText2()" v-if="content.data.description[5]">{{content.data.description[5].text}}</div>
        <social-links class="mt-4" :themeClass="getArtistText1()" :socialLinks="content.data['social_links']" />
        <div>
          <square-button :theme="'light'" :label1="'Find out more'" :icon="'chat-left'" :route="'/charity/' + content.data.artist_id[0].text"/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SocialLinks from './SocialLinks'
import SquareButton from '@/components/utils/SquareButton'

export default {
  name: 'ArtistSection',
  components: {
    SocialLinks,
    SquareButton
  },
  props: ['artistId'],
  data: function () {
    return {
    }
  },
  methods: {
    getArtistBgTheme: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const bgcolor = content.data.theme[0].text.split(',')[0]
        return 'bg-' + bgcolor
      } catch {
        return 'bg-primary text-info text-danger'
      }
    },
    getArtistText1: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const fgcolor = content.data.theme[0].text.split(',')[1]
        return 'text-' + fgcolor
      } catch {
        return 'text-info'
      }
    },
    getArtistText2: function () {
      try {
        const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
        const fgcolor = content.data.theme[0].text.split(',')[2]
        return 'text-' + fgcolor
      } catch {
        return 'text-info'
      }
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITY_BY_ARTIST_ID](this.artistId)
      return content
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
.spaced-name {
  margin: -3rem -3rem 8rem auto;
  line-height: 0.6;
  max-width: 952px;
  white-space: nowrap;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 15rem;
  text-transform: uppercase;
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
  .spaced-name {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 787px) {
  .spaced-name {
    font-size: 8rem;
  }
}
@media only screen and (max-width: 600px) {
  .spaced-name {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 475px) {
  .spaced-name {
    font-size: 5rem;
  }
}
@media only screen and (max-width: 350px) {
  .spaced-name {
    font-size: 4rem;
  }
}

</style>
