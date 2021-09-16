<template>
<div>
  <div class="text-dark" v-if="contractAsset && txPending.length > 0">
    <h6 class="mb-3">Pending Transactions</h6>
    <div v-for="(tx, index) in txPending" :key="index" class="d-flex justify-content-between">
      <div>
        <div class="d-flex justify-content-between" v-if="tx.txStatus === 'pending'">
          <div><b-icon icon="circle" animation="throb" font-scale="2"/> <span @click="checkTx(tx.txId)" class="ml-3 text-warning">{{tx.functionName}}</span></div>
          <div><a href="#" @click.prevent="checkTx(tx.txId)" class="ml-3 text-warning">check status</a></div>
        </div>
        <div v-else>Status: {{tx.txStatus}}</div>
      </div>
      <div>
       <a class="text-dark" :href="transactionUrl(tx.txId)" target="_blank">show in explorer</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import {cvToValue,uintCV,bufferCV} from '@stacks/transactions'

export default {
  name: 'PendingTransactionInfo',
  components: {
  },
  props: ['contractAsset', 'assetHash'],
  data () {
    return {
      txs: []
    }
  },
  mounted () {
    if (this.contractAsset) {
      this.$store.dispatch('rpayTransactionStore/fetchTransactionsByContractIdAndNftIndex', this.contractAsset.nftIndex).then((result) => {
        this.txs = result
      })
    } else {
      this.$store.dispatch('rpayTransactionStore/fetchTransactionsByContractIdAndAssetHash', this.assetHash).then((result) => {
        this.txs = result
      })
    }
  },
  methods: {
    checkTx: function (txId) {
      this.$store.dispatch('rpayTransactionStore/fetchTransactionFromChainByTxId', txId).then((tx) => {
        this.tx = tx
      })
    },
    transactionUrl: function (txId) {
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    }
  },
  computed: {
    txPending () {
      let transactions = []
      if (this.contractAsset) {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_TX_ID](this.contractAsset.nftIndex)
      } else {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_ASSET_HASH](this.assetHash)
      }
      return transactions
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
