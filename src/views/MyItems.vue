<template>
<div class="container" style="min-height: 85vh;">
  <div v-if="filteredItems" class="mb-5">
    <div class="d-flex justify-content-end">
      <b-button class="ml-3" :variant="(filter === 'pending') ? 'info' : 'light'" @click="filter = 'pending'">Pending</b-button>
      <b-button class="ml-3" :variant="(filter === 'minted') ? 'info' : 'light'" @click="filter = 'minted'">Minted</b-button>
      <b-button class="ml-3" :variant="(filter === 'purchased') ? 'info' : 'light'" @click="filter = 'purchased'">Purchased</b-button>
    </div>
    <div class="row mb-4">
      <div v-for="(item, index) in filteredItems" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <single-item class="mb-2" :item="item"/>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-white my-5">
    Nothing to see here so far - <router-link class="text-info" to="/upload-item">Create NFT</router-link>
  </div>
</div>
</template>

<script>
import SingleItem from '@/components/items/SingleItem'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyItems',
  components: {
    SingleItem
  },
  data () {
    return {
      filter: 'pending'
    }
  },
  methods: {
  },
  computed: {
    filteredItems () {
      if (this.filter === 'pending') return this.myPendingItems
      else if (this.filter === 'minted') return this.myMintedItems
      else return this.myPurchasedItems
    },
    myPurchasedItems () {
      const myItems = this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      if (myItems) return myItems
      return []
    },
    myMintedItems () {
      const myItems = this.$store.getters[APP_CONSTANTS.KEY_MY_MINTED_ITEMS]
      if (myItems) return myItems
      return []
    },
    myPendingItems () {
      const myItems = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEMS]
      if (myItems) return myItems
      return []
    }
  }
}
</script>
