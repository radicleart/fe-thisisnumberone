<template>
<b-container fluid id="my-nft-tabs" class="px-5 text-white mt-5" v-if="loaded">
  <b-row>
    <b-col md="4" sm="12">
      <h1 class="border-bottom mb-5">My NFTs</h1>
      <CollectionSidebar :allowUploads="true" @update="update"/>
    </b-col>
    <b-col md="8" sm="12" v-if="showUploads">
      <h1 class="mb-4 border-bottom">Uploads</h1>
      <b-row>
        <b-col v-for="(gaiaAsset, index) in gaiaAssets" :key="index" lg="3" md="6" sm="6" xs="12">
          <MySingleNft class="mb-2" :item="gaiaAsset"/>
        </b-col>
      </b-row>
    </b-col>
    <b-col md="8" sm="12" v-else>
      <h1 class="mb-4 border-bottom">NFTs</h1>
      <div class="row mb-4">
        <div v-for="(item, index) in myNfts" :key="index" class="mt-5 col-md-4 col-sm-6 col-xs-12">
          <MySingleItem :asset="item"/>
        </div>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import CollectionSidebar from '@/views/marketplace/components/gallery/CollectionSidebar'
import MySingleItem from '@/views/marketplace/components/gallery/MySingleItem'
import MySingleNft from '@/views/marketplace/components/gallery/MySingleNft'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyNftLibrary',
  components: {
    MySingleNft,
    MySingleItem,
    CollectionSidebar
  },
  data () {
    return {
      loaded: false,
      showUploads: false
    }
  },
  mounted () {
    this.data = { stxAddress: this.profile.stxAddress, mine: true }
    const myContractAssets = this.$store.getters[APP_CONSTANTS.KEY_MY_CONTRACT_ASSETS]
    for (let i = 0; i < myContractAssets.length; i++) {
      const ga = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](myContractAssets[i].tokenInfo.assetHash)
      if (ga) ga.contractAsset = Object.assign({}, myContractAssets[i])
      this.myNfts.push(ga)
    }
    this.loaded = true
  },
  methods: {
    update (data) {
      if (data.opcode === 'show-uploads') {
        this.showUploads = true
      } else if (data.opcode === 'show-collection') {
        this.showUploads = false
        this.loopRun = data.loopRun
      }
    },
    startLogin () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN, stxAddress: profile.stxAddress }, { root: true })
          this.$emit('registerByConnect')
        }).catch((err) => {
          console.log(err)
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
    hasNfts () {
      const myContractAssets = this.$store.getters[APP_CONSTANTS.KEY_MY_CONTRACT_ASSETS]
      return myContractAssets && myContractAssets.length
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    myNfts () {
      const myGaiaAssets = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS_BY_OWNER]({ stxAddress: this.profile.stxAddress })
      if (process.env.VUE_APP_NETWORK === 'local') {
        myGaiaAssets.concat(this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSETS_BY_OWNER]({ stxAddress: 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG' }))
      }
      return myGaiaAssets
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
