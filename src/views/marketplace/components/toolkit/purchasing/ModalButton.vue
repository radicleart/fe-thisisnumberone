<template>
  <b-button-group class="text-white" id="parent-group" v-if="loaded">
    <b-button @click="$emit('clickButton')" class="btn-square" :class="colorHover">
      <span class="d-flex justify-content-center" v-if="icon">
        <b-icon :class="(textWarning) ? 'text-warning' : ''" style="width: 30px; height: 30px;" :icon="icon"/>
      </span>
      <span class="d-flex justify-content-center" v-else>
        <img :class="(textWarning) ? 'text-warning' : ''" style="width: 30px; height: 30px;" :src="svgImage"/>
      </span>
    </b-button>
    <b-button @click="$emit('clickButton')" class="btn-rectangle" :class="bigButtonTheme">
      <span v-if="route"><b-link :to="route">{{label1}}</b-link></span>
      <span v-else>{{label1}}</span>
    </b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'ModalButton',
  components: {
  },
  props: ['theme', 'usePixelBg', 'label1', 'icon', 'route', 'svgImage', 'textWarning', 'colorOnHover'],
  data () {
    return {
      loaded: false,
      b1: null,
      bigButtonTheme: null,
      colorHover: null
    }
  },
  mounted () {
    this.bigButtonTheme = 'btn-dark'
    this.colorHover = 'hover-white'
    if (this.theme) {
      this.bigButtonTheme = 'btn-' + this.theme
    }
    if (this.colorOnHover) {
      this.colorHover = 'hover-' + this.colorOnHover
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
  white-space: nowrap;
}
.btn-group > .btn:hover {
  background: transparent;
  color: #000;
}
.btn-square {
  width: 61px;
  height: 61px;
  font-size: 2rem;
  border: 1pt solid #ccc !important;
}
.btn-rectangle {
  font-size: 1.5rem;
  min-width: 170px;
  text-transform: uppercase;
  color: #000;
}
</style>
