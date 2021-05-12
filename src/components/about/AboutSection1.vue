<template>
<section id="about-number-1" v-if="content">
  <b-container class="text-center">
    <b-row style="height: 92vh" align-h="center">
      <b-col class="text-white mx-md-5 mx-sm-3" md="6" sm="6" align-self="center">
        <img class="mb-5" width="300px;" :src="rainbowOne" alt="site logo" />
        <prismic-items :prismicItems="content.section1rtf1"></prismic-items>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'
export default {
  name: 'AboutSection1',
  components: {
    PrismicItems
  },
  props: ['content'],
  data () {
    return {
      rainbowOne: 'https://images.prismic.io/dbid/a70b331a-ee92-4d98-81e4-659f2edadba1_Number1_build3.gif?auto=compress,format'
    }
  },
  computed: {
  }
}
</script>

<style>
#about-number-1 p {
  text-align: center;
}

/* General style */
#about-number-1 h1 {
  font-size: 3rem;
}
#about-number-1 .section1-description {
  font-size: 1.8rem;
  max-width: 455px;
  margin: 0 auto;
}

</style>
