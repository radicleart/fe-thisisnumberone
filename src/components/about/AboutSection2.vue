<template>
<section class="about-section bg-white text-black">
  <b-container class="">
    <b-row style="text-align: center; min-height: 60vh" class="pb-4 text-center">
      <b-col cols="12" align-self="start">
        <div class="my-4 mt-5"><span class="mr-2" style="font-size: 45px;font-weight: bold; position: relative; top: 15px;opacity: 1;">THIS IS</span> <img height="36px" :src="rainbowOne" alt="logo"/></div>
      </b-col>
      <b-col cols-lg="6" cols-md="6" cols-sm="12" align-self="start">
        <h1 class="mb-4">{{content.section2rtf1[0].text}}</h1>
        <div class="section2-text">{{content.section2rtf1[1].text}}</div>
      </b-col>
    </b-row>
  </b-container>
</section>
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

<style lang="scss">
h1 {
  color: #333333 !important;
}
.section2-text {
  max-width: 700px;
  color: #888888;
  font-size: 1.5rem;
  margin: 0 auto;
}
</style>
