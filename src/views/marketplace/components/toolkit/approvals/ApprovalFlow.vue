<template>
<div>
  <h1 class="pointer mb-4 border-bottom"><b-icon font-scale="0.6" icon="chevron-right"/> Approved Operators</h1>
  <div class="col-12 mb-4">
    <b-input-group append="ADDR">
      <b-form-input v-model="operator" placeholder="STX Address of the operator / marketplace"></b-form-input>
    </b-input-group>
  </div>
  <div class="text-right">
    <b-form-checkbox v-model="approval" name="check-button" switch class="text-secondary">
      <span v-if="approval"><b>Approve</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Approve this address to list / transfer your NFT on your behalf'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></span>
      <span v-else><b>Remove Approval</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Remove approval from this address to list / transfer your NFT on your behalf'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></span>
    </b-form-checkbox>
  </div>
  <div class="col-12 text-right mb-5">
    <b-button variant="outline-warning" @click="setApproval()">Set Approval</b-button>
  </div>
</div>
</template>

<script>

export default {
  name: 'ApprovalFlow',
  components: {
  },
  props: ['item', 'loopRun'],
  data () {
    return {
      loading: true,
      approval: true,
      operator: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    setApproval: function () {
      this.errorMessage = 'Approving an operator for your stx address.'
      const data = {
        sendAsSky: true,
        operator: this.operator,
        approval: this.approval,
        nftIndex: this.item.contractAsset.nftIndex,
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: this.loopRun.contractId.split('.')[1],
        functionName: 'set-approved'
      }
      this.$store.dispatch('rpayPurchaseStore/setApproval', data).then((result) => {
        this.$emit('setApprovalEvent', result)
      }).catch(() => {
        this.$emit('setApprovalEvent', { opcode: 'set-approval-failed' })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.input-group-text {
  background: #fff;
  color: #000;
}
</style>
