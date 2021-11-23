<template>
  <div>
    <div class="mb-4" :key="componentKey">
      <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
      <div id="my-table" class="row" v-if="resultSet && resultSet.length > 0">
        <div class="text-white col-lg-4 col-md-4 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
          <MySingleItem v-if="!skipme(asset)" :loopRun="loopRun" :parent="'list-view'" :asset="asset"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MySingleItem from './MySingleItem'
import Pagination from './common/Pagination'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_CONTRACT_NAME_V2 = process.env.VUE_APP_STACKS_CONTRACT_NAME_V2

export default {
  name: 'PageableItems',
  components: {
    MySingleItem,
    Pagination
  },
  props: ['loopRun', 'defQuery'],
  data () {
    return {
      resultSet: [],
      pageSize: 50,
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0
    }
  },
  mounted () {
    this.collection = this.$route.params.collection
    const $self = this
    let resizeTimer
    if (this.loopRun) this.numberOfItems = this.loopRun.tokenCount
    this.fetchPage(0, false, this.defQuery)
    this.loading = false

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.componentKey += 1
      }, 400)
    })
    window.onscroll = () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
      }
    }
  },
  methods: {
    skipme (asset) {
      if (this.loopRun && this.isTheV2Contract()) {
        if (this.loopRun.currentRunKey === 'my_first_word') {
          return asset.contractAsset.nftIndex > 4
        } else if (this.loopRun.currentRunKey === 'number_one') {
          return asset.name.toLowerCase().indexOf('hash') === -1
        } else if (this.loopRun.currentRunKey === 'no_1_smiley') {
          return asset.name.toLowerCase().indexOf('smiley') === -1
        }
      }
      return false
    },
    gotoPage (page) {
      this.page = page - 1
      this.fetchPage(page - 1, false, this.defQuery)
    },
    isTheV2Contract () {
      return this.loopRun && this.loopRun.contractId.indexOf(STX_CONTRACT_NAME_V2) > -1
    },
    fetchPage (page, reset, query) {
      let queryStr = '?'
      if (this.loopRun && this.loopRun.currentRunKey === 'my_first_word') {
        queryStr += 'sortDir=sortUp&'
      } else {
        queryStr += 'sortDir=' + query.sortDir + '&'
      }
      if (query.query) queryStr += 'query=' + query.query + '&'
      if (query.edition) queryStr += 'edition=' + query.edition + '&'
      if (query.onSale) queryStr += 'onSale=true&'
      if (query.editions) queryStr += 'editions=true&'
      if (query.sortField) queryStr += 'sortField=' + query.sortField + '&'
      const data = {
        runKey: (this.loopRun) ? this.loopRun.currentRunKey : null,
        query: queryStr,
        page: page,
        pageSize: this.pageSize
      }
      this.resultSet = []
      if (query.allCollections !== 'all') {
        data.contractId = (this.loopRun) ? this.loopRun.contractId : STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME
        if (this.isTheV2Contract()) {
          data.contractId = null
          this.fetchV2Page(data, reset)
        } else {
          // after V2 we added the runKey/makerurl to the metaDataUrl to filter tokens more easily.
          this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndRunKey', data).then((result) => {
            this.resultSet = result.gaiaAssets
            this.tokenCount = result.tokenCount
            this.numberOfItems = result.tokenCount
            this.$emit('tokenCount', { numbTokens: result.tokenCount })
            if (reset) this.componentKey++
            this.loading = false
          })
        }
      } else {
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByFilters', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = result.tokenCount
          this.numberOfItems = result.tokenCount
          this.$emit('tokenCount', { numbTokens: result.tokenCount })
          if (reset) this.componentKey++
          this.loading = false
        })
      }
    },
    fetchV2Page (data, reset) {
      if (!this.loopRun.currentRunKey) return
      this.resultSet = []
      data.contractId = this.loopRun.contractId
      if (this.loopRun.currentRunKey === process.env.VUE_APP_DEFAULT_LOOP_RUN) {
        data.pageSize = 5
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractId', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = 5
          this.numberOfItems = this.tokenCount
          this.$emit('tokenCount', { numbTokens: data.pageSize })
          if (reset) this.componentKey++
          this.loading = false
        })
      } else if (this.loopRun.currentRunKey.indexOf('genesis') > -1) {
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractId', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = result.tokenCount
          this.numberOfItems = result.tokenCount
          this.$emit('tokenCount', { numbTokens: 'Up to ' + result.tokenCount })
          if (reset) this.componentKey++
          this.loading = false
        })
      } else {
        data.runKey = this.loopRun.currentRunKey
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndName', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = result.tokenCount
          this.numberOfItems = result.tokenCount
          this.$emit('tokenCount', { numbTokens: 'Up to ' + result.tokenCount })
          if (reset) this.componentKey++
          this.loading = false
        })
      }
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style>
.myItemsIntroText {font-weight: 200; font-size: 1.1rem; color: #fff;}
</style>
