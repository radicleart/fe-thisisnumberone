<template>
<b-row class="my-xs-4" style="min-height: 85vh">
  <b-col cols="12" class="text-center p-0 m-0" align-self="center" v-if="resultSet" >
    <result-grid class="container text-center" :key="componentKey" :resultSet="resultSet"/>
  </b-col>
</b-row>
</template>

<script>
import ResultGrid from '@/components/marketplace/ResultGrid'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'Home',
  components: {
    ResultGrid
  },
  data () {
    return {
      componentKey: 0,
      loading: true,
      useSearchIndex: false
    }
  },
  mounted () {
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((results) => {
        this.results = results
      })
    }
  },
  computed: {
    resultSetFromSearch () {
      const results = this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
      if (!results) return
      const resultSet = results.filter((o) => o.nftMedia.artworkFile.type.indexOf('video') > -1)
      return resultSet
    },
    resultSet () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      const newAssets = []
      if (resultSet && resultSet.length > 0) {
        resultSet.forEach((ga) => {
          const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](ga.assetHash)
          if (contractAsset.nftIndex < 5) { // || o.artist === 'Chemical X'
            ga.contractAsset = contractAsset
            newAssets.push(ga)
          }
        })
      }
      return newAssets
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    }
  }
}
</script>

<style>
</style>
