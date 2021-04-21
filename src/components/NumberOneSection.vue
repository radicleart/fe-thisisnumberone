<template>
<div id="number-one-container" class="">
  <div class="row w-100">
    <div class="col-6 d-flex flex-column justify-content-center align-items-center">
      <!-- @mouseover="artist = 1" -->
       <result-grid class="container text-center" :key="componentKey" :resultSet="resultSet"/>
    </div>
    <div class="col-6">
      <div class="d-flex flex-column justify-content-center align-items-center h-100">
        <transition name="fade" mode="out-in">
          <div v-if="artist === 0" key="default" class="preview-section--default"><img :src="logo" alt="logo"></div>
          <div v-else-if="artist === 1" @mouseleave="artist = 0" key="1" class="preview-section--active">
            <img :src="logo" alt="logo">
            <h1>Fatboy Slim</h1>
            <h2>So Why Try Harder</h2>
            <a href="#">Find Out More</a>
          </div>
          <div v-else-if="artist === 2" @mouseleave="artist = 0" key="2" class="preview-section--active">
            <img :src="logo" alt="logo">
            <h1>Slim</h1>
            <h2>So Why Try Harder</h2>
            <a href="#">Find Out More</a>
          </div>
          <div v-else-if="artist === 3" @mouseleave="artist = 0" key="3" class="preview-section--active">
            <img :src="logo" alt="logo">
            <h1>Fatboy</h1>
            <h2>So Why Try Harder</h2>
            <a href="#">Find Out More</a>
          </div>
          <div v-else-if="artist === 4" @mouseleave="artist = 0" key="4" class="preview-section--active">
            <img :src="logo" alt="logo">
            <h1>FS</h1>
            <h2>So Why Try Harder</h2>
            <a href="#">Find Out More</a>
          </div>
        </transition>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/marketplace/ResultGrid'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'NumberOneSection',
  components: {
    ResultGrid
  },
  data () {
    return {
      logo: require('@/assets/img/logo-rainbow.svg'),
      artist: 0,
      componentKey: 1
    }
  },
  mounted () {
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((results) => {
        this.results = results
      })
    }
  },
  computed: {
    getPixelBackground () {
      return this.$store.getters[APP_CONSTANTS.KEY_PIXEL_BACKGROUND]
    },
    resultSet () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
      return resultSet
    },
    resultSetFromIndex () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      return resultSet
    }
  }
}
</script>

<style>
#number-one-container {
  height: 100%;
  width: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#number-one-container .artist-image img {
  width: 258px;
  height: 258px;
}

#number-one-container .preview-section--default {
  width: 427px;
  height: 427px;
  border: 1px solid #707070;
  display: flex;
  justify-content: center;
  align-items: center;
}
#number-one-container .preview-section--active {
  width: 427px;
  height: 427px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: #333333;
}
#number-one-container .preview-section--active img {
  width: 115px;
  height: 72px;
  align-self: flex-end;
  margin-bottom: auto;
}
#number-one-container .preview-section--active h1, #number-one-container .preview-section--active h2 {
  width: 100%;
  padding-left: 45px;
  transition: all 0.3s ease-in;
}
#number-one-container .preview-section--active a {
  width: 100%;
  padding-left: 45px;
  padding-bottom: 30px;
  color: #ffffff;
  transition: all 0.3s ease-in;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease-in;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
