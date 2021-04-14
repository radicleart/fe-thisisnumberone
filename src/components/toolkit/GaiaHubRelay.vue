<template>
<div  class="mt-3">
  <div class="">
    <div class="row mb-4">
      <div class="col-12"><a href="#" @click.prevent="indexRootFile()" target="_blank">Index this root file</a></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'GaiaHubRelay',
  components: {
  },
  props: ['assetHash'],
  data: function () {
    return {
      result: false
    }
  },
  methods: {
    indexRootFile: function () {
      return this.$store.dispatch('myItemStore/indexRootFile').then((result) => {
        this.result = result
      }).catch((err) => {
        this.result = err
      })
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
