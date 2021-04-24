<template>
<b-card-text class="mx-4">
  <div class="row">
    <div class="col-4"><img style="border-radius: 18px;" width="100%" :src="item.imageUrl"/></div>
    <div class="col-8">
      <div class="text-bold">{{item.name}}</div>
    </div>
  </div>
</b-card-text>
</template>

<script>

export default {
  name: 'ItemDisplay',
  components: {
  },
  props: ['item'],
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
<style lang="scss" scoped>
</style>
