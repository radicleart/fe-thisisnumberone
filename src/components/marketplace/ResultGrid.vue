<template>
  <b-row class="center" v-if="loaded">
    <b-col cols="4" class="p-0 m-0" v-for="(result, index) in paddedResults" :key="index">
      <result-item v-on="$listeners" :result="result" :dims="dims100" :outerOptions="outerOptions"/>
    </b-col>
  </b-row>
</template>

<script>
import ResultItem from './ResultItem'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['outerOptions'],
  data () {
    return {
      loaded: false,
      results: [],
      padderSrc: 'https://images.prismic.io/dbid/d030a2d9-66eb-4d09-b0a6-52bfa581faa6_Cover_Placeholder_400.jpg?auto=compress,format',
      padderVid: 'https://res.cloudinary.com/mijo-enterprises/video/upload/v1617695880/numberone/placeholders/Comp_2.mp4',
      paddedResults: [],
      dims100: { width: '100%', height: '100%' }
    }
  },
  mounted () {
    const padder = {
      imageUrl: this.padderSrc,
      attributes: {
        coverImage: {
          fileUrl: this.padderSrc,
          type: 'image'
        },
        artworkFile: {
          fileUrl: this.padderSrc,
          type: 'image'
        }
      }
    }
    this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((searchResults) => {
      this.results = this.resultSet(searchResults)
      this.setupGrid(padder)
      this.loaded = true
    })
  },
  methods: {
    numbEntries: function () {
      return this.results.length
    },
    resultSet (searchResults) {
      const newAssets = []
      if (searchResults.length > 0) {
        searchResults.forEach((ga) => {
          const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](ga.assetHash)
          if (contractAsset.nftIndex < 5) { // || o.artist === 'Chemical X'
            ga.contractAsset = contractAsset
            newAssets.push(ga)
          }
        })
      }
      return newAssets
    },
    setupGrid: function (padder) {
      const dave = this.results.find((o) => o.artist === 'Dave Stewart') || this.results[0]
      const orbital = this.results.find((o) => o.artist === 'Orbital') || this.results[1]
      const fatboy = this.results.find((o) => o.artist === 'Fatboy Slim') || this.results[2]
      const marc = this.results.find((o) => o.artist === 'Chemical X') || this.results[3]
      const cara = this.results.find((o) => o.artist === 'Cara Delevingne') || this.results[4]
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
