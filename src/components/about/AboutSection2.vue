<template>
<div id="thisisone">
<section class="about-section bg-white text-black">
  <b-container style="min-height: 60vh" class="pb-4 text-center">
    <div class="my-4 mt-5"><span class="mr-2" style="font-size: 45px;font-weight: bold; position: relative; top: 15px;opacity: 1;">THIS IS</span> <img height="36px" :src="rainbowOne" alt="logo"/></div>
    <h1 class="mb-4">{{content.section2rtf1[0].text}}</h1>
    <div class="section2-text">{{content.section2rtf1[1].text}}</div>
  </b-container>
</section>
</div>
</template>

<script>

export default {
  name: 'AboutSection2',
  components: {
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
