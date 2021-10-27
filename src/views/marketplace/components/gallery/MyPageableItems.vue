<template>
  <div v-if="!loading">
    <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
    <div id="my-table" class="row" v-if="resultSet && resultSet.length > 0">
      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12" v-for="(asset, index) of resultSet" :key="index">
        <MySingleItem :parent="'list-view'" :loopRun="loopRun" :asset="asset" :key="componentKey"/>
      </div>
    </div>
    <div class="d-flex justify-content-start my-3 mx-4" v-else>
      <div class="mt-5">
        <p>No NFTs found for this collection...</p>
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

export default {
  name: 'MyPageableItems',
  components: {
    MySingleItem, Pagination
  },
  props: ['loopRun'],
  data () {
    return {
      resultSet: [],
      pageSize: 500,
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0,
      currentRunKey: null
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.collection
    const $self = this
    let resizeTimer
    // this.numberOfItems = 500 // this.loopRun.tokenCount
    this.fetchPage(0)
    this.loading = false

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.$store.commit('loopStore/setWinDims')
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
    gotoPage (page) {
      // this.page = page - 1
      this.fetchPage(page - 1)
    },
    fetchPage (page) {
      const data = {
        contractId: (this.loopRun) ? this.loopRun.contractId : STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
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
      this.$store.dispatch('rpayStacksContractStore/fetchMyTokens', data).then((results) => {
        this.resultSet = results // this.resultSet.concat(results)
        this.numberOfItems = results.length
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
