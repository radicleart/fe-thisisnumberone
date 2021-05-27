<template>
  <section class="my-5 container text-white" v-if="content">
    <h1 class="pt-5">{{ this.$route.params.infoId }}</h1>
    <div class="row">
      <div class="col-12">
        <prismic-items :prismicItems="content" class="child-information"/>
      </div>
    </div>
  </section>
  <section class="my-5 container text-white" v-else>
    <div class="row">
      <div class="col-12">
        Content missing for key {{getKey()}}
      </div>
    </div>
  </section>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'HowItWorks',
  components: {
    PrismicItems
  },
  data () {
    return {
    }
  },
  methods: {
    getKey: function () {
      return this.$route.params.infoId
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_INFO_PAGE](this.$route.params.infoId)
      // if (!content) content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_INFO_PAGE]('info-privacy-policy')
      if (content && content.data && content.data.information) return content.data.information
      return null
    }
  }
}
</script>
<style scoped>
h1 {
  text-transform: uppercase !important;
  color: #FF9900 !important;
  font-size: 4.0rem !important;
}
div >>> .child-information h2 {
  color: white !important;
  font-size: 3.0rem !important;
  font-weight: 900 !important;
  margin-top: 8rem !important;
}
div >>> .child-information h3 {
  font-size: 2.5rem !important;
  margin-top: 3rem !important;
}
div >>> .child-information p {
  max-width: 700px;
  text-align: justify;
}
.child-information {
  margin-bottom: 5rem;
  margin-top: -3rem;
}
</style>
