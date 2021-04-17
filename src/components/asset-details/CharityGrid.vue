<template>
<section v-if="content" :class="'theme-' + content.uid" class="container-fluid p-5 hundred-vh">
  <b-container>
    <b-row>
      <b-col cols="12" class="text-left">
        <p class="spaced-name">Charities</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols-md="4" cols-sm="4" cols-xs="6" v-for="(charity, index) in content" :key="index">
        <img class="charity-image" :src="charity.data.image.url"/>
        <p>{{charity.data.description[0].text}}</p>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CharityGrid',
  components: {
  },
  data: function () {
    return {
    }
  },
  methods: {
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITIES]
      return content
    }
  }
}
</script>

<style scoped>
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff;
}
.spaced-name {
  position: relative;
  left: -170px;
  top: -80px;
  text-align: right;
  font-family: 'Bungee Hairline';
  font-size: 6rem;
  font-weight: normal;
  letter-spacing: 10px;
  color: #000000;
  opacity: 1;
  text-transform: uppercase;
}
.charity-image {
  max-width: 333px; height: 333px;
  border: 1pt solid #000;
}
</style>
