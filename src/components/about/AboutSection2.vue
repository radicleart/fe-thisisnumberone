<template>
<div>
  <div id="thisisone"></div>
  <section id="about-number-2" class="about-section bg-white text-black">
    <b-container style="min-height: 60vh" class="pb-4 text-center">
      <b-row align-h="center" style="min-height: 91vh">
        <b-col md="8" sm="10" align-self="center">
          <!-- <div class="mt-2"><img height="36px" :src="rainbowOne" alt="logo"/></div> -->
          <div class="text-center">
            <prismic-items :prismicItems="content.section2rtf1"></prismic-items>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</div>
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

<style lang="scss">
/* General style */
#thisisone {
  height: 90px;
  background-color: transparent;
  z-index: 10;
}

section {
  padding: 20px 0;
}
#about-number-2 p {
  text-align: left;
}
#about-number-2 img {
  text-align: center;
  width: 100px;
  margin-top: 30px;
  margin-bottom: 30px;
}
#about-number-2 h4 {
  text-align: left;
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 10px;
}
h1 {
  font-size: 3rem;
  color: #333333;
}
.section2-text {
  max-width: 600px;
  color: #888888;
  font-size: 1.5rem;
  margin: 0 auto;
}
</style>
