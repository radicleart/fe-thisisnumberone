<template>
  <div v-if="stxAddress">
    <div class="mb-4" :key="componentKey">
      <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
      <div id="my-table" class="row" v-if="resultSet && resultSet.length > 0">
        <div class="text-white col-lg-4 col-md-4 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
          <MySingleItem :loopRun="loopRun" :asset="asset"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Nothing found at address</div>
</template>

<script>
import MySingleItem from '@/views/marketplace/components/gallery/MySingleItem'
import Pagination from '@/views/marketplace/components/gallery/common/Pagination'

export default {
  name: 'NftsAtAddress',
  components: {
    MySingleItem,
    Pagination
  },
  data () {
    return {
      stxAddress: null,
      loopRun: null,
      resultSet: [],
      edition: null,
      trait: '',
      pageSize: 50,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0
    }
  },
  mounted () {
    this.stxAddress = this.$route.params.stxAddress
    const $self = this
    let resizeTimer
    this.fetchPage(0, false, {})
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.componentKey += 1
      }, 400)
    })
  },
  methods: {
    gotoPage (page) {
      this.page = page - 1
      this.fetchPage(page - 1, false, this.defQuery)
    },
    fetchPage (page, reset, query) {
      let queryStr = '?sortDir=' + query.sortDir + '&'
      if (query.query) queryStr += 'query=' + query.query + '&'
      if (query.edition) queryStr += 'edition=' + query.edition + '&'
      if (query.onSale) queryStr += 'onSale=true&'
      if (query.editions) queryStr += 'editions=true&'
      if (query.sortField) queryStr += 'sortField=' + query.sortField + '&'
      const data = {
        stxAddress: this.stxAddress,
        query: queryStr,
        page: page,
        pageSize: this.pageSize
      }
      this.resultSet = []
      this.$store.dispatch('rpayStacksContractStore/fetchMyTokens', data).then((result) => {
        this.resultSet = result.gaiaAssets
        this.tokenCount = result.tokenCount
        this.numberOfItems = result.tokenCount
        this.$emit('tokenCount', { numbTokens: result.tokenCount })
        if (reset) this.componentKey++
        this.loading = false
      })
    }
  },
  computed: {
  }
}
</script>
<style>
.myItemsIntroText {font-weight: 200; font-size: 1.1rem; color: #fff;}
</style>
