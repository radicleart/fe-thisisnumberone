<template>
<b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5" v-if="!loading">
  <b-row>
    <b-col md="3" sm="12">
      <h1 class="border-bottom mb-5">My NFTs</h1>
      <CollectionSidebar :allowUploads="true" @update="update"/>
    </b-col>
    <b-col md="9" sm="12" >
      <div v-if="showUploads">
        <h1 class="mb-4 border-bottom">Uploads (<b-link to="/upload-item">new</b-link>)</h1>
        <b-row>
          <b-col v-for="(gaiaAsset, index) in gaiaAssets" :key="index" lg="3" md="6" sm="6" xs="12">
            <MySingleNft class="mb-2" :item="gaiaAsset"/>
          </b-col>
        </b-row>
      </div>
      <div v-if="showWalletNfts">
        <MyWalletNfts/>
      </div>
      <div v-else-if="loopRun && (loopRun.status !== 'disabled')">
        <MyPageableItems :loopRun="loopRun"/>
      </div>
      <div v-if="loopRun && loopRun.type === 'punks' && loopRun.status === 'unrevealed'">
        <p><b-link :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.currentRun}} artwork available - mint here!</b-link></p>
      </div>
      <div>
        <h1 class="pointer mb-4 border-bottom" @click="showPending = !showPending"><b-icon font-scale="0.6" v-if="showPending" icon="chevron-down"/><b-icon font-scale="0.6" v-else icon="chevron-right"/> My Transactions</h1>
        <b-row class="mb-4" v-if="showPending && loopRun">
          <div class="w-100 d-flex justify-content-end">
            <span @click="myTxFilter = 'pending'" class="pointer mr-3 text-light" :style="(myTxFilter === 'pending') ? 'text-decoration: underline' : ''">pending</span>
            <span @click="myTxFilter = 'success'" class="pointer mr-3 text-light" :style="(myTxFilter === 'success') ? 'text-decoration: underline' : ''">success</span>
            <span @click="myTxFilter = 'failed'" class="pointer mr-3 text-light" :style="(myTxFilter === 'failed') ? 'text-decoration: underline' : ''">failed</span>
            <span @click="myTxFilter = 'all'" class="pointer mr-5 text-light" :style="(myTxFilter === 'all') ? 'text-decoration: underline' : ''">all</span>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12" v-for="(allocation, index) of filteredAllocations()" :key="index">
            <MySingleAllocation :myTxFilter="myTxFilter" :parent="'list-view'" :loopRun="loopRun" :allocation="allocation" :key="componentKey"/>
          </div>
        </b-row>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import MySingleAllocation from '@/views/marketplace/components/gallery/MySingleAllocation'
import MySingleNft from '@/views/marketplace/components/gallery/MySingleNft'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import { APP_CONSTANTS } from '@/app-constants'
import MyPageableItems from '@/views/marketplace/components/gallery/MyPageableItems'
import MyWalletNfts from '@/views/marketplace/components/gallery/MyWalletNfts'

export default {
  name: 'MyNftLibrary',
  components: {
    MyPageableItems,
    MyWalletNfts,
    MySingleAllocation,
    CollectionSidebar,
    MySingleNft
  },
  data () {
    return {
      componentKey: 0,
      approved: false,
      loopRun: null,
      myTxFilter: 'pending',
      loading: true,
      showPending: true,
      showUploads: false,
      showWalletNfts: false,
      allocations: []
    }
  },
  watch: {
    '$route' () {
      this.loading = true
      this.fetchLoopRun()
    }
  },
  mounted () {
    let currentRunKey = this.$route.params.collection
    if (!currentRunKey) {
      this.showWalletNfts = true
      this.loading = false
      currentRunKey = process.env.VUE_APP_DEFAULT_LOOP_RUN
      this.fetchLoopRun()
      // if (this.$route.path !== '/my-nfts/' + currentRunKey) this.$router.push('/my-nfts/' + currentRunKey)
    } else {
      this.fetchLoopRun()
    }
  },
  methods: {
    fetchLoopRun () {
      let currentRunKey = this.$route.params.collection
      if (!currentRunKey) {
        currentRunKey = process.env.VUE_APP_DEFAULT_LOOP_RUN
      }
      this.$store.dispatch('rpayCategoryStore/fetchLoopRun', currentRunKey).then((loopRun) => {
        this.loopRun = loopRun
        this.fetchAllocations()
        this.loading = false
      })
    },
    fetchAllocations () {
      if (!this.loopRun) return
      const params = { stxAddress: this.profile.stxAddress, contractId: this.loopRun.contractId }
      this.$store.dispatch('rpayTransactionStore/fetchByContractIdAndFrom', params).then((results) => {
        this.allocations = results || []
      })
    },
    filteredAllocations () {
      if (!this.myTxFilter || this.myTxFilter === 'all') return this.allocations
      return this.allocations.filter((o) => o.txStatus === this.myTxFilter)
    },
    update (data) {
      this.showWalletNfts = false
      this.showUploads = false
      if (data.opcode === 'show-uploads') {
        this.showUploads = true
      } else if (data.opcode === 'show-collection') {
        if (data.loopRun.currentRunKey !== this.$route.params.collection) {
          if (this.$route.path !== '/my-nfts/' + data.loopRun.currentRunKey) this.$router.push('/my-nfts/' + data.loopRun.currentRunKey)
        }
        this.componentKey++
      } else if (data.opcode === 'show-wallet-nfts') {
        if (this.$route.path !== '/my-nfts') this.$router.push('/my-nfts')
        this.showWalletNfts = true
      }
    },
    startLogin () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then((profile) => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: this.loopRun.currentRunKey, stxAddress: profile.stxAddress }, { root: true })
          this.$emit('registerByConnect')
        }).catch(() => {
          this.$store.commit('setModalMessage', 'Install the Stacks Web Wallet to get going on the decentralised web.')
          this.$root.$emit('bv::show::modal', 'waiting-modal')
          this.webWalletNeeded = true
        })
      }
    },
    closeModal () {
      document.getElementById('linkModal').style.display = 'none'
    }
  },
  computed: {
    gaiaAssets () {
      const gaiaAssets = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEMS]
      return gaiaAssets
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style scoped>
#my-nft-tabs >>> .nav-link.active {
  color: #000 !important;
}
#my-nft-tabs >>> .nav-link {
  color: #fff !important;
}
#linkModal {
  z-index: 100;
  position: sticky;
  left: 100%;
  bottom: 0;
  width: 25rem;
  height: 25rem;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(105, 63,0,1));
  color: white;
  align-items: center;
}
h5 {
  color: white;
  font-size: 2.5rem;
  padding-top: 1.5rem;
}
.btn {
  background-color: white !important;
  color: black !important;
  border: none !important;
  align-items: center;
  font-size: 2rem;
}
</style>
