<template>
  <div v-if="!loading">
    <Pagination @changePage="gotoPage" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
    <div id="my-table" class="row mx-auto" v-if="resultSet && resultSet.length > 0">
      <b-table striped hover :items="values()" :fields="fields()" class="bg-light text-dark">
        <template #cell(contractAddress)="data">
          <b-link class="text-info" size="sm" variant="warning" v-on:click="updateRequest(data)" v-html="data.value"></b-link>
        </template>
        <template #cell(Actions)="data">
          <span v-b-tooltip.hover="{ variant: 'warning' }" title="Manage royalties for this collection">
            <a @click.prevent="update(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="credit-card"/></a>
          </span>
        </template>
      </b-table>
      <div class="text-white col-lg-4 col-md-6 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
      </div>
    </div>
    <div class="d-flex justify-content-start my-3 mx-4" v-else>
      <div class="mt-5">
        <p>Minting not yet begun for this collection...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Pagination from './Pagination'

export default {
  name: 'PageableTokens',
  components: {
    Pagination
  },
  props: ['loopRun'],
  data () {
    return {
      resultSet: [],
      loading: true,
      doPaging: true,
      pageSize: 10,
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
    update () {
      this.gotoPage(0)
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
      this.$store.dispatch('rpayStacksContractStore/fetchTokensByContractIdAndRunKey', data).then((results) => {
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
          key: 'nftIndex',
          sortable: true
        },
        {
          key: 'Image Index',
          sortable: true
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
      mapped = this.resultSet.map(function (token) {
        counter++
        return {
          Index: counter + ($self.page * $self.pageSize),
          nftIndex: token.contractAsset.nftIndex,
          'Image Index': token.name,
          assetHash: token.contractAsset.tokenInfo.assetHash,
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
