<template>
<div>
  <div class="d-flex justify-content-between">
    <div>
      <a class="text-danger" v-if="downable()" href="#" @click.prevent="$emit('upload-state', { change: 'down' })"><b-icon icon="arrow-left-circle"/></a>
    </div>
    <div>
      <a class="text-danger" v-if="upable()" href="#" @click.prevent="$emit('upload-state', { change: 'up' })"><b-icon icon="arrow-right-circle"/></a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ItemFormNav',
  props: ['uploadState'],
  data: function () {
    return {
    }
  },
  methods: {
    downable: function () {
      return this.uploadState > 2
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
