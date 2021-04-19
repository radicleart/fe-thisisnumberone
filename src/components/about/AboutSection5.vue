<template>
<section v-if="content" id="section1" :style="'min-height: 90vh; background-image: url(' + content.section5rtf1[0].url + ')'">
  <b-container class="">
    <b-row>
      <b-col cols="12" class="text-right">
        <p class="spaced-name">Environment</p>
      </b-col>
    </b-row>
    <b-row style="height: 52vh" class="text-left">
      <b-col cols="8" offset="1" cols-sm="6" align-self="end">
        <h1 class="mb-4 text-white">{{content.section5rtf1[1].text}}</h1>
        <div class="text-white">{{content.section5rtf1[2].text}}</div>
        <div class="mt-3">
          <b-button-group class="text-white">
            <b-button class="button-plus"><span class="text-info border" style="font-size: 1.2rem; color: #17a2b8; border: 1pt solid #17a2b8; padding: 6px">+</span></b-button>
            <b-button class="button-info">Find out more</b-button>
          </b-button-group>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
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

<style scoped>
.link-panel {
  background-color: #fff !important;
  border: 1pt solid #000;
}
.spaced-name {
  position: relative;
  right: -80px;
  top: -40px;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 6rem;
  font-weight: normal;
  letter-spacing: 10px;
  color: #fff;
  opacity: 1;
  text-transform: uppercase;
}
</style>
