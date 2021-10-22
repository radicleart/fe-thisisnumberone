<template>
<div v-if="loopRun">
  <b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5">
    <b-row>
      <b-col md="4" sm="12">
        <h1 class="border-bottom mb-5">{{loopRun.currentRun}}</h1>
        <CollectionSidebar :allowUploads="false" @update="update"/>
      </b-col>
      <b-col md="8" sm="12">
        <h1 class="mb-4 border-bottom">Mint {{loopRun.currentRun}}</h1>
        <!-- <PunkTracker @updateAllocation="updateAllocation" :items="items" :loopRun="loopRun" :mintAllocations="mintAllocations"/> -->
        <b-row>
          <b-col cols="4">
            <img :src="getCollectionImageUrl(loopRun)" width="100%" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Collection\n' + loopRun.currentRun"/>
            <div class="text-center mt-2 text-small">
              <h3>{{loopRun.currentRun}} ({{loopRun.tokenCount + '/' + loopRun.versionLimit}})</h3>
              <div v-if="mintingStatus() === 1">
                <div>
                  <div class="d-flex justify-content-between">
                    <b-form-select style="text-align: center; font-size: 2rem; font-weight: 700; height: 4rem;" v-if="loopRun.batchSize > 1" id="batchOption" v-model="batchOption" :options="batchOptions()"></b-form-select>
                    <b-button class="mx-2" variant="warning" @click="startMinting()">Mint<span v-if="loopRun && loopRun.batchSize > 1"> Next {{batchOption}}</span></b-button>
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
            <!-- <div class="mt-2 text-small">by: <span class="text-warning">{{loopRun.makerName}}</span></div> -->
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
  <b-modal size="md" id="minting-modal">
    <MintingCollectionFlow :loopRun="loopRun" @update="update" :batchOption="batchOption"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
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
      loaded: false,
      batchOption: 1,
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
        }
      })
    }
  },
  methods: {
    update (data) {
      if (data.opcode === 'cancel') {
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
