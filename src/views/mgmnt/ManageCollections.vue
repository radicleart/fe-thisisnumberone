<template>
<b-container class="text-white" v-if="loopRuns">
  <h1 class="text-white">NFT Collections</h1>
  <div class="text-right">
    <span class="pointer text-warning pr-3 mr-3 border-right" @click="updateTable">show disabled</span>
    <b-link class="text-warning" to="/mgmnt/manage-collection">new collection</b-link>
  </div>
  <div>
    <b-table :key="componentKey" striped hover :items="values()" :fields="fields()" class="bg-light text-dark">
      <template #cell(contractAddress)="data">
        <b-link class="text-info" size="sm" variant="warning" v-on:click="updateRequest(data)" v-html="data.value"></b-link>
      </template>
      <template #cell(Actions)="data">
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Manage royalties for this collection">
          <a @click.prevent="updateRoyalties(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="credit-card"/></a>
        </span>
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Manage guest list">
          <a @click.prevent="updateGuestList(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="star"/></a>
        </span>
        <span v-b-tooltip.hover="{ variant: 'warning' }" title="Manage allocation">
          <a @click.prevent="openAllocations(data)" class="text-info mr-2" href="#" target="_blank"><b-icon icon="circle"/></a>
        </span>
      </template>
    </b-table>
  </div>
  <b-modal size="lg" id="guest-list-modal">
    <GuestList @update="update" :loopRun="loopRun"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
  <b-modal size="lg" id="guest-list-modal">
    <Allocations @update="update" :loopRun="loopRun"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</b-container>
<b-container v-else>
  <LoopbombSpinner />
</b-container>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import GuestList from '@/views/mgmnt/components/collections/GuestList'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ManageCollections',
  components: {
    LoopbombSpinner,
    GuestList
  },
  data () {
    return {
      loaded: false,
      componentKey: 0,
      showDisabled: false,
      contractId: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME,
      currenRunKey: null,
      loopRun: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayCategoryStore/fetchLoopRuns')
  },
  methods: {
    update (data) {
      if (data.opcode === 'cancel') {
        this.$bvModal.hide('guest-list-modal')
      }
    },
    openAllocations (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.$router.push('/mgmnt/manage-allocation/' + this.loopRuns[index].currentRunKey)
      }
    },
    updateRoyalties (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.$router.push('/mgmnt/manage-royalties/' + this.loopRuns[index].currentRunKey)
      }
    },
    updateGuestList (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.loopRun = this.loopRuns[index]
        this.$bvModal.show('guest-list-modal')
      }
    },
    updateRequest (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.$router.push('/mgmnt/manage-collections/' + this.loopRuns[index].currentRunKey)
      }
    },
    updateTable () {
      this.showDisabled = !this.showDisabled
      this.componentKey++
    },
    fields () {
      return ['contractAddress', 'contractName', 'currentRunKey', 'currentRun', 'versionLimit', 'Mints Per Day', 'Status', 'Actions']
    },
    values () {
      let mapped = []
      const $self = this
      let collections = this.loopRuns
      if (!this.showDisabled) collections = this.loopRuns.filter((o) => o.status !== 'disabled')
      mapped = collections.map(function (loopRun) {
        if (!loopRun.contractId) loopRun.contractId = $self.contractId
        const cId = loopRun.contractId.split('.')[0]
        return {
          Status: loopRun.status,
          contractAddress: cId.substring(cId.length - 10),
          contractName: loopRun.contractId.split('.')[1],
          currentRunKey: loopRun.currentRunKey,
          currentRun: loopRun.currentRun,
          'Mints Per Day': loopRun.spinsPerDay,
          versionLimit: loopRun.versionLimit,
          Actions: null
        }
      })
      return mapped
    }
  },
  computed: {
    loopRuns () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_ADMIN_LOOP_RUNS]
      return loopRuns
    }
  }
}
</script>
<style lang="scss">
#guest-list-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}
#guest-list-modal .modal-content {
  border: none !important;
  background-color: transparent !important;
}

</style>
