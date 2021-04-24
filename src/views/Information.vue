<template>
  <section id="section1" class="my-5 container text-white" v-if="content">
    <div class="row">
      <div class="col-12">
        <prismic-items :prismicItems="content"/>
      </div>
    </div>
  </section>
  <section id="section1" class="my-5 container text-white" v-else>
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
<style lang="scss">
</style>
