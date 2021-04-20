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
  <div class="link-panel bg-white d-flex justify-content-center">
    <div class="d-flex justify-content-center text-black link-panel--container">
      <div class="d-flex justify-content-around link-panel--content">
        <b-link router-tag="span" to="#thisisone">This is #1</b-link>
        <b-link router-tag="span" to="#chemicalx">Chemical X</b-link>
        <b-link router-tag="span" to="#charity">Charity</b-link>
        <b-link router-tag="span" to="#environment">Environment</b-link>
        <b-link router-tag="span" to="#collaborate">Collaborate</b-link>
      </div>
    </div>
  </div>
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
.link-panel--container {
  width: 100%;
  padding: 30px 0;
  box-shadow: 0px 3px 6px #00000029;
}
.link-panel--content {
  width: 50%;
  color: #333333;
  font-size: 1.4rem;
}
h1 {
  font-size: 3rem;
}
.section1-description {
  font-size: 1.8rem;
  max-width: 455px;
  margin: 0 auto;
}

/* Link panel responsive design */
@media only screen and (max-width: 768px) {
  .link-panel--content {
    width: 70%;
  }
}
@media only screen and (max-width: 600px) {
  .link-panel--content {
    width: 100%;
  }
}
@media only screen and (max-width: 376px) {
  .link-panel--content {
    font-size: 1.2rem;
  }
}
</style>
