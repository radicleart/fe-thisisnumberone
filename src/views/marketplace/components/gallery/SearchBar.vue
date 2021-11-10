<template>
<div :class="displayClass">
  <div>
    <b-form :inline="(mode !== 'search')" @submit.prevent>
      <div class="ml-3" v-if="mode === 'search'">
        <b-form-input
          size="sm"
          id="search"
          v-model="query.query"
          aria-describedby="search-feedback"
          placeholder="find by name"
          required
          v-on:keyup.enter.prevent="toggleSearching()"
        ></b-form-input>
      </div>
      <div class="ml-3" v-if="mode === 'search' || mode === 'traditional' || mode === 'punks'">
        <b-form-checkbox
          size="lg"
          id="forSale"
          v-model="query.forSale"
          name="forSale"
          value="for sale"
          unchecked-value="all"
          @change="toggleSearching"
          >
          <div class="text-white pointer"><b>Selling</b></div>
        </b-form-checkbox>
      </div>
      <div class="ml-3" v-if="mode === 'search' || mode === 'traditional'">
        <b-form-checkbox
          size="lg"
          id="allEditions"
          v-model="query.allEditions"
          name="allEditions"
          checked-value="yes"
          unchecked-value="firsts"
          @change="toggleSearching"
          >
          <div class="text-white pointer"><b>All Editions</b></div>
        </b-form-checkbox>
      </div>
      <div class="ml-3" v-if="mode === 'search'">
        <b-form-checkbox
          size="lg"
          id="collections"
          v-model="query.allCollections"
          value="one"
          disabled
          checked-value="all"
          unchecked-value="one"
          @change="toggleSearching"
          >
          <div class="text-white pointer"><b>All Collections</b></div>
        </b-form-checkbox>
      </div>
    </b-form>
  </div>
</div>
</template>

<script>

export default {
  name: 'SearchBar',
  components: {
  },
  props: ['mode', 'displayClass'],
  data () {
    return {
      showCollectionsFilter: false,
      query: {
        query: null,
        allCollections: 'one',
        forSale: 'all',
        allEditions: 'firsts',
        sort: 'sortUp'
      }
    }
  },
  methods: {
    toggleSearching () {
      this.query.allCollections = 'one'
      if (this.mode === 'search') {
        this.query.allCollections = 'all'
      }
      this.$emit('updateResults', { opcode: 'update-results', query: this.query })
    }
  },
  computed: {
  }
}
</script>
<style>
</style>
