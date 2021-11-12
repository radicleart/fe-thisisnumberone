<template>
<b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5" v-if="!loading">
  <b-row>
    <b-col md="3" sm="12">
      <h1 class="border-bottom mb-5">My NFTs</h1>
      <CollectionSidebar :allowUploads="true" @update="update"/>
    </b-col>
    <b-col md="9" sm="12" v-if="showUploads">
      <h1 class="mb-4 border-bottom">Uploads</h1>
      <b-row>
        <b-col v-for="(gaiaAsset, index) in gaiaAssets" :key="index" lg="3" md="6" sm="6" xs="12">
          <MySingleNft class="mb-2" :item="gaiaAsset"/>
        </b-col>
      </b-row>
    </b-col>
    <b-col md="8" sm="12" v-else :key="componentKey">
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
      <div v-if="loopRun && (loopRun.status !== 'disabled')">
        <MyPageableItems :loopRun="loopRun"/>
      </div>
      <div v-if="loopRun.type === 'punks' && loopRun.status === 'unrevealed'">
        <p><b-link :to="'/punk-minter/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.currentRun}} artwork available - mint here!</b-link></p>
      </div>
    </b-col>
  </b-row>
  <div v-if="profile.stxAddress === 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5'">
      <div class="row">
        <h2>Update Meta Data</h2>
        <div class="col-md-12 col-xs-12">
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="signer - public key 33 bytes">Signer</span></div>
            </div>
            <b-input v-model="mdContractId" placeholder="mdContractId"></b-input>
            <b-input v-model="mdNftIndex" placeholder="mdNftIndex"></b-input>
            <b-button class="mr-3" variant="light" @click.prevent="updateMetaData()">Update</b-button>
          </div>
        </div>
      </div>
  </div>
</b-container>
</template>

<script>
import MySingleAllocation from '@/views/marketplace/components/gallery/MySingleAllocation'
import MySingleNft from '@/views/marketplace/components/gallery/MySingleNft'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import { APP_CONSTANTS } from '@/app-constants'
import MyPageableItems from '@/views/marketplace/components/gallery/MyPageableItems'

export default {
  name: 'MyNftLibrary',
  components: {
    MyPageableItems,
    MySingleAllocation,
    CollectionSidebar,
    MySingleNft
  },
  data () {
    return {
      componentKey: 0,
      loopRun: null,
      mdContractId: null,
      mdNftIndex: null,
      myTxFilter: 'pending',
      loading: true,
      showPending: true,
      showUploads: false,
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
      currentRunKey = process.env.VUE_APP_DEFAULT_LOOP_RUN
      if (this.$route.path !== '/my-nfts/' + currentRunKey) this.$router.push('/my-nfts/' + currentRunKey)
      return
    }
    this.fetchLoopRun()
  },
  methods: {
    fetchLoopRun () {
      let currentRunKey = this.$route.params.collection
      if (!currentRunKey) {
        currentRunKey = process.env.VUE_APP_DEFAULT_LOOP_RUN
      }
      this.$store.dispatch('rpayCategoryStore/fetchLoopRun', currentRunKey).then((loopRun) => {
        this.loopRun = loopRun
        this.mdContractId = this.loopRun.contractId
        this.fetchAllocations()
        this.loading = false
      })
    },
    fetchAllocations () {
      const params = { stxAddress: this.profile.stxAddress, contractId: this.loopRun.contractId }
      this.$store.dispatch('rpayTransactionStore/fetchByContractIdAndFrom', params).then((results) => {
        this.allocations = results || []
      })
    },
    filteredAllocations () {
      if (!this.myTxFilter || this.myTxFilter === 'all') return this.allocations
      return this.allocations.filter((o) => o.txStatus === this.myTxFilter)
    },
    updateMetaData () {
      this.$store.dispatch('rpayStacksContractStore/fetchContractAssetByNftIndex', { contractId: this.mdContractId, nftIndex: this.mdNftIndex }).then((item) => {
        const assetHash = item.tokenInfo.assetHash
        const metaDataUrl = item.tokenInfo.metaDataUrl
        let lastIndex = metaDataUrl.lastIndexOf('/')
        const newUrl = metaDataUrl.substring(0, lastIndex + 1) + assetHash + '.json'
        this.$store.dispatch('rpayManageCacheStore/fetchMetaData', newUrl).then((metaData) => {
          lastIndex = metaData.image.lastIndexOf('/')
          const index = metaData.image.substring(lastIndex + 1).split('.')[0]
          metaData.attributes.index = index
          metaData.projectId = this.loopRun.contractId
          this.$store.dispatch('rpayMyItemStore/saveItem', metaData).then(() => {
            this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
          })
        })
      })
    },
    update (data) {
      if (data.opcode === 'show-uploads') {
        this.showUploads = true
      } else if (data.opcode === 'show-collection') {
        this.showUploads = false
        if (data.loopRun.currentRunKey !== this.$route.params.collection) {
          if (this.$route.path !== '/my-nfts/' + data.loopRun.currentRunKey) this.$router.push('/my-nfts/' + data.loopRun.currentRunKey)
        }
        this.componentKey++
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
