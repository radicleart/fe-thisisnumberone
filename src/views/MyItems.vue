<template>
<div class="container" style="min-height: 85vh;">
  <div v-if="myItems && myItems.length > 0" class="mb-5">
    <!--
    <div class="d-flex justify-content-end">
      <b-button class="ml-3" :variant="(filter === 'none') ? 'outline-danger' : 'outline-dark'" @click="filter = 'none'">All</b-button>
      <b-button class="ml-3" :variant="(filter === 'minted') ? 'outline-danger' : 'outline-dark'" @click="filter = 'minted'">Minted</b-button>
      <b-button class="ml-3" :variant="(filter === 'not-minted') ? 'outline-danger' : 'outline-dark'" @click="filter = 'not-minted'">Not Minted</b-button>
    </div>
    -->
    <div class="row mb-4">
      <div v-for="(item, index) in myItems" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <single-item class="mb-2" :item="item" v-if="item.assetHash"/>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-white my-5">
    Nothing to see here so far - <router-link class="text-success" to="/upload-item">Create NFT</router-link>
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
      filter: 'none'
    }
  },
  methods: {
  },
  computed: {
    myItems () {
      const myItems = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEMS]
      if (myItems) return myItems
      return []
    }
  }
}
</script>
