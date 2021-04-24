<template>
<b-container v-if="loaded">
  <b-row class="center">
    <b-col cols="4" class="p-0 m-0" v-for="(result, index) in paddedResults" :key="index">
      <result-item v-on="$listeners" :result="result" :dims="dims100" :outerOptions="outerOptions"/>
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
  props: ['resultSet', 'outsiderCols', 'outerOptions'],
  data () {
    return {
      loaded: false,
      paddedResults: [],
      dims100: { width: '100%', height: '100%' }
    }
  },
  mounted () {
    this.paddedResults = this.resultSet
    const numbs = this.resultSet.length
    for (let i = numbs; i < 10; i++) {
      if (this.paddedResults.length < 9) {
        this.paddedResults.push(this.resultSet[i - numbs])
      }
    }
    this.loaded = true
  },
  methods: {
    numbEntries: function () {
      return this.resultSet.length
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.center {
  margin: auto;
  width: 70%;
  border: 0px solid green;
  padding: 10px;
}
@media only screen and (max-width: 900px) {
  .center {
    width: 85%;
  }
}
</style>
