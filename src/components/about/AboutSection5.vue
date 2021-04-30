<template>
<div id="environment">
<section v-if="content" id="about-section5" :style="'background-size: cover; background-image: url(' + content.section5rtf1[0].url + ')'">
  <div class="spaced-name spaced-name--section5">Environment</div>
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
.spaced-name--section5 {
  margin: 0 0 6rem auto;
  max-width: 1050px;
  text-align: right;
  font-size: 13.5rem;
  color: #FFFFFF;
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
  color: #129A9A;
}

/* Spaced name responsive design */
@media only screen and (max-width: 1100px) {
  .spaced-name--section5 {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 900px) {
  .spaced-name--section5 {
    font-size: 7rem;
  }
}
@media only screen and (max-width: 650px) {
  .spaced-name--section5 {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 530px) {
  .spaced-name--section5 {
    font-size: 4.5rem;
  }
}
@media only screen and (max-width: 376px) {
  .spaced-name--section5 {
    font-size: 4rem;
  }
}
@media only screen and (max-width: 350px) {
  .spaced-name--section5 {
    font-size: 3.5rem;
  }
}
</style>
