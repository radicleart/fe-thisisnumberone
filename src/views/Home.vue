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
    resultSet () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
      return resultSet
    },
    resultSetFromIndex () {
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS]
      return resultSet
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    },
    buttonLabel () {
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) return null
      return content.credits[0].text
    }
  }
}
</script>

<style>

.bottom-logo-container {
  text-align: right;
  margin-top: auto;
  margin-bottom: 24px;
}

/*
.market-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 200px;
  background-color: rgb(2, 0, 0) !important;
  text-align: center;
}

.home-content {
  position: relative;
  top: 140px;
}
#homeSection h2 {
  margin-bottom: 10px;
  font-size: 3.4rem;
}
#homeSection h3 {
  margin-bottom: 50px;
}
#homeSection p {
  margin-bottom: 20px;
}
*/
</style>
