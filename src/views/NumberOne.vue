<template>
<section id="number-one-section" class="">
  <NumberOneSection></NumberOneSection>
</section>
</template>

<script>
import NumberOneSection from '@/components/NumberOneSection'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: '#1',
  components: {
    NumberOneSection
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
#number-one-section {
  height: 100vh;
  width: 100%;
  margin-top: -71px;
}
</style>
