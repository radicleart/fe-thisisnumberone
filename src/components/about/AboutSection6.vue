<template>
<div id="collaborate">
<section class="bg-white text-black" id="about-section6">
  <b-container class="py-5">
    <b-row style="text-align: center; height: 92vh" class="text-center">
      <b-col cols="12" align-self="center">
        <h1 class="mb-4 text-info">{{content.section6rtf1[0].text}}</h1>
        <div class="mb-5 text-center about-section6--text">{{content.section6rtf1[1].text}}</div>
        <div>
          <square-button @clickButton="$router.push('/home')" class="button-style" :label1="'Get in touch'" :icon="'chat-left'" :colorOnHover="'black'"/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</div>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'
export default {
  name: 'AboutSection6',
  props: ['content'],
  components: {
    SquareButton
  },
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<style>
/* General style */
#about-section6 h1 {
  font-size: 3rem;
}
#about-section6 .about-section6--text {
  font-size: 1.4rem;
  color: #000000;
  max-width: 700px;
  margin: 0 auto;
}

/* Button style */
#about-section6 .button-style button, .button-style button:hover {
  border-color: #2255A4;
}
#about-section6 .button-style button:first-child {
  background-color: #2255A4;
}
#about-section6 .button-style svg {
  margin-bottom: 3px;
}
#about-section6 .button-style button:last-child {
  color: #2255A4 !important;
}
</style>
