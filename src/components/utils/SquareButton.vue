<template>
  <b-button-group class="text-white">
    <b-button class="btn-square">
      <span class="" v-if="icon">
        <b-icon class="text-warning" style="width: 40px; height: 40px;" :icon="icon"/>
      </span>
      <span class="" v-else>
        <img class="text-warning" style="width: 40px; height: 40px;" :src="svgImage"/>
      </span>
    </b-button>
    <b-button class="btn-rectangle"><b-link class="text-white" router-tag="span" :to="route">{{label1}}</b-link></b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'SquareButton',
  components: {
  },
  props: ['label1', 'icon', 'route', 'svgImage'],
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
  white-space: nowrap;
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
