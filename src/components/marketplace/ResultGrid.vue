<template>
<div>
  <!--
  <div class="d-flex justify-content-center" v-for="(n, i) in gridSize" :key="i">
    <div v-for="(result, index) in results(i)" :key="index">
      <div class="100vh flex-column align-items-center d-flex justify-content-center">
        <result-item :result="result" />
      </div>
    </div>
  </div>
  -->
      <div class="row p-0 m-0">
        <div class="col-sm-6 col-xs-12 p-0 m-0" v-for="(result, index) in assets" :key="index">
          <result-item style="width: 100%; height: 100%;" :result="result" />
        </div>
      </div>
</div>
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
      gridSize: 2
    }
  },
  mounted () {
    const numbs = this.resultSet.length
    if (numbs <= 4) {
      this.gridSize = 2
    } else if (numbs <= 9) {
      this.gridSize = 3
    } else if (numbs <= 16) {
      this.gridSize = 4
    }
  },
  methods: {
    breakLine: function (index) {
      return (index % 2 === 1) ? '<br/>' : ''
    },
    cols: function () {
      if (this.resultSet.length < 4) return 12
      else if (this.resultSet.length < 9) return 6
      else return 4
    },
    results (i) {
      const results = this.resultSet
      try {
        const start = i * this.gridSize
        const end = this.gridSize * (i + 1)
        return results.slice(start, end)
      } catch (e) {
        return null
      }
    }
  },
  computed: {
    assets () {
      return this.resultSet
    },
    assets2 () {
      return this.resultSet.slice(2)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
