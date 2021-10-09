<template>
<b-container class="text-white">
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
</b-container>
</template>

<script>

export default {
  name: 'ManageAllocation',
  components: {
  },
  props: ['loopRun'],
  data () {
    return {
      punkIndexes: null,
      stxAddress: null,
      result: null
    }
  },
  methods: {
    clearAllocations () {
      const bean = {
        pnkIndexes: this.punkIndexes.split(','),
        currentRunKey: this.loopRun.currentRunKey,
        stxAddress: this.stxAddress
      }
      this.$store.dispatch('rpayCategoryStore/clearMintAllocations', bean).then((result) => {
        this.result = result
      })
    }
  },
  computed: {
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
