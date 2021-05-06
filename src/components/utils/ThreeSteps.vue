<template>
<b-row>
  <b-col cols="12" class="text-right">
    <div class="text-small mb-5"><span :class="(step === 1) ? 'text-warning' : 'text-dark'">1</span><span class="mx-3 line-separator">------------</span><span :class="(step === 2) ? 'text-warning' : 'text-dark'">2</span><span class="mx-3 line-separator">------------</span><span :class="(step === 3) ? 'text-warning' : 'text-dark'">3</span></div>
  </b-col>
</b-row>
</template>

<script>

export default {
  name: 'ThreeSteps',
  components: {
  },
  props: ['step'],
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
.line-separator {
  font-weight: 200;
  display: inline;
}
.active {
  width: 30px;
  height: 30px;
  padding: 5px;
  border: 0pt solid #000;
}
</style>
