<template>
  <b-row class="center">
    <b-col cols="4" class="p-0 m-0" v-for="(result, index) in resultSet" :key="index">
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
    this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then(() => {
      // this.results = this.resultSet(searchResults)
      // this.setupGrid(padder)
      this.loaded = true
    })
  },
  methods: {
    numbEntries: function () {
      return this.results.length
    },
    resultSetOld (searchResults) {
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
    }
  },
  computed: {
    resultSet () {
      const padder = {
        image: this.padderSrc,
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
      const results = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      const paddedResults = []
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      paddedResults.push(padder)
      if (results) {
        results.sort((g1, g2) => g1.contractAsset.nftIndex - g2.contractAsset.nftIndex)
        if (results.length >= 4) paddedResults[0] = this.results.find((o) => o.artist === 'Chemical X') || results[3]
        if (results.length >= 2) paddedResults[2] = this.results.find((o) => o.artist === 'Orbital') || results[1]
        if (results.length >= 1) paddedResults[8] = this.results.find((o) => o.artist === 'Dave Stewart') || results[0]
        if (results.length >= 3) paddedResults[6] = this.results.find((o) => o.artist === 'Fatboy Slim') || results[2]
        if (results.length >= 5) paddedResults[4] = this.results.find((o) => o.artist === 'Cara Delevingne') || results[4]
      }
      return paddedResults
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
