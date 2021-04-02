<template>
<b-container fluid>
  <b-row class="splash-screen hundred-vh text-center" align-v="center" align-h="center">
    <b-col cols="4">
      <div v-for="(result, index) in resultSet" :key="index">
        <result-item :result="result" />
      </div>
    </b-col>
  </b-row>
</b-container>

</template>

<script>
import ResultItem from './ResultItem'

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['resultSet'],
  data () {
    return {
    }
  },
  methods: {
    cols: function () {
      if (this.resultSet.length < 4) return 12
      else if (this.resultSet.length < 9) return 6
      else return 4
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
