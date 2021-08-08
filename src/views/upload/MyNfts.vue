<template>
<b-container class="text-white mt-5" v-if="loaded">
  <h1>My Library</h1>
  <b-tabs justified content-class="text-white mb-5">
    <b-tab :title="'NFTs (' + hasNfts + ')'" active>
      <p class="mt-4">NFTs you currently own - these may be files you
        uploaded and minted and still own or NFTs you bought from other
        users or that were transferred to you. They also include editions
        of NFT files you minted.</p>
      <b-row>
        <b-col class="text-center" v-for="(myNft, index1) in myNfts" :key="index1" lg="3" md="4" sm="6" xs="12">
          <MySingleNft class="mb-2" :item="myNft" :token="myTokens[index1]"/>
        </b-col>
      </b-row>
    </b-tab>
    <b-tab v-if="canUpload()" :title="'Uploads (' + gaiaAssets.length + ')'">
      <p class="mt-4">Files you uploaded to your Gaia storage bucket.</p>
      <p>If you minted them (to create NFTs) you may also have
        sold or transferred the NFT to another wallet. </p>
      <b-row>
        <b-col v-for="(gaiaAsset, index) in gaiaAssets" :key="index" lg="3" md="6" sm="6" xs="12">
          <MySingleNft class="mb-2" :item="gaiaAsset"/>
        </b-col>
      </b-row>
    </b-tab>
  </b-tabs>
</b-container>
<div class="container" style="min-height: 85vh;" v-else>
  <b-container class="text-white mt-5">
    <h1>No NFTs</h1>
    <p>Upload a file and mint it to create your first NFT</p>
  </b-container>
</div>
</template>

<script>
import MySingleNft from '@/components/upload/MySingleNft'
// import SingleNft from '@/components/upload/SingleNft'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyNfts',
  components: {
    MySingleNft
  },
  data () {
    return {
      loaded: false,
      myNfts: []
    }
  },
  mounted () {
    this.data = { stxAddress: this.profile.stxAddress, mine: true }
    const myContractAssets = this.$store.getters[APP_CONSTANTS.KEY_MY_CONTRACT_ASSETS]
    for (let i = 0; i < myContractAssets.length; i++) {
      const ga = this.$store.getters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](myContractAssets[i].tokenInfo.assetHash)
      ga.contractAsset = Object.assign({}, myContractAssets[i])
      this.myNfts.push(ga)
    }
    this.loaded = true
  },
  methods: {
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
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
    myTokens () {
      const myContractAssets = this.$store.getters[APP_CONSTANTS.KEY_MY_CONTRACT_ASSETS]
      return myContractAssets
    }
  }
}
</script>

<style scoped>
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
