<template>
<section v-if="content" class="container-fluid p-5 hundred-vh bg-white text-black">
  <b-container>
    <b-row>
      <div id="video-column" class="col-md-6 col-sm-12" v-if="content && content.image">
        <img :src="content.image.url" width="100%"/>
      </div>
      <div class="col-md-6 col-sm-12">
        <b-row align-v="stretch" :style="'height:' + videoHeight + 'px;'">
          <b-col cols="12"><router-link to="/"><b-icon icon="chevron-left" shift-h="-4" variant="danger"></b-icon> Back</router-link></b-col>
          <b-col cols="12" align-self="end">
            <b-col cols="12">
              <prismic-items :prismicItems="content.description"></prismic-items>
            </b-col>
            <b-col cols="12" align-self="end">
              <social-links :socialLinks="content['social_links']" />
            </b-col>
          </b-col>
        </b-row>
      </div>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PrismicItems from '@/components/prismic/PrismicItems'
import SocialLinks from './SocialLinks'
import Vue from 'vue'

export default {
  name: 'ArtistSection',
  components: {
    PrismicItems,
    SocialLinks
  },
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
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      if (!item) return
      let prismicId = 'caravaggio'
      if (item.prismicId) prismicId = item.prismicId
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ARTIST_BY_ID](prismicId)
      return (content && content.data) ? content.data : {}
    }
  }
}
</script>

<style scoped>
</style>
