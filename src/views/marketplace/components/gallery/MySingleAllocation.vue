<template>
<div class="" v-if="allocation">
  <b-card bg-variant="white" class="mt-0 text-small py-2 text-dark">
    <div class="px-2">
      <div class="text-left">
        <div class="text-xsmall d-flex justify-content-between">
          <h6>Minting Punk {{allocation.punkIndex}}</h6>
          <div class="text-right">(status: {{allocation.txStatus}})</div>
        </div>
        <div class="text-xsmall d-flex justify-content-between">
          <div class="text-right">{{loopRun.currentRun}}</div>
          <div class="text-right">{{created()}}</div>
        </div>
      </div>
    </div>
    <b-card-text class="">
      <div class="d-flex justify-content-center p-2">
          <div v-if="allocation.txStatus === 'pending'" class="center">
            <!-- <div v-if="loopRun.mintImage2">
              <img width="100px" height="100px" :src="loopRun.mintImage" icon="circle" animation="throb" font-scale="5"/>
            </div> -->
            <div>
              <b-icon v-if="allocation.txStatus === 'pending'" icon="circle" animation="throb" font-scale="5"></b-icon>
            </div>
          </div>
          <div v-else-if="allocation.txStatus === 'success'" class="center">
              <img width="100px" height="100px" :src="loopRun.mintImage3" icon="circle" animation="throb" font-scale="5"/>
          </div>
          <div v-else style="height: 100px; width: 100px;" class="center">
            <b-icon class="text-danger" icon="x-circle" font-scale="5"></b-icon>
          </div>
      </div>
    </b-card-text>
    <b-card-text>
      <div class="text-xsmall text-center mb-3">
        <span v-b-tooltip.hover="{ variant: 'warning' }" :title="'View on explorer'"><a class="text-dark" @click="checkTx(true)" :href="transactionUrl()" target="_blank">{{allocation.from}}</a></span>
      </div>
    </b-card-text>
  </b-card>
</div>
</template>

<script>
import { DateTime } from 'luxon'
import { APP_CONSTANTS } from '@/app-constants'
// import imageDataURI from 'image-data-uri'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleAllocation',
  components: {
  },
  props: ['allocation', 'loopRun', 'myTxFilter'],
  data () {
    return {
      image: null,
      newHeight: null,
      myChainChecker: null
    }
  },
  mounted () {
    this.mdContractId = this.loopRun.contractId
    this.image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.allocation)
    const $self = this
    const $ele = this.$refs.itemImage
    this.$nextTick(() => {
      if (!$ele) {
        return
      }
      $self.newHeight = $ele.clientWidth * 1 // 1024 / 716
      $ele.style.height = (Math.floor($self.newHeight)).toString() + 'px'
    })
    this.checkTx()
    this.myChainChecker = setInterval(function () {
      $self.checkTx()
    }, 30000)
  },
  methods: {
    checkTx: function (userLed) {
      if (this.allocation.txStatus !== 'pending') {
        clearInterval(this.myChainChecker)
        return
      }
      const txId = this.allocation.txId
      this.$store.dispatch('rpayTransactionStore/fetchTransactionFromChainByTxId', txId).then((result) => {
        if (userLed) this.$notify({ type: 'warning', title: 'Check Status', text: 'Transaction status is ' + result.txStatus })
        if (result.txStatus !== 'pending') {
          this.allocation.txStatus = result.txStatus
          this.$store.dispatch('rpayCategoryStore/updateMintAllocations', [this.allocation])
        }
      })
    },
    handler: function (e) {
      e.preventDefault()
    },
    imageError () {
      this.image = this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.allocation)
    },
    created () {
      if (this.allocation.timestamp) {
        return DateTime.fromMillis(this.allocation.timestamp).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      }
      return '?'
    },
    transactionUrl: function () {
      if (!this.allocation.txId) {
        return '#'
      }
      let txId = this.allocation.txId
      if (!txId.startsWith('0x')) txId = '0x' + txId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    marketplace () {
      return this.$route.name === 'nft-marketplace'
    },
    nftPage () {
      return this.$route.name.startsWith('asset-by-')
    }
  }
}
</script>
<style scoped>
.card {
  background-color: #212529;
  padding: 0;
  margin: 15px 5px;
  border: none;
}
.card-text img {
  border-radius: 0px;
  min-width: 10rem;
  max-width: 40rem;
}
.card-header {
    padding: 1rem 1.5rem 0 1.5rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    font-size: 2.50rem;
}
.card-body {
    padding: 0 0.5rem;
}
.card-text-body {
    padding: 0 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    border-bottom: 0px solid rgba(0, 0, 0, 0.125);
}
</style>
