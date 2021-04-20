<template>
<div>
  <b-row>
    <b-col :cols="getOuterCols()" col-xs-6 :offset-md="getOuterOffset()" class="text-right p-0">
      <b-row>
        <b-col :cols="getCols()" col-xs-6 :offset-md="getOffset(index)" class="text-right p-0" v-for="(index) in numbEntries()" :key="index">
          <result-item :dims="dims()" :result="getResult(index)" />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
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
    getOuterCols: function () {
      const numbs = this.resultSet.length
      return (numbs > 4) ? 6 : 12
    },
    getOuterOffset: function () {
      const numbs = this.resultSet.length
      return (numbs > 4) ? 3 : 0
    },
    dims: function () {
      const numbs = this.resultSet.length
      const dims100 = { width: '100%', height: '100%' }
      const dims50 = { width: '100%', height: '100%' }
      return (numbs > 4) ? dims50 : dims100
    },
    getCols: function () {
      const numbs = this.resultSet.length
      const breaking = this.getWidth()
      if (breaking === 'xs') {
        return (numbs > 4) ? 6 : 6
      } else if (breaking === 'sm') {
        return (numbs > 4) ? 4 : 3
      }
      return (numbs > 4) ? 4 : 3
    },
    numbEntries: function () {
      return this.resultSet.length
    },
    getResult: function (index) {
      return this.resultSet[index - 1]
    },
    getOffset: function (index) {
      const breaking = this.getWidth()
      if (breaking === 'xs') {
        return 0
      }
      if (this.resultSet.length > 4) {
        return ((index) % 3 === 0) ? 0 : 0
      }
      return ((index - 1) % 2 === 0) ? 3 : 0
    },
    getWidth () {
      if (window.innerWidth < 800) {
        return 'xs'
      } else if (window.innerWidth < 1100) {
        return 'sm'
      }
      return 'md'
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
