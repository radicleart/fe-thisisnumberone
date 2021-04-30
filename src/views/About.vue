<template>
<div v-if="content">
  <about-section1 :content="content"></about-section1>
  <div class="link-panel bg-white d-flex justify-content-center">
    <div class="d-flex justify-content-center text-black link-panel--container">
      <div class="d-flex justify-content-around link-panel--content">
        <a href="#thisisone">This is #1</a>
        <a href="#chemicalx">Chemical X</a>
        <a href="#charity">Charity</a>
        <a href="#environment">Environment</a>
        <!-- <a href="#collaborate">Collaborate</a> -->
      </div>
    </div>
  </div>
  <about-section2 :content="content"></about-section2>
  <about-section3 :content="content"></about-section3>
  <about-section4 :content="content"></about-section4>
  <about-section5 :content="content"></about-section5>
  <!-- <about-section6 :content="content"></about-section6> -->
</div>
</template>

<script>
import AboutSection1 from '@/components/about/AboutSection1'
import AboutSection2 from '@/components/about/AboutSection2'
import AboutSection3 from '@/components/about/AboutSection3'
import AboutSection4 from '@/components/about/AboutSection4'
import AboutSection5 from '@/components/about/AboutSection5'
// import AboutSection6 from '@/components/about/AboutSection6'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Gallery',
  components: {
    AboutSection1,
    AboutSection2,
    AboutSection3,
    AboutSection4,
    AboutSection5
    // AboutSection6
  },
  data () {
    return {
    }
  },
  methods: {
    changeModel (name) {
      this.currentModel = this.rootPath + name
    }
  },
  computed: {
    sectionDimensions () {
      const height = this.$store.getters[APP_CONSTANTS.KEY_SECTION_HEIGHT]
      return 'min-height: ' + height + 'px; width: auto;'
    },
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ABOUT]
      return content
    }
  }
}
</script>

<style>
#deep-logos li {
  cursor: pointer;
}

.link-panel {
  position: sticky;
  top: 0;
  z-index: 100;
}
.link-panel--container {
  width: 100%;
  padding: 30px 0;
  box-shadow: 0px 3px 6px #00000029;
}
.link-panel--content {
  width: 50%;
  color: #333333;
  font-size: 1.4rem;
}

/* Link panel responsive design */
@media only screen and (max-width: 768px) {
  .link-panel--content {
    width: 70%;
  }
}
@media only screen and (max-width: 600px) {
  .link-panel--content {
    width: 100%;
  }
}
@media only screen and (max-width: 376px) {
  .link-panel--content {
    font-size: 1.2rem;
  }
}
</style>
