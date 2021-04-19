<template>
<div v-if="content">
  <section1 id="section1"></section1>
  <section2 id="section2"></section2>
  <section3 id="section3"></section3>
</div>
</template>

<script>
import Section1 from '@/components/about/Section1'
import Section2 from '@/components/about/Section2'
import Section3 from '@/components/about/Section3'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'About',
  components: {
    Section1,
    Section2,
    Section3
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
      const height = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_ABOUT]
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
