<template>
<div v-if="content">
  <about-section1 :content="content"></about-section1>
  <about-section2 :content="content"></about-section2>
  <about-section3 :content="content"></about-section3>
  <about-section4 :content="content"></about-section4>
  <about-section5 :content="content"></about-section5>
  <about-section6 :content="content"></about-section6>
</div>
</template>

<script>
import AboutSection1 from '@/components/about/AboutSection1'
import AboutSection2 from '@/components/about/AboutSection2'
import AboutSection3 from '@/components/about/AboutSection3'
import AboutSection4 from '@/components/about/AboutSection4'
import AboutSection5 from '@/components/about/AboutSection5'
import AboutSection6 from '@/components/about/AboutSection6'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Gallery',
  components: {
    AboutSection1,
    AboutSection2,
    AboutSection3,
    AboutSection4,
    AboutSection5,
    AboutSection6
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
</style>
