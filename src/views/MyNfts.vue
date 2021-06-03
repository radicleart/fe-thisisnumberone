<template>
<div class="container" style="min-height: 85vh;" v-if="loaded">
  <div class="mb-5" :key="componentKey">
    <div :key="componentKey" class="row mb-4" v-if="filteredItems && filteredItems.length > 0">
      <div v-for="(item, index) in filteredItems" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <single-nft class="mb-2" :item="item"/>
      </div>
    </div>
  </div>
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
      componentKey: 0,
      backupItems: null,
      loaded: false
    }
  },
  mounted () {
    this.filter = this.$route.params.filter
    this.$store.dispatch('myItemStore/fetchItems').then((items) => {
      if (!this.filter) this.$router.push('/my-nfts')
      this.backupItems = items
      this.loaded = true
    })
  },
  methods: {
  },
  computed: {
    filteredItems () {
      return this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      /**
      if (this.filter === 'all') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_ITEMS]
      } else if (this.filter === 'minted') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_MINTED_ITEMS]
      } else if (this.filter === 'pending') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_UNMINTED_ITEMS]
      } else {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      }
      **/
    }
  }
}
</script>
