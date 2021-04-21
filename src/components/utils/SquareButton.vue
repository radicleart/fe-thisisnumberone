<template>
  <b-button-group class="text-white" v-if="loaded">
    <b-button class="btn-square" :class="b1">
      <span class="" v-if="icon">
        <b-icon class="text-warning" style="width: 30px; height: 30px;" :icon="icon"/>
      </span>
      <span class="" v-else>
        <img class="text-warning" style="width: 30px; height: 30px;" :src="svgImage"/>
      </span>
    </b-button>
    <b-button class="btn-rectangle" :class="b2"><b-link router-tag="span" :class="(theme) ? + theme : 'text-white'" :to="route">{{label1}}</b-link></b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'SquareButton',
  components: {
  },
  props: ['theme', 'label1', 'icon', 'route', 'svgImage'],
  data () {
    return {
      loaded: false,
      b1: null,
      b2: null
    }
  },
  mounted () {
    this.buttonTheme = 'text-white'
    if (this.theme) {
      this.b1 = this.theme.b1
      this.b2 = this.theme.b2
    }
    this.loaded = true
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
  white-space: nowrap;
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
  font-size: 1.5rem;
  text-transform: uppercase;
}
</style>
