<template>
  <div>
    <div id="charity-grid" ></div>
    <div class="bg-warning" style="min-height: 40vh;">
      <charity-grid class="center-section pb-0"/>
    </div>
  </div>
</template>

<script>
import CharityGrid from '@/components/asset-details/CharityGrid'

export default {
  name: 'AboutSection4',
  components: {
    CharityGrid
  },
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<style scoped>
#charity-grid {
  height: 90px;
  background-color: transparent;
  z-index: 10;
}
</style>
