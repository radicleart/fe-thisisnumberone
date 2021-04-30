<template>
<section class="" id="section1">
  <b-container class="">
    <b-row style="height: 92vh" class="text-center">
      <b-col cols="12" align-self="end"><div class="text-white"><b-icon style="width: 60px; height: 60px;" icon="film"/></div></b-col>
      <b-col class="mx-md-5 mx-sm-3" cols-md="6" cols-sm="6" align-self="center">
        <h1 class="mb-4 text-white">{{content.section1rtf1[0].text}}</h1>
        <div class="text-white text-center section1-description">{{content.section1rtf1[1].text}}</div>
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
