<template>
<div v-if="loaded" :key="componentKey">
  <div class="text-right text-small"><b-button size="xs" variant="warning" @click="openAddFilter">Add Filter</b-button></div>
  <b-table striped hover :items="values()" :fields="fields()" class="mt-3 bg-light text-dark">
    <template #cell(status)="data">
      <b-button class="btn-action" size="sm" variant="warning" v-on:click="deleteFilter(data)" v-html="data.value"></b-button>
    </template>
  </b-table>
  <b-modal size="lg" id="filter-modal">
    <b-container>
      <div class="mb-3" role="group">
        <label for="stxAddress">STX Address:</label>
        <b-form-input
          id="stxAddress"
          v-model="filter.stxAddress"
          aria-describedby="stxAddress-help stxAddress-feedback"
          placeholder="Enter users stx address"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="stxAddress-feedback">
          Valid STX Address
        </b-form-invalid-feedback>
      </div>
      <div class="mb-3" role="group">
        <label for="assetHash">Asset Hash:</label>
        <b-form-input
          id="assetHash"
          v-model="filter.assetHash"
          aria-describedby="assetHash-help stxAddress-feedback"
          placeholder="Enter asset hash"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="assetHash-feedback">
          Valid asset hash
        </b-form-invalid-feedback>
      </div>
      <div class="my-4 text-right"><b-button class="" variant="warning" @click.prevent="saveFilter()">Save</b-button></div>
    </b-container>
    <template #modal-header="{ close }">
      <div class="text-black text-warning w-100 d-flex justify-content-end">
        <b-button size="sm" @click="close()"  class="m-0 p-1 text-dark" style="background: #fff; border:none; max-width: 30px !important; max-height: 30px !important;">
          <img class="filter-black" :src="cross" alt="close" style="max-width: 20px !important; max-height: 20px !important;"/>
        </b-button>
      </div>
    </template>
    <template #modal-footer class="text-center"><div class="w-100"><p class="footer-text"></p></div></template>
  </b-modal>
</div>
<div v-else>
  <LoopbombSpinner />
</div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'

export default {
  name: 'TokenFilterList',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      filter: {
        contractId: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME,
        assetHash: null,
        stxAddress: null
      },
      componentKey: 0,
      loaded: false,
      tokenFilters: []
    }
  },
  watch: {
  },
  mounted () {
    this.$store.dispatch('assetGeneralStore/tokenFilters').then((tokenFilters) => {
      this.tokenFilters = tokenFilters || []
      this.loaded = true
    })
  },
  methods: {
    fields () {
      return ['Id', 'STX Address', 'Asset Hash', 'Status']
    },
    values () {
      let mapped = []
      if (!this.tokenFilters) {
        return mapped
      }
      const $self = this
      mapped = this.tokenFilters.map(function (tf) {
        return {
          Id: tf.id,
          'Contract Id': $self.getShortCId(tf.contractId),
          'STX Address': tf.stxAddress,
          'Asset Hash': tf.assetHash,
          Status: 'delete'
        }
      })
      return mapped
    },
    getShortCId (cid) {
      return cid.substring(0, 5)
    },
    openAddFilter () {
      this.$bvModal.show('filter-modal')
    },
    deleteFilter (data) {
      this.$store.dispatch('assetGeneralStore/deleteTokenFilter', data.item.Id).then(() => {
        const index = this.tokenFilters.findIndex((o) => o.id === data.item.Id)
        if (index > -1) {
          this.tokenFilters.splice(index, 1)
        }
      })
    },
    saveFilter () {
      this.$store.dispatch('assetGeneralStore/updateTokenFilter', this.filter).then((result) => {
        this.updateLocal(result)
      })
    },
    updateFilter: function (data) {
      const index = this.tokenFilters.findIndex((o) => o.assetHash === data.item['Asset Hash'])
      if (index > -1) {
        data = this.tokenFilters[index]
      } else {
        return
      }
      this.$store.dispatch('assetGeneralStore/updateTokenFilter', data).then((result) => {
        this.updateLocal(result)
      })
    },
    updateLocal (result) {
      const index = this.tokenFilters.findIndex((o) => o.assetHash === result.assetHash)
      if (index > -1) {
        this.tokenFilters[index] = result.data
        this.componentKey++
      }
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
