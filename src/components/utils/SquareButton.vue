<template>
  <b-button-group class="text-white">
    <b-button class="btn-square"><b-icon :icon="icon"/></b-button>
    <b-button class="text-white btn-rectangle"><b-link router-tag="span" :to="route">{{label1}}</b-link></b-button>
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
}
.btn-group > .btn:hover {
  background: transparent;
}
.btn-square {
  width: 61px;
  height: 61px;
  font-size: 2rem;
}
.btn-rectangle {
  width: 170px;
  height: 61px;
  font-size: 1.5rem;
  text-transform: uppercase;
}
</style>
