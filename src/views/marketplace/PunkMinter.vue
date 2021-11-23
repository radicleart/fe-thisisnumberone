<template>
<div v-if="loopRun">
  <b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row>
      <b-col md="3" sm="12">
        <h1 class="border-bottom mb-5">{{loopRun.currentRun}}</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col :key="componentKey" md="9" sm="12">
        <h1 class="mb-5 border-bottom">{{loopRun.currentRun}} by: <span class="text-warning">{{loopRun.makerName}}</span></h1>
        <!-- <PunkTracker @updateAllocation="updateAllocation" :items="items" :loopRun="loopRun" :mintAllocations="mintAllocations"/> -->
        <b-row class="mt-5">
          <b-col sm="7" xs="12">
            <div>
              <VideoJsPlayer v-if="loopRun.video" v-on="handleVideoEvent()" @error="setAltImg" :options="videoOptions()"/>
              <img v-else :src="mintImage" width="100%" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
            </div>
          </b-col>
          <b-col sm="5" xs="12">
            <b-row style="height: 100%;">
              <b-col cols="12" align-self="start">
                <h1 class="border-bottom mb-5">{{loopRun.currentRun}} ({{loopRun.tokenCount + '/' + loopRun.versionLimit}})</h1>
                <p class="mt-5">EDITION: {{loopRun.versionLimit}}</p>
                <p>AVAILABLE: {{loopRun.versionLimit - loopRun.tokenCount}}</p>
                <p class="mt-5" v-if="loopRun.description" v-html="preserveWhiteSpace(loopRun.description)"></p>
              </b-col>
              <b-col cols="12" align-self="end">
                <div class="mt-2">
                  <span>{{credits}} Mints Remaining</span>
                </div>
                <div class="mt-2" v-if="walletTx">
                  <a class="mr-2" :href="transactionUrl()" target="_blank"><b-icon class="text-warning" font-scale="1.2" icon="arrow-up-right-circle"/> view on explorer</a>
                </div>
                <div class="mt-2" v-else>
                  <div v-if="mintingStatus === 1">
                    <div v-if="mintingOk">
                      <b-row class="">
                        <b-col cols="6" class="px-0 pr-1 pl-4 mx-0">
                          <b-form-select style="text-align: center; font-size: 2rem; font-weight: 700; height: 4rem;" v-if="loopRun.batchSize > 1" id="batchOption" v-model="batchOption" :options="batchOptions()"></b-form-select>
                        </b-col>
                        <b-col cols="6" class="px-0 pl-1 pr-4 mx-0">
                          <b-button class="w-100 text-white" variant="warning" @click="startMinting()">Mint<span v-if="loopRun && loopRun.batchSize > 0"> {{batchOption}}</span></b-button>
                        </b-col>
                      </b-row>
                    </div>
                    <div v-else>
                      <div class="d-flex justify-content-between">
                        Minting paused due to high load
                      </div>
                    </div>
                  </div>
                  <div v-else-if="mintingStatus === 2">
                    Public minting is paused
                  </div>
                  <div v-else-if="mintingStatus === 5">
                    Mint pass all used up!
                  </div>
                  <div v-else>
                    Public minting starts soons
                  </div>
                </div>
                <div class="mt-4 pt-4 border-top text-right"><img :src="hashone" /></div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
  <b-modal size="md" id="minting-modal">
    <MintingCollectionFlow :loopRun="loopRun" @update="update" :batchOption="batchOption"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal scrollable id="result-modal" title="">
    <div class="row">
      <div class="col-12 my-1">
        <h2>Crash Punk Minting</h2>
        <div class="">Crash Punks mints on the Stacks / Bitcoin Blockchains</div>
        <div class="">This can take a little while but once minted the NFT will appear
          in your <b-link class="text-info" :to="'/my-nfts/' + loopRun.currentRunKey">NFT Library</b-link>
        </div>
        <div class="text-center mt-4">Please leave this tab open while we store your meta data.</div>
        <div class="text-center mt-2"><b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon></div>
      </div>
    </div>
    <template v-slot:modal-footer>
      <div class="w-100 text-right text-xsmall">
        {{result}}
      </div>
    </template>
  </b-modal>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import MintingCollectionFlow from '@/views/marketplace/components/toolkit/mint-setup/MintingCollectionFlow'
import VideoJsPlayer from '@/views/marketplace/components/media/VideoJsPlayer'

export default {
  name: 'PunkMinter',
  components: {
    CollectionSidebar,
    VideoJsPlayer,
    MintingCollectionFlow
  },
  data () {
    return {
      hashone: require('@/assets/img/phase2/No1_outline.png'),
      waitingImage: 'https://images.prismic.io/radsoc/f60d92d0-f733-46e2-9cb7-c59e33a15fc1_download.jpeg?auto=compress,format',
      componentKey: 0,
      loaded: false,
      batchOption: 1,
      mintingStatus: 3,
      result: null,
      loopRun: null,
      items: [],
      uiState: 'locking',
      mintAllocations: [],
      gaiaAssets: [],
      makerUrlKey: null,
      currentRunKey: null,
      walletTx: false,
      mintImage: null,
      allowed: false,
      counter: 0
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.currentRunKey).then((loopRun) => {
      this.loopRun = loopRun
      const data = {
        stxAddress: this.profile.stxAddress,
        contractId: loopRun.contractId,
        currentRunKey: this.$route.params.collection
      }
      this.$store.dispatch('rpayCategoryStore/checkGuestList', data).then((result) => {
        this.mintImage = loopRun.mintImage1 || loopRun.image
        this.allowed = result
        this.setMintingStatus()
      })
    })
    if (window.eventBus && window.eventBus.$on) {
      const $self = this
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'cancel-minting') {
          $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-sent') {
          $self.$bvModal.hide('minting-modal')
          if (data.txStatus === 'success') {
            $self.walletTx = false
            $self.$store.dispatch('rpayCategoryStore/fetchLoopRun', $self.currentRunKey).then((loopRun) => {
              $self.loopRun = loopRun
              $self.setMintingStatus()
              $self.componentKey++
              $self.mintImage = $self.loopRun.mintImage3 || $self.loopRun.image
              $self.result = ' status: ' + data.txStatus
              $self.$bvModal.hide('result-modal')
            })
            // $self.$notify({ type: 'success', title: 'Tx Sent', text: 'Punks minted and meta data saved to Gaia!' })
          } else if (data.txStatus === 'pending') {
            $self.walletTx = data
            $self.result = ' status: ' + data.txStatus
            $self.mintImage = $self.loopRun.mintImage2 || $self.loopRun.image
            // const vals = { stxAddress: $self.profile.stxAddress, currentRunKey: $self.loopRun.currentRunKey }
            // $self.$store.dispatch('rpayCategoryStore/addToBlockList', vals)
            // $self.$bvModal.show('result-modal')
          } else {
            $self.result = ' status: ' + data.txStatus
            $self.mintImage = $self.loopRun.image
          }
        }
      })
    }
  },
  methods: {
    transactionUrl: function () {
      if (!this.walletTx) return '#'
      let txId = this.walletTx.txId
      if (!txId.startsWith('0x')) txId = '0x' + txId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    setAltImg: function (event) {
      event.target.src = this.waitingImage
    },
    handleVideoEvent () {
      return this.items.length === this.loopRun.batchSize
    },
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">DESCRIPTION: ' + content + '</span>'
    },
    setMintingStatus () {
      if (this.loopRun.status !== 'active' && this.loopRun.status !== 'unrevealed' && this.credits > 0) {
        this.mintingStatus = 2
      } else if (this.allowed && this.credits > 0) {
        this.mintingStatus = 1
      } else if (this.credits <= 0) {
        this.mintingStatus = 5
      } else {
        this.mintingStatus = 3
      }
    },
    mintingOk () {
      return this.mempool && this.mempool.total < this.mempoolSettings.threshold3
    },
    update (data) {
      if (data.opcode === 'show-collection') {
        this.$router.push('/nft-marketplace/' + data.loopRun.makerUrlKey + '/' + data.loopRun.currentRunKey)
      } else if (data.opcode === 'cancel') {
        this.$bvModal.hide('minting-modal')
      }
    },
    batchOptions () {
      const options = []
      for (let i = 1; i <= this.loopRun.batchSize; i++) {
        options.push(i)
      }
      return options
    },
    startMinting: function () {
      this.$store.dispatch('rpayCategoryStore/registerSpin', this.profile)
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow' })
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.$bvModal.show('minting-modal')
    },
    updateAllocation (data) {
      this.uiState = 'locked'
      this.$notify({ type: 'warning', title: 'Upload File', text: 'Allocation event - ' + data })
    },
    videoOptions () {
      const videoOptions = {
        emitOnHover: false,
        playOnHover: false,
        assetHash: null,
        bigPlayer: false,
        autoplay: true,
        muted: false,
        controls: true,
        showMeta: false,
        dimensions: 'max-width: 100%; max-height: auto;',
        aspectRatio: '1:1',
        poster: this.loopRun.image,
        sources: [{ src: this.loopRun.video }],
        fluid: false
      }
      return videoOptions
    }
  },
  computed: {
    mempool () {
      const mempool = this.$store.getters[APP_CONSTANTS.KEY_MEMPOOL]
      return mempool || {}
    },
    mempoolSettings () {
      const mempoolSettings = this.$store.getters[APP_CONSTANTS.KEY_MEMPOOL_SETTINGS]
      return mempoolSettings || {}
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    fetchedItems () {
      return this.items.length === this.loopRun.batchSize
    },
    credits () {
      if (!this.profile.loggedIn) return true
      const loopRun = this.loopRun
      if (loopRun) {
        const remaining = loopRun.spinsPerDay - loopRun.spinsToday
        return (remaining > 0) ? remaining : 0
      }
      return 0
    }
  }
}
</script>
<style lang="scss">
#minting-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}
#minting-tools  .nav-link.active {
  color: #000;
}
#minting-tools .nav-link:hover {
  color: #ccc;
}
#minting-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}
#minting-tools  .nav-link.active {
  color: #000;
}
#minting-tools .nav-link:hover {
  color: #ccc;
}

</style>
