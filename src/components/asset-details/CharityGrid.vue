<template>
<section v-if="content" :class="'theme-' + content.uid" class="container-fluid p-5" style="min-height: 50vh;">
  <!-- <div class="spaced-name spaced-name--charity-grid">Charities</div> -->
  <b-container fluid class="center-section">
    <b-row align-h="center">
      <b-col lg="2" sm="6" md="4" v-for="(charity, index) in content" :key="index">
        <div class="">
          <div class="">
            <img style="width: 100%;" class="charity-image" :src="charity.data.image.url"/>
          </div>
        </div>
        <p class="title-text">{{charity.data.description[0].text}}</p>
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
/* General style */
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff;
}
.title-text {
  font-weight: normal;
  font-size: 1.6rem;
}
.spaced-name--charity-grid {
  margin: -3.5rem 0 8rem -4rem;
  text-align: left;
  font-size: 15rem;
  color: #888888;
}
p {
  display: inline-block;
  max-width: 333px;
  width: 100%;
  margin: 20px 0 40px;
  font-size: 25px;
  color: #000;
}

/* Images style */
.image-background {
  background: #000;
  display: table;
  width: 100%;
  height: 100%;
  position: relative;
  max-height: 333px;
  max-width: 333px;
}

.image-container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
}

img {
  display: block;
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  border: 1pt solid #000;
}

/* Spaced name responsive design */
@media only screen and (max-width: 1023px) {
  .spaced-name--charity-grid {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 787px) {
  .spaced-name--charity-grid {
    font-size: 8rem;
  }
}
@media only screen and (max-width: 600px) {
  .spaced-name--charity-grid {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 475px) {
  .spaced-name--charity-grid {
    font-size: 5rem;
    margin: -3rem 0 8rem -3rem;
  }
}
@media only screen and (max-width: 350px) {
  .spaced-name--charity-grid {
    font-size: 4rem;
  }
}
</style>
