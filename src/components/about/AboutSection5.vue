<template>
<div>
<div id="environment"></div>
<section v-if="content" id="about-section5">
  <!-- <div class="spaced-name spaced-name--section5">Environment</div> -->
  <b-container class="mt-5">
    <b-row>
      <b-col class="offset-md-2 col-md-8 mt-5">
        <h1 class="mb-4 text-black">{{content.section5rtf1[0].text}}</h1>
        <div class="text-black about-section5--text text-left">
          <div v-for="(item,index) in content.section5rtf1" :key="index">
            <p v-if="index > 0" v-html="item.text"></p>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</div>
</template>

<script>

export default {
  name: 'AboutSection5',
  props: ['content'],
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
#environment {
  height: 90px;
  background-color: #FF9900;
  z-index: 10;
}

#about-section5 {
  display: flex;
  flex-flow: column;
  width: 100%;
  justify-content: space-between;
  min-height: 65vh;
  background-color: white;
}
.spaced-name--section5 {
  margin: 0 0 auto auto;
  max-width: 1050px;
  text-align: right;
  font-size: 13.5rem;
  color: #FFFFFF;
}
#about-section5 h1 {
  font-size: 3rem;
}
#about-section5 .about-section5--text {
  text-shadow: 0px 3px 6px #00000029;
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
