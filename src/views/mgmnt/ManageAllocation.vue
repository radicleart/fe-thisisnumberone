<template>
<b-container class="text-white" v-if="loopRun">
  <div class="d-flex justify-content-start my-3 mx-4">
    <div class="mt-5">
      <h1>Allocation vs Minted NFT</h1>
      <b-row><b-col cols="4">Collection</b-col><b-col>{{loopRun.currentRun}}</b-col></b-row>
      <b-row><b-col cols="4">Maker</b-col><b-col>{{loopRun.makerName}}</b-col></b-row>
      <b-row><b-col cols="4"></b-col><b-col>{{loopRun.tokenCount}} / {{loopRun.versionLimit}} minted</b-col></b-row>
      <b-row>
        <b-col cols="4"></b-col>
        <b-col>
          <span class="text-warning" v-if="tokenMode">Showing Tokens</span>
          <span class="text-warning" v-else>Showing Allocations</span>
          <span class="pointer ml-3" @click="tokenMode = !tokenMode">toggle</span>
        </b-col>
      </b-row>
    </div>
  </div>
  <b-row class="mb-4" v-if="tokenMode">
    <PageableTokens :loopRun="loopRun" :pageSize="pageSize"/>
  </b-row>
  <b-row class="mb-4" v-else>
    <PageableAllocation :loopRun="loopRun" :pageSize="pageSize"/>
  </b-row>
  <div v-if="showForm">
  <h1 class="text-white">NFT Allocations</h1>
  <div class="mb-3" role="group">
    <label for="punkIndexes">Clear allocations for {{loopRun.currentRunKey}}..</label>
    <b-form-input
      maxlength="30"
      id="punkIndexes"
      v-model="punkIndexes"
      aria-describedby="punkIndexes-help punkIndexes-feedback"
      placeholder="Punk indexes - comma separated string"
      trim
      required
    ></b-form-input>
  </div>
  <div class="mb-3" role="group">
    <label for="stxAddress">Clear by stxAddress..</label>
    <b-form-input
      maxlength="30"
      id="stxAddress"
      v-model="stxAddress"
      aria-describedby="stxAddress-help punkIndexes-feedback"
      placeholder="stxAddress"
      trim
      required
    ></b-form-input>
  </div>
  <div class="my-4 text-right">
    <b-button variant="outline-warning" @click.prevent="clearAllocations()">Clear By Punk Index</b-button>
  </div>
  </div>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PageableAllocation from '@/views/mgmnt/components/collections/PageableAllocation'
import PageableTokens from '@/views/mgmnt/components/collections/PageableTokens'

export default {
  name: 'ManageAllocation',
  components: {
    PageableAllocation,
    PageableTokens
  },
  data () {
    return {
      pageSize: 1000,
      tokenMode: true,
      currentRunKey: null,
      punkIndexes: null,
      showForm: false,
      stxAddress: null,
      result: null
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.currentRunKey
  },
  methods: {
    clearAllocations () {
      const bean = {
        punkIndexes: this.punkIndexes.split(','),
        currentRunKey: this.loopRun.currentRunKey,
        stxAddress: this.stxAddress
      }
      this.$store.dispatch('rpayCategoryStore/clearMintAllocations', bean).then((result) => {
        this.result = result
      })
    }
  },
  computed: {
    loopRun () {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.currentRunKey)
      return loopRun
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  width: inherit;
}
</style>
