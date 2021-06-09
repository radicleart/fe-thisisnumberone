<template>
<div class="container" style="min-height: 85vh;" v-if="hasNfts">
  <div class="mb-5" :key="componentKey">
    <div :key="componentKey" class="row mb-4" v-if="myNfts && myNfts.length > 0">
      <div v-for="(myNft, index) in myNfts" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <single-nft class="mb-2" :myNft="myNft"/>
      </div>
    </div>
  </div>
</div>
<div class="container" style="min-height: 85vh;" v-else>
  Please <b-link to="/login">login</b-link> to find your NFTs
</div>
</template>

<script>
import SingleNft from '@/components/items/SingleNft'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyItems',
  components: {
    SingleNft
  },
  data () {
    return {
      filter: 'pending',
      componentKey: 0
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
  },
  methods: {
  },
  computed: {
    hasNfts () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const purchased = this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      return profile.loggedIn && purchased && purchased.length > 0
    },
    myNfts () {
      const purchased = this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      return purchased
    }
  }
}
</script>
