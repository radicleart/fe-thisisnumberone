<template>
<div>
  <h1>Deploy Contract</h1>
  <div class="row">
    <div class="col-12">
      <DeployContractFromFile />
    </div>
  </div>
</div>
</template>

<script>
import DeployContractFromFile from './contracts/DeployContractFromFile.vue'

export default {
  name: 'DeployContract',
  components: {
    DeployContractFromFile
  },
  data () {
    return {
    }
  },
  methods: {
    deployV2 () {
      this.contractId = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.thisisnumberone-v2'
      this.$store.dispatch('rpayProjectStore/fetchProjectByContractId', this.contractId).then((project) => {
        this.project = Object.assign(this.project, project)
        this.loaded = true
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
