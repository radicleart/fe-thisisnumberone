<template>
<div class="container">
  <div v-if="loading" class="d-flex justify-content-start my-3 mx-4">
    <div>
      <span class="myItemsIntroText">
      Hi-res images & secret fingerprints are secured here, assuring that only the loops minted through your library are true originals. Download, print, post > use: @loopb0mb #loopbomb - would love to see your captures!
      </span>
    </div>
  </div>
  <div v-else>
    <Pagination @changePage="gotoPage" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
    <div id="my-table" class="row mx-auto" v-if="resultSet && resultSet.length > 0">
      <div class="text-white col-lg-4 col-md-6 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
        <MySingleItem :parent="'list-view'" :asset="asset" :key="componentKey"/>
      </div>
    </div>
    <div class="d-flex justify-content-center my-3 mx-4" v-else>
      <div class="mt-5">
        <p>No loops - we look forward to seeing your creations...</p>
        <div><LoadingView :message="'.'"/></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MySingleItem from './MySingleItem'
import Pagination from './common/Pagination'
import LoadingView from '@/components/utils/LoadingView'
import { APP_CONSTANTS } from '@/app-constants'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'PageableItems',
  components: {
    MySingleItem, LoadingView, Pagination
  },
  data() {
    return {
      resultSet: [],
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0
    }
  },
  mounted() {
    this.collection = this.$route.params.collection
    let $self = this
    var resizeTimer
    const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN]
    this.numberOfItems = loopRun.tokenCount
    this.fetchPage(0)
    this.loading = false

    window.addEventListener('resize', function(e) {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function() {
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
    gotoPage(page) {
      // this.page = page - 1
      this.fetchPage(page - 1)
    },
    fetchPage(page) {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN]
      const data = {
        contractId: STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
        runKey: loopRun.currentRunKey,
        page: page,
        pageSize: 18
      }
      if (!loopRun.currentRunKey) return
      this.resultSet = null
      this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndRunKey', data).then((results) => {
        this.resultSet = results // this.resultSet.concat(results)
        this.componentKey++
        this.loading = false
      })
      /**
      this.$store.dispatch('rpaySearchStore/findByProjectId', STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME).then((results) => {
        this.resultSet = results
        this.loading = false
      })
      **/
    }
  },
  computed: {
    loopRun() {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN]
      return loopRun
    },
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
