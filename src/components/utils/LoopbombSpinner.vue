<template>
<div class="text-center">
  <svg :viewBox="viewBox">
    <path id="inf" :d="path"></path>
    <use xlink:href="#inf" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"></use>
  </svg>
</div>
</template>

<script>
/**
<svg data-v-031516c0="" viewBox="-2000 -1000 4000 2000">
<path data-v-031516c0="" id="inf" d="M354-354A500 500 0 1 1 354 354L-354-354A500 500 0 1 0-354 354z"></path>
<use data-v-031516c0="" xlink:href="#inf" stroke-dasharray="NaN" stroke-dashoffset="6713px"></use>
</svg>
**/

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LoopbombSpinner',
  components: {
  },
  data () {
    return {
      r: 500
    }
  },
  computed: {
    viewBox () {
      const w = 8 * this.r
      const h = 0.5 * w
      const x = -0.5 * w
      const y = -0.5 * h
      return x + ' ' + y + ' ' + w + ' ' + h
    },
    path () {
      const c = Math.round(this.r / Math.SQRT2)
      const r = this.r
      return 'M' + c + -c + 'A' + r + ' ' + r + ' 0 1 1 ' + c + ' ' + c + 'L' + -c + -c + 'A' + r + ' ' + r + ' 0 1 0' + -c + ' ' + c + 'z'
    },
    dasharray () {
      const d = ~~(Math.PI * this.r)
      const l = Math.ceil((3 * Math.PI + 4) * this.r)
      return d + ' ' + (l - d)
    },
    dashoffset () {
      const l = Math.ceil((3 * Math.PI + 4) * this.r)
      return l + 'px'
    }
  },
  methods: {
  }
}
</script>
<style scoped>
html { background: #333 }
body { text-align: center }

svg {
  max-width: 15em;
  min-width: 10em;
  border-radius: 3px;
  /* box-shadow: 2px 2px 5px #111; */
  background: #fff;
  fill: none;
  stroke: #2255A4;
  stroke-linecap: round;
  stroke-width: 8%
}

use {
  stroke: #FF9900;
  animation: a 2s linear infinite
}

@keyframes a { to { stroke-dashoffset: 0px } }</style>
