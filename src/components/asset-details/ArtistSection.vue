<template>
<section v-if="content" :class="'theme-' + content.uid" class="container-fluid p-5">
  <div class="spaced-name">{{content.data.description[0].text}}</div>
  <b-container>
    <b-row style="margin-bottom: 100px">
      <b-col cols="12" lg="6" class="pr-lg-5 mb-lg-0 mb-5">
        <img style="width: 100%;" :src="content.data.image.url"/>
      </b-col>
      <b-col cols="12" lg="6" align-self="end" class="text-left pl-lg-5">
        <h1 class="text-white">{{content.data.description[1].text}}</h1>
        <div class="artist-section--text">{{content.data.description[2].text}}</div>
        <social-links class="mt-4" :themeClass="'theme-' + content.uid" :socialLinks="content.data['social_links']" />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SocialLinks from './SocialLinks'
import Vue from 'vue'

export default {
  name: 'ArtistSection',
  components: {
    SocialLinks
  },
  props: ['artistId', 'parentPage'],
  data: function () {
    return {
      assetHash: null,
      videoHeight: null
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    Vue.nextTick(function () {
      const vid = document.getElementById('video-column')
      if (vid) this.videoHeight = vid.clientWidth
    }, this)
  },
  methods: {
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
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff;
}
.spaced-name {
  margin: -3rem -3rem 8rem auto;
  line-height: 0.6;
  max-width: 952px;
  white-space: nowrap;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 15rem;
  color: #FFFFFF;
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
