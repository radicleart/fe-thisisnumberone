<template>
  <div>
    <div class="mb-4 border-bottom d-flex justify-content-between">
      <h1 class="pointer" @click="showMinted = !showMinted"><b-icon font-scale="0.6" v-if="showMinted" icon="chevron-down"/><b-icon font-scale="0.6" v-else icon="chevron-right"/> {{numberOfItems}} NFTs</h1>
      <div>
        <b-form-checkbox
          size="lg"
          id="batchMode"
          v-model="forSale"
          name="forSale"
          value="for sale"
          unchecked-value="all"
          @change="toggleSelling"
          >
          <div class="text-white pointer" v-if="forSale === 'all'"><b>All</b></div>
          <div class="text-white pointer" v-else><b>For Sale</b></div>
        </b-form-checkbox>
      </div>
    </div>
    <div class="mb-4" v-if="showMinted" :key="componentKey">
      <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
      <div id="my-table" class="row mx-auto" v-if="resultSet && resultSet.length > 0">
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

export default {
  name: 'PageableItems',
  components: {
    MySingleItem, Pagination
  },
  props: ['loopRun'],
  data () {
    return {
      forSale: 'all',
      showMinted: true,
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
    this.numberOfItems = this.loopRun.tokenCount
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
    skipme (asset) {
      if (this.isTheV2Contract()) {
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
      this.fetchPage(page - 1)
    },
    isTheV2Contract () {
      return this.loopRun.contractId.indexOf('thisisnumberone-v2') > -1
    },
    toggleSelling () {
      this.fetchPage(0, true)
    },
    fetchPage (page, reset) {
      const data = {
        contractId: (this.loopRun) ? this.loopRun.contractId : STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
        runKey: this.loopRun.currentRunKey,
        forSale: this.forSale !== 'all',
        page: page,
        pageSize: this.pageSize
      }
      if (!this.loopRun.currentRunKey) return
      this.resultSet = []
      if (this.isTheV2Contract()) {
        this.fetchV2Page()
      } else {
        // after V2 we added the runKey/makerurl to the metaDataUrl to filter tokens more easily.
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndRunKey', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = result.tokenCount
          this.numberOfItems = result.tokenCount
          if (reset) this.componentKey++
          this.loading = false
        })
      }
    },
    fetchV2Page (page, reset) {
      const data = {
        contractId: (this.loopRun) ? this.loopRun.contractId : STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
        runKey: this.loopRun.currentRunKey,
        forSale: this.forSale !== 'all',
        page: page,
        pageSize: this.pageSize
      }
      if (!this.loopRun.currentRunKey) return
      this.resultSet = []
      data.asc = true
      if (this.loopRun.currentRunKey === process.env.VUE_APP_DEFAULT_LOOP_RUN) {
        data.pageSize = 5
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractId', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = 5
          this.numberOfItems = this.tokenCount
          if (reset) this.componentKey++
          this.loading = false
        })
      } else {
        this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndName', data).then((result) => {
          this.resultSet = result.gaiaAssets
          this.tokenCount = result.tokenCount
          this.numberOfItems = result.tokenCount
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
