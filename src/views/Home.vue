<template>
<section id="homeSection" v-if="slices">
  <div class="container home-content">
    <div class="row">
      <div class="col-md-6 col-sm-12 text-white">
        <slices-block :rootId="'home-slice-'" :slices="slices" class="outer-container"/>
        <p><b-button variant="light" to="/upload-item">Protect Your Music</b-button></p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import SlicesBlock from '@/components/prismic/SlicesBlock.vue'

export default {
  name: 'Home',
  components: {
    SlicesBlock
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
  },
  computed: {
    slices () {
      const content = this.$store.getters['contentStore/getHomepage']
      return (content) ? content.body : null
    },
    buttonLabel () {
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) return null
      return content.credits[0].text
    }
  }
}
</script>

<style>
.home-content {
  position: relative;
  top: 140px;
}
#homeSection h2 {
  margin-bottom: 10px;
  font-size: 3.4rem;
}
#homeSection h3 {
  margin-bottom: 50px;
}
#homeSection p {
  margin-bottom: 20px;
}
</style>
