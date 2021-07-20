<template>
<div v-if="hasNfts">
  <div class="container" style="min-height: 85vh;">
    <div class="mb-5" :key="componentKey">
      <div :key="componentKey" class="row mb-4" v-if="myNfts && myNfts.length > 0">
        <div v-for="(myNft, index) in myNfts" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
          <single-nft class="mb-2" :myNft="myNft"/>
        </div>
      </div>
    </div>
  </div>
  <b-container class="text-center" id="linkModal">
    <div class="d-flex flex-row-reverse">
      <img width="30px" height="15px" class="text-white mt-3" :src="cross" @click="closeModal()">
    </div>
    <h5>Fill in our survey</h5>
    <b-row class="text-center">
      <b-col cols="1"></b-col>
      <b-col cols="10"><p>If you haven't already, please fill in this survey to help us improve our future giveaways</p></b-col>
    </b-row>
    <b-button class="mt-3" href="https://shrl.ink/HPyh" target="_blank" rel="noopener noreferrer">Sure</b-button>
  </b-container>
</div>
<div class="container" style="min-height: 85vh;" v-else>
  Please <b-link to="/login">login</b-link> to find your NFTs
</div>
</template>

<script>
import SingleNft from '@/components/my-nfts/SingleNft'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyItems',
  components: {
    SingleNft
  },
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      filter: 'pending',
      componentKey: 0
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
  },
  methods: {
    closeModal () {
      document.getElementById('linkModal').style.display = 'none'
    }
  },
  computed: {
    hasNfts () {
      return this.myNfts && this.myNfts.length > 0
    },
    myNfts () {
      // const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      // const contractId = STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME
      // const myContractAssets = this.$store.getters[APP_CONSTANTS.KEY_ASSETS_BY_CONTRACT_ID_AND_OWNER]({ contractId: contractId, stxAddress: profile.stxAddress })
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
