<template>
<div :class="displayClass">
  <div v-if="mode.indexOf('wallet') > -1">
    <div>
      <div class="pointer" v-if="assetNames.length > 0">
        <b-nav-item-dropdown class="" no-caret>
          <template v-slot:button-content class="xg-dd">
            <span class="text-warning">filter by asset</span>
          </template>
          <b-dropdown-item v-for="(assetName, index) in assetNames" :key="index" class="pl-0 m-0"  @click.prevent="toggleSearching(assetName)">{{assetName}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
    </div>
  </div>
  <div v-else>
    <b-form :inline="(mode !== 'search')" @submit.prevent>
      <div class="ml-3" v-if="mode === 'search'">
        <b-form-input
          style="height: 25px; font-weight: 700; font-size: 0.8rem;"
          size="sm"
          id="search"
          v-model="query.query"
          aria-describedby="search-feedback"
          placeholder="find by name"
          required
          v-on:keyup.enter.prevent="toggleSearching()"
        ></b-form-input>
      </div>
      <div class="pointer ml-3" v-if="showReverseDir()">
        <span @click="reverseDir()"><span class="text-warning" v-if="query.sortDir === 'sortDown'">most recent</span><span v-else>least recent</span></span>
      </div>
      <div class="pointer ml-3" v-if="showEditions()">
        <span @click="reverseEditions()"><span class="text-warning" v-if="query.editions">all editions</span><span v-else>first editions</span></span>
      </div>
      <div class="pointer" v-if="showSelling()">
        <b-nav-item-dropdown class="" no-caret :right="(mode !== 'search')">
          <template v-slot:button-content class="xg-dd">
            <span class="text-warning" v-if="query.onSale">on sale</span><span v-else>on sale</span>
          </template>
          <b-dropdown-item class="pl-0 m-0"  @click.prevent="reverseOnSale('lowest')">lowest price</b-dropdown-item>
          <b-dropdown-item class="pl-0 m-0"  @click.prevent="reverseOnSale('highest')">highest price</b-dropdown-item>
          <b-dropdown-item class="pl-0 m-0"  @click.prevent="reverseOnSale('ignore')">ignore price</b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
      <div class="ml-3" v-if="mode === 'search1'">
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
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SearchBar',
  components: {
  },
  props: ['mode', 'displayClass'],
  data () {
    return {
      showCollectionsFilter: false,
      assetNames: [],
      query: {
        query: null,
        allCollections: 'one',
        onSale: false,
        onAuction: false,
        editions: false,
        createdBefore: null,
        createdAfter: null,
        sortField: 'nftIndex',
        sortDir: 'sortDown'
      }
    }
  },
  mounted () {
    const data = {
      // stxAddress: (NETWORK === 'local') ? 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG' : this.profile.stxAddress
      stxAddress: this.profile.stxAddress
    }
    this.$store.dispatch('rpayStacksContractStore/fetchAssetNames', data).then((assetNames) => {
      this.assetNames = assetNames
    })
  },
  methods: {
    reverseDir () {
      if (this.query.sortDir === 'sortUp') {
        this.query.sortDir = 'sortDown'
      } else {
        this.query.sortDir = 'sortUp'
      }
      this.toggleSearching()
    },
    showReverseDir () {
      if (this.mode === 'loopbomb') return true
      return this.mode === 'search' || this.mode === 'traditional' || this.mode === 'punks'
    },
    showEditions () {
      if (this.mode === 'loopbomb') return false
      return this.mode === 'search' || this.mode === 'traditional' || this.mode === 'punks'
    },
    showSelling () {
      if (this.mode === 'loopbomb') return true
      return this.mode === 'search' || this.mode === 'traditional' || this.mode === 'punks'
    },
    reverseEditions () {
      this.query.editions = !this.query.editions
      this.toggleSearching()
    },
    reverseOnSale (type) {
      if (type === 'ignore') {
        this.query.onSale = false
        this.query.sortField = 'nftIndex'
        this.query.sortDir = 'sortDown'
      } else {
        this.query.onSale = true
        this.query.sortField = 'saleData.buyNowOrStartingPrice'
        if (type === 'lowest') {
          this.query.sortDir = 'sortUp'
        } else {
          this.query.sortDir = 'sortDown'
        }
      }
      this.toggleSearching()
    },
    toggleSearching (asset) {
      if (this.mode.indexOf('wallet') > -1) {
        this.$emit('updateResults', { opcode: 'update-results', query: 'query=' + asset })
      } else {
        this.query.allCollections = 'one'
        if (this.mode === 'search') {
          this.query.allCollections = 'all'
        }
        if (this.query.query && this.query.query.length > 0) {
          this.query.sortField = 'updated'
        }
        this.$emit('updateResults', { opcode: 'update-results', query: this.query })
      }
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style>
.nav-item {
  list-style-type: none;
}
</style>
