<template>
<div class="vld-parent mt-5 d-flex flex-column align-items-center">
  <div class="mt-4 d-flex flex-column align-items-center">
    {{waitingMessage}}
  </div>
</div>
</template>

<script>

export default {
  name: 'WaitingView',
  components: {
  },
  props: {
    waitingMessage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: true
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
