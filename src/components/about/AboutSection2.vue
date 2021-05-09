<template>
<section id="thisisone" class="about-section bg-white text-black">
  <b-container style="min-height: 60vh" class="pb-4 text-center">
    <b-row align-h="center" style="min-height: 91vh">
      <b-col md="8" sm="10" align-self="center">
        <div class="mt-2"><img height="36px" :src="rainbowOne" alt="logo"/></div>
        <div class="mb-5 mt-1"><span class="mr-2" style="font-size: 45px;font-weight: bold; position: relative; top: 15px;opacity: 1;">THIS IS</span></div>
        <div class="text-left">
          <prismic-items :prismicItems="content.section2rtf1"></prismic-items>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'AboutSection2',
  components: {
    PrismicItems
  },
  props: ['content'],
  data () {
    return {
      rainbowOne: require('@/assets/img/Group 76.svg')
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
/* General style */
section {
  padding: 20px 0;
}
h1 {
  font-size: 3rem;
  color: #333333 !important;
}
.section2-text {
  max-width: 600px;
  color: #888888;
  font-size: 1.5rem;
  margin: 0 auto;
}
</style>
