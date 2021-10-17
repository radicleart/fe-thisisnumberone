<template>
<b-container class="text-white" v-if="loopRuns">
  <h1 class="text-white">NFT Collections</h1>
  <div class="text-right">
    <b-link class="text-info" to="/mgmnt/manage-collection">new collection</b-link>
  </div>
  <div>
    <b-table striped hover :items="values()" :fields="fields()" class="bg-light text-dark">
      <template #cell(contractAddress)="data">
        <b-link class="text-info" size="sm" variant="warning" v-on:click="updateRequest(data)" v-html="data.value"></b-link>
      </template>
      <template #cell(contractName)="data">
        <b-link class="text-info" size="sm" variant="warning" v-on:click="updateRoyalties(data)" v-html="data.value"></b-link>
      </template>
    </b-table>
  </div>
</b-container>
<b-container v-else>
  <LoopbombSpinner />
</b-container>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ManageCollections',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      loaded: false,
      contractId: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME,
      currenRunKey: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayCategoryStore/fetchLoopRuns')
  },
  methods: {
    updateRoyalties (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.$router.push('/mgmnt/manage-royalties/' + this.loopRuns[index].currentRunKey)
      }
    },
    updateRequest (data) {
      const index = this.loopRuns.findIndex((o) => o.currentRunKey === data.item.currentRunKey)
      if (index > -1) {
        this.$router.push('/mgmnt/manage-collections/' + this.loopRuns[index].currentRunKey)
      }
    },
    fields () {
      return ['contractAddress', 'contractName', 'currentRunKey', 'currentRun', 'versionLimit', 'Mints Per Day', 'Status']
    },
    values () {
      let mapped = []
      const $self = this
      mapped = this.loopRuns.map(function (loopRun) {
        if (!loopRun.contractId) loopRun.contractId = $self.contractId
        const cId = loopRun.contractId.split('.')[0]
        return {
          Status: loopRun.status,
          contractAddress: cId.substring(cId.length - 10),
          contractName: loopRun.contractId.split('.')[1],
          currentRunKey: loopRun.currentRunKey,
          currentRun: loopRun.currentRun,
          'Mints Per Day': loopRun.spinsPerDay,
          versionLimit: loopRun.versionLimit
        }
      })
      return mapped
    }
  },
  computed: {
    loopRuns () {
      const loopRuns = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUNS]
      return loopRuns
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
