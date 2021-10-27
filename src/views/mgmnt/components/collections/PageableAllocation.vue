<template>
  <div v-if="!loading">
    <Pagination @changePage="gotoPage" :numberOfItems="numberOfItems" :pageSize="pageSize" v-if="numberOfItems > 0"/>
    <div id="my-table" class="row mx-auto" v-if="resultSet && resultSet.length > 0">
      <b-table striped hover :items="values()" :fields="fields()" class="bg-light text-dark">
        <template #cell(Actions)="data">
          <span v-b-tooltip.hover="{ variant: 'warning' }" title="Manage royalties for this collection">
            <a :href="transactionUrl(data)" target="_blank" class="pointer text-info mr-2"><b-icon icon="arrow-up-right-circle"/></a>
            <span @click="deleteOne(data)" class="pointer text-info mr-2"><b-icon icon="x-circle"/></span>
          </span>
        </template>
      </b-table>
      <div class="text-white col-lg-4 col-md-6 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
      </div>
    </div>
    <div class="d-flex justify-content-start my-3 mx-4" v-else>
      <div class="mt-5">
        <p>No allocations.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Pagination from './Pagination'

export default {
  name: 'PageableAllocation',
  components: {
    Pagination
  },
  props: ['loopRun', 'pageSize'],
  data () {
    return {
      resultSet: [],
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      page: 0,
      componentKey: 0
    }
  },
  mounted () {
    this.numberOfItems = this.loopRun.tokenCount
    this.fetchPage(0)
    this.loading = false
  },
  methods: {
    deleteOne: function (data) {
      const allocation = this.resultSet[data.index]
      const bean = {
        id: allocation.id,
        punkIndexes: [allocation.punkIndex],
        currentRunKey: allocation.currentRunKey,
        stxAddress: null
      }
      this.$store.dispatch('rpayCategoryStore/deleteAllocation', bean).then((result) => {
        this.resultSet[data.index] = result
      })
    },
    transactionUrl: function (data) {
      const allocation = this.resultSet[data.index]
      let txId = allocation.txId
      if (!txId) return '#'
      if (!txId.startsWith('0x')) txId = '0x' + txId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    gotoPage (page) {
      // this.page = page - 1
      this.page = page - 1
      this.fetchPage(page - 1)
    },
    fetchPage (page) {
      const data = {
        contractId: this.loopRun.contractId,
        runKey: this.loopRun.currentRunKey,
        page: page,
        pageSize: this.pageSize,
        asc: true
      }
      this.resultSet = null
      this.$store.dispatch('rpayCategoryStore/fetchAllocationsByRunKey', data).then((results) => {
        this.resultSet = results // this.resultSet.concat(results)
        this.componentKey++
        this.loading = false
      })
    },
    fields () {
      // return ['Name', 'nftIndex', 'assetHash', 'Actions']
      return [
        {
          key: 'Index',
          sortable: true
        },
        {
          key: 'Image Index',
          sortable: true
        },
        {
          key: 'status'
        },
        {
          key: 'stxAddress'
        },
        {
          key: 'assetHash'
        },
        {
          key: 'Actions'
        }
      ]
    },
    values () {
      let mapped = []
      let counter = -1
      const $self = this
      mapped = this.resultSet.map(function (allocation) {
        counter++
        return {
          Index: counter + ($self.page * $self.pageSize),
          'Image Index': allocation.punkIndex,
          status: allocation.status,
          stxAddress: allocation.stxAddress,
          assetHash: allocation.assetHash,
          Actions: null
        }
      })
      return mapped
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    mintCounter () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application.tokenContract.mintCounter
    }
  }
}
</script>
<style>
.myItemsIntroText {font-weight: 200; font-size: 1.1rem; color: #fff;}
</style>
