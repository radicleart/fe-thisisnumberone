<template>
<div v-if="pending">
  <b-alert class="text-small text-white" style="background: #529e72;" show>
    {{txMessage()}}
  </b-alert>
  <b-alert class="text-small" variant="light" show>
    <h6 class="mb-3">Pending Transactions</h6>
    <div class="d-flex justify-content-between">
      <div class="w-75"><span @click="checkTx(pending.txId)" class="ml-3"><img :src="mintme"/></span></div>
      <div>
        <a :href="transactionUrl(pending.txId)" target="_blank"><span style="text-transform: capitalise;" class="ml-3">Show on Blockchain</span></a>
      </div>
    </div>
    <div v-if="!pending">Status: {{pending.txStatus}}</div>
  </b-alert>
  <div style="color: #529e72;">
    Be patient, depending on blockchain traffic this could take a while.
    You can leave this page open to check progress.
    When the transactions confirmed it will update in your library.
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PendingTransactionInfo',
  components: {
  },
  props: ['pending'],
  data () {
    return {
      mintme: require('@/assets/img/marketplace/minting-animation.gif')
    }
  },
  methods: {
    txMessage: function () {
      if (!this.pending || this.pending.functionName === 'mint-token') {
        return 'Minting in Progress'
      } else if (this.pending.functionName === 'buy-now') {
        return 'Buy Now in Progress'
      } else if (this.pending.functionName === 'place-bid' || this.pending.functionName === 'opening-bid') {
        return 'Buy Now in Progress'
      } else if (this.pending.functionName === 'set-sale-data') {
        return 'Setting Sale Data in Progress'
      } else {
        return 'Transaction in Progress'
      }
    },
    checkTx: function (txId) {
      this.$store.dispatch('rpayTransactionStore/fetchTransactionFromChainByTxId', txId).then((result) => {
        this.$notify({ type: 'warning', title: 'Check Status', text: 'Transaction status is ' + result.txStatus })
      })
    },
    getFunctionName: function (functionName) {
      return functionName.replaceAll('-', ' ')
    },
    transactionUrl: function (txId) {
      if (!txId.startsWith('0x')) txId = '0x' + txId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
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
<style lang="scss" scoped>
</style>
