<template>
  <div v-if="!loading">
    <h1 class="pointer mb-4 border-bottom" @click="showMinted = !showMinted"><b-icon font-scale="0.6" v-if="showMinted" icon="chevron-down"/><b-icon font-scale="0.6" v-else icon="chevron-right"/> {{tokenCount}} Minted NFTs</h1>
    <div class="mb-4" v-if="showMinted && loopRun">
      <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
      <div id="my-table" class="row" v-if="resultSet && resultSet.length > 0">
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
          <MySingleItem @updateImage="updateImage" :parent="'list-view'" :loopRun="loopRun" :asset="asset" :key="componentKey"/>
        </div>
      </div>
      <div class="d-flex justify-content-start my-3 mx-4" v-else>
        <div class="mt-5">
          <p>No NFTs found for this collection...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MySingleItem from './MySingleItem'
import Pagination from './common/Pagination'
import { APP_CONSTANTS } from '@/app-constants'

const LOOP_RUN_DEF = process.env.VUE_APP_DEFAULT_LOOP_RUN

export default {
  name: 'MyPageableItems',
  components: {
    MySingleItem, Pagination
  },
  props: ['loopRun'],
  data () {
    return {
      showMinted: true,
      resultSet: [],
      tokenCount: null,
      pageSize: 500,
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0,
      nowOnPage: 0,
      currentRunKey: null
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.collection
    // this.numberOfItems = 500 // this.loopRun.tokenCount
    this.fetchPage(0)
    this.loading = false

    const $self = this
    let resizeTimer
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.componentKey += 1
      }, 400)
    })
    window.onscroll = () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
        // $self.page++
        // $self.fetchPage()
      }
    }
  },
  methods: {
    updateImage () {
      // this.page = page - 1
      this.fetchPage(this.nowOnPage)
    },
    gotoPage (page) {
      this.nowOnPage = page - 1
      this.fetchPage(page - 1)
    },
    fetchPage (page) {
      const data = {
        // contractId: (this.loopRun) ? this.loopRun.contractId : STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
        runKey: (this.loopRun) ? this.loopRun.currentRunKey : LOOP_RUN_DEF,
        stxAddress: this.profile.stxAddress,
        asc: true,
        page: page,
        pageSize: this.pageSize
      }
      if (this.currentRunKey) data.runKey = this.currentRunKey
      if (process.env.VUE_APP_NETWORK === 'local') {
        data.stxAddress = 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      this.resultSet = null
      this.$store.dispatch('rpayStacksContractStore/fetchMyTokens', data).then((result) => {
        this.resultSet = result.gaiaAssets // this.resultSet.concat(results)
        this.tokenCount = result.tokenCount
        this.numberOfItems = result.gaiaAssets.length
        this.loading = false
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    mintCounter () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application.tokenContract.mintCounter
    }
  }
}
</script>
<style>
.myItemsIntroText {font-weight: 200; font-size: 1.1rem; color: #fff;}
</style>
