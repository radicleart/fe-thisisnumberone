<template>
<div v-if="loopRun">
  <b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row>
      <b-col md="3" sm="12">
        <h1 class="border-bottom mb-5">{{loopRun.currentRun}}</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="9" sm="12">
        <h1 class="mb-5 border-bottom">{{loopRun.currentRun}} by: <span class="text-warning">{{loopRun.makerName}}</span></h1>
        <!-- <PunkTracker @updateAllocation="updateAllocation" :items="items" :loopRun="loopRun" :mintAllocations="mintAllocations"/> -->
        <b-row class="mt-5">
          <b-col sm="7" xs="12">
            <img :src="getCollectionImageUrl(loopRun)" width="100%" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
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
                  <div v-if="mintingStatus() === 1">
                    <div v-if="mintingOk()">
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
                  <div v-else-if="mintingStatus() === 2">
                    Public minting is paused
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

export default {
  name: 'PunkMinter',
  components: {
    CollectionSidebar,
    MintingCollectionFlow
  },
  data () {
    return {
      hashone: require('@/assets/img/phase2/No1_outline.png'),
      loaded: false,
      batchOption: 1,
      result: null,
      items: [],
      uiState: 'locking',
      mintAllocations: [],
      gaiaAssets: [],
      makerUrlKey: null,
      currentRunKey: null,
      counter: 0
    }
  },
  mounted () {
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    if (window.eventBus && window.eventBus.$on) {
      const $self = this
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'cancel-minting') {
          $self.$bvModal.hide('minting-modal')
        } else if (data.opcode === 'stx-transaction-sent') {
          $self.$bvModal.hide('minting-modal')
          if (data.txStatus === 'success') {
            $self.result = ' status: ' + data.txStatus
            $self.$bvModal.hide('result-modal')
            // $self.$notify({ type: 'success', title: 'Tx Sent', text: 'Punks minted and meta data saved to Gaia!' })
          } else if (data.txStatus === 'pending') {
            $self.result = ' status: ' + data.txStatus
            $self.$bvModal.show('result-modal')
          } else {
            $self.result = ' status: ' + data.txStatus
          }
        }
      })
    }
  },
  methods: {
    preserveWhiteSpace: function (content) {
      return '<span class="text-description" style="white-space: break-spaces;">DESCRIPTION: ' + content + '</span>'
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
    mintingStatus () {
      if (this.loopRun.status !== 'active') {
        return 2
      } else if (!this.loopRun.guestList || this.loopRun.guestList.length === 0 || this.loopRun.guestList.indexOf(this.profile.stxAddress) > -1) {
        return 1
      } else {
        return 3
      }
    },
    startMinting: function () {
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow' })
      this.$store.commit('rpayStore/setDisplayCard', 100)
      this.$bvModal.show('minting-modal')
    },
    updateAllocation (data) {
      this.uiState = 'locked'
      this.$notify({ type: 'warning', title: 'Upload File', text: 'Allocation event - ' + data })
    },
    getCollectionImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
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
    loopRun () {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.$route.params.collection)
      return loopRun
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    fetchedItems () {
      return this.items.length === this.loopRun.batchSize
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
