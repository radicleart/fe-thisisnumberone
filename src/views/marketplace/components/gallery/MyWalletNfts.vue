<template>
  <div v-if="!loading">
    <div class="mt-5 d-flex justify-content-between">
      <h1 class="pointer mb-4 border-bottom" @click="showMinted = !showMinted"><b-icon font-scale="0.6" v-if="showMinted" icon="chevron-down"/><b-icon font-scale="0.6" v-else icon="chevron-right"/> {{tokenCount}} Wallet NFTs</h1>
      <div><span class="text-warning pointer" @click="cacheWalletNfts">Read my NFTs</span></div>
    </div>
    <div class="mb-4" v-if="showMinted">
      <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="tokenCount" v-if="numberOfItems < tokenCount"/>
      <div class="row" v-if="resultSet && resultSet.length > 0">
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
          <MyWalletNft :asset="asset" />
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
import MyWalletNft from './MyWalletNft'
import Pagination from './common/Pagination'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyWalletNfts',
  components: {
    Pagination,
    MyWalletNft
  },
  data () {
    return {
      showMinted: true,
      resultSet: [],
      tokenCount: null,
      pageSize: 20,
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0,
      nowOnPage: 0,
      cached: 0,
      cachedPage: 0,
      cachedPageSize: 50,
      currentRunKey: null,
      timer: null
    }
  },
  mounted () {
    this.fetchPage(0)
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
    cacheWalletNfts () {
      const data = {
        stxAddress: this.profile.stxAddress,
        page: this.cachedPage,
        pageSize: this.cachedPageSize
      }
      this.$store.dispatch('rpayStacksContractStore/cacheWalletNfts', data).then((nfts) => {
        const $self = this
        if (this.timer === null) {
          this.timer = setInterval(function () {
            $self.fetchPage(0)
          }, 5000)
        }
        this.cached += this.cachedPageSize
        if (nfts && this.cached < nfts.nft_events.length) {
          this.cachedPage++
          this.cacheWalletNfts()
        } else {
          clearInterval(this.timer)
        }
      })
    },
    fetchPage (page) {
      const data = {
        stxAddress: this.profile.stxAddress,
        page: page,
        pageSize: this.pageSize
      }
      this.resultSet = []
      this.$store.dispatch('rpayStacksContractStore/fetchWalletNftsByFilters', data).then((result) => {
        this.resultSet = result.tokens
        this.tokenCount = result.tokenCount
        if (this.tokenCount === 0) {
          this.cacheWalletNfts()
        } else {
          clearInterval(this.timer)
        }
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
