<template>
  <b-row class="center">
    <b-col cols="4" class="p-0 m-0" v-for="(result, index) in paddedResults" :key="index">
      <result-item v-on="$listeners" :result="result" :dims="dims100" :outerOptions="outerOptions"/>
    </b-col>
  </b-row>
</template>

<script>
import ResultItem from './ResultItem'

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['resultSet', 'outerOptions'],
  data () {
    return {
      loaded: false,
      padderSrc: 'https://images.prismic.io/dbid/d030a2d9-66eb-4d09-b0a6-52bfa581faa6_Cover_Placeholder_400.jpg?auto=compress,format',
      padderVid: 'https://res.cloudinary.com/mijo-enterprises/video/upload/v1617695880/numberone/placeholders/Comp_2.mp4',
      paddedResults: [],
      dims100: { width: '100%', height: '100%' }
    }
  },
  mounted () {
    const padder = {
      imageUrl: this.padderSrc,
      nftMedia: {
        coverImage: {
          fileUrl: this.padderSrc,
          type: 'image'
        }
      }
    }
    if (this.resultSet.length > 4) {
      this.setupGrid(padder)
    } else {
      if (this.resultSet.length === 5) {
        this.resultSet.splice(1, 0, padder)
        this.resultSet.splice(3, 0, padder)
        this.resultSet.splice(5, 0, padder)
        this.resultSet.splice(7, 0, padder)
      }
      this.paddedResults = this.resultSet
      const numbs = this.resultSet.length
      for (let i = numbs; i < 10; i++) {
        if (this.paddedResults.length < 9) {
          this.paddedResults.push(this.resultSet[i - numbs])
        }
      }
    }
    this.loaded = true
  },
  methods: {
    numbEntries: function () {
      return this.resultSet.length
    },
    setupGrid: function (padder) {
      const dave = this.resultSet.find((o) => o.artist === 'Dave Stewart') || this.resultSet[0]
      const orbital = this.resultSet.find((o) => o.artist === 'Orbital') || this.resultSet[1]
      const fatboy = this.resultSet.find((o) => o.artist === 'Fatboy Slim') || this.resultSet[2]
      const marc = this.resultSet.find((o) => o.artist === 'Chemical X') || this.resultSet[3]
      const cara = this.resultSet.find((o) => o.artist === 'Cara Delevingne') || this.resultSet[4]
      this.paddedResults.push(marc)
      this.paddedResults.push(padder)
      this.paddedResults.push(orbital)
      this.paddedResults.push(padder)
      this.paddedResults.push(cara)
      this.paddedResults.push(padder)
      this.paddedResults.push(fatboy)
      this.paddedResults.push(padder)
      this.paddedResults.push(dave)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
