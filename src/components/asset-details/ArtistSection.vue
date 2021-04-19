<template>
<section v-if="content" :class="'theme-' + content.uid" class="container-fluid p-5 hundred-vh">
  <b-container>
    <b-row>
      <b-col cols="12" class="text-right">
        <p class="spaced-name">{{content.data.description[0].text}}</p>
      </b-col>
    </b-row>
    <b-row style="text-align: center; height: 50vh" class="text-center">
      <b-col cols="6">
        <img style="width: 100%;" :src="content.data.image.url"/>
      </b-col>
      <b-col cols="6" align-self="center" class="text-left">
        <h1>{{content.data.description[1].text}}</h1>
        <div>{{content.data.description[2].text}}</div>
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
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff;
}
.spaced-name {
  position: relative;
  right: -180px;
  top: -90px;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 6rem;
  font-weight: normal;
  letter-spacing: 10px;
  color: #FFFFFF;
  opacity: 1;
  text-transform: uppercase;
}
</style>
