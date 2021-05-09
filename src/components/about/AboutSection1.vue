<template>
<section id="about-number-1" v-if="content">
  <b-container class="">
    <b-row style="height: 92vh" class="text-center">
      <b-col class="mx-md-5 mx-sm-3" cols-md="6" cols-sm="6" align-self="center" v-if="content.section1rtf1.length > 1">
        <img class="mb-5" width="300px;" :src="rainbowOne" alt="site logo" />
        <div class="mt-5 text-white text-center section1-description">{{content.section1rtf1[0].text}}</div>
        <div class="mt-5 text-white text-center section1-description">{{content.section1rtf1[1].text}}</div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
export default {
  name: 'AboutSection1',
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

<style scoped>
/* General style */
h1 {
  font-size: 3rem;
}
.section1-description {
  font-size: 1.8rem;
  max-width: 455px;
  margin: 0 auto;
}

</style>
