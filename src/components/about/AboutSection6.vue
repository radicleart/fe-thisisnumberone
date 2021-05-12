<template>
<div id="collaborate">
<section class="bg-black" id="about-section6">
  <b-container class="py-5">
    <b-row style="height: 20vh">
      <b-col class="offset-md-2 col-md-8" align-self="left">
        <h1 class="mb-4">{{content.section6rtf1[0].text}}</h1>
        <div class="mb-5 about-section6--text" v-html="adaptedText"></div>
        <!-- <div>
          <square-button @clickButton="$router.push('/home')" class="button-style" :label1="'Get in touch'" :icon="'chat-left'" :colorOnHover="'black'"/>
        </div> -->
      </b-col>
    </b-row>
  </b-container>
</section>
</div>
</template>

<script>
// import SquareButton from '@/components/utils/SquareButton'
export default {
  name: 'AboutSection6',
  props: ['content'],
  components: {
    // SquareButton
  },
  data () {
    return {
      adaptedText: ''
    }
  },
  mounted () {
    let change = this.content.section6rtf1[1].text
    change = change.replace('collaborate@thisisnumberone.com', '<span style="color: #FF9900">collaborate@thisisnumberone.com</span>')
    console.log(change)
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
  margin: auto;
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
