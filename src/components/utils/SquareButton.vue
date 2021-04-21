<template>
  <b-button-group class="text-white">
    <b-button class="btn-square"><span class=""><b-icon class="text-warning" :icon="icon"/></span></b-button>
    <b-button class="btn-rectangle"><b-link class="text-white" router-tag="span" :to="route">{{label1}}</b-link></b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'SquareButton',
  components: {
  },
  props: ['label1', 'icon', 'route'],
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
.btn-group > .btn {
  background: transparent;
  border: 1pt solid #ffffff !important;
  color: #ffffff !important;
}
.btn-group > .btn:hover {
  background: transparent;
}
.btn-square {
  width: 100px;
  height: 61px;
}
.btn-rectangle {
  width: 200px;
  height: 61px;
}
</style>
