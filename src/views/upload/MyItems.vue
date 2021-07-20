<template>
<b-container v-if="loaded">
  <div class="mb-5" :key="componentKey">
    <div class="d-flex justify-content-end">
      <b-button class="ml-3" :variant="(filter === 'pending') ? 'info' : 'light'" @click="updateFilter('pending')">Pending</b-button>
      <b-button class="ml-3" :variant="(filter === 'minted') ? 'info' : 'light'" @click="updateFilter('minted')">Minted</b-button>
      <b-button class="ml-3" :variant="(filter === 'purchased') ? 'info' : 'light'" @click="updateFilter('purchased')">Purchased</b-button>
      <b-button class="ml-3" :variant="(filter === 'all') ? 'info' : 'light'" @click="updateFilter('all')">All</b-button>
    </div>
    <div :key="componentKey" class="row mb-4" v-if="filteredItems && filteredItems.length > 0">
      <div v-for="(item, index) in filteredItems" :key="index" class="mt-5 col-md-4 col-sm-4 col-6">
        <single-item class="mb-2" :item="item"/>
      </div>
    </div>
  </div>
</b-container>
</template>

<script>
import SingleItem from '@/components/upload/SingleItem'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyItems',
  components: {
    SingleItem
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
    this.$store.dispatch('rpayMyItemStore/fetchItems').then((items) => {
      if (!this.filter) this.$router.push('/my-items/minted')
      this.backupItems = items
      this.loaded = true
    })
  },
  methods: {
    updateFilter (filter) {
      this.filter = filter
      if (filter !== this.$route.params.filter) {
        this.$router.push('/my-items/' + filter)
        this.componentKey++
      }
    }
  },
  computed: {
    filteredItems () {
      if (this.filter === 'all') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_ITEMS]
      } else if (this.filter === 'minted') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_MINTED_ITEMS]
      } else if (this.filter === 'pending') {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_UNMINTED_ITEMS]
      } else {
        return this.$store.getters[APP_CONSTANTS.KEY_MY_PURCHASED_ITEMS]
      }
    }
  }
}
</script>
