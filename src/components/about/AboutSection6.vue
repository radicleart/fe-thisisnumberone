<template>
<div id="collaborate">
<section class="bg-black" id="about-section6">
  <b-container class="py-5 center-section">
    <b-row style="min-height: 30vh">
      <b-col class="offset-md-2 col-md-8">
        <h1 class="mb-4">{{content.section6rtf1[0].text}}</h1>
        <div class="mb-5 about-section6--text" v-html="adaptedText"></div>
      </b-col>
    </b-row>
  </b-container>
</section>
</div>
</template>

<script>
export default {
  name: 'AboutSection6',
  props: ['content'],
  components: {
  },
  data () {
    return {
      adaptedText: ''
    }
  },
  mounted () {
    let change = this.content.section6rtf1[1].text
    change = change.replace('collaborate@thisisnumberone.com', '<span style="color: #FF9900">collaborate@thisisnumberone.com</span>')
    this.adaptedText = change
  }
}
</script>

<style>
/* General style */
#about-section6 h1 {
  font-size: 3rem;
  color: #FF9900;
}
#about-section6 .about-section6--text {
  font-size: 1.6rem;
  color: white;
  max-width: 700px;
}
/* Button style */
#about-section6 .button-style button, .button-style button:hover {
  border-color: #2255A4;
}
#about-section6 .button-style button:first-child {
  background-color: #2255A4;
}
#about-section6 .button-style button:last-child {
  color: #2255A4 !important;
}
</style>
