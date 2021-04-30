<template>
<div id="environment">
<section v-if="content" id="about-section5" :style="'background-size: cover; background-image: url(' + content.section5rtf1[0].url + ')'">
  <div class="spaced-name">Environment</div>
  <b-container class="">
    <b-row style="margin-bottom: 100px" class="text-left">
      <b-col cols="12" align-self="end">
        <h1 class="mb-4 text-white">{{content.section5rtf1[1].text}}</h1>
        <div class="text-white mb-5 about-section5--text">{{content.section5rtf1[2].text}}</div>
        <!-- <div>
          <square-button @clickButton="$router.push('/home')" class="button-style" :label1="'Find out more'" :icon="'plus-square'" :theme="'light'"/>
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
  name: 'AboutSection5',
  props: ['content'],
  components: {
    // SquareButton
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
#about-section5 {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 80vh;
}
#about-section5 .spaced-name {
  margin: 0 0 6rem auto;
  line-height: 0.6;
  max-width: 1050px;
  white-space: nowrap;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 13.5rem;
  color: #FFFFFF;
  text-transform: uppercase;
}
#about-section5 h1 {
  font-size: 3rem;
}
#about-section5 .about-section5--text {
  font-size: 1.4rem;
  text-shadow: 0px 3px 6px #00000029;
  max-width: 500px;
}

/* Button style */
#about-section5 .button-style button, .button-style button:hover {
  border-color: #FFFFFF;
}
#about-section5 .button-style svg {
  margin-bottom: 6px;
  color: #129A9A;
}

/* Spaced name responsive design */
@media only screen and (max-width: 1100px) {
  #about-section5 .spaced-name {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 900px) {
  #about-section5 .spaced-name {
    font-size: 7rem;
  }
}
@media only screen and (max-width: 650px) {
  #about-section5 .spaced-name {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 530px) {
  #about-section5 .spaced-name {
    font-size: 4.5rem;
  }
}
@media only screen and (max-width: 376px) {
  #about-section5 .spaced-name {
    font-size: 4rem;
  }
}
@media only screen and (max-width: 350px) {
  #about-section5 .spaced-name {
    font-size: 3.5rem;
  }
}
</style>
