<template>
<div>
  <div class="text-small" v-if="item.contractAsset">
    <b-alert v-if="!publicAssetDetails" show variant="dark">
      <b-row class="mt-3 text-small">
        <b-col cols="12">
          <span class="mr-2">Minted</span><span class="text-bold">NFT #{{item.contractAsset.nftIndex}} : Edition {{item.contractAsset.tokenInfo.edition}} of {{item.contractAsset.tokenInfo.maxEditions}}</span>
        </b-col>
        <b-col cols="12" class="mt-3">
          <span class="mr-2" v-b-tooltip.hover="{ variant: 'warning' }"  :title="ttStacksAddress">Owner</span>
          <span @click="showRoyalties = !showRoyalties" class="text-bold">{{item.contractAsset.owner}}</span>
        </b-col>
        <b-col cols="12" class="text-right" v-if="item.mintInfo">
          <a class="text-info" :href="transactionUrl(item.mintInfo.txId)" target="_blank">Show in Explorer</a>
        </b-col>
      </b-row>
    </b-alert>
    <b-alert v-else class="text-small" show variant="white">
      <b-row class="text-small">
        <b-col cols="12">
          <span class="text-small text-bold">NFT #{{item.contractAsset.nftIndex}} : Edition {{item.contractAsset.tokenInfo.edition}} of {{item.contractAsset.tokenInfo.maxEditions}}</span>
        </b-col>
        <b-col cols="12">
          <span @click="showRoyalties = !showRoyalties">{{item.contractAsset.owner}} <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }"  :title="ttStacksAddress"><b-icon class="ml-2" icon="question-circle"/></b-link></span>
        </b-col>
        <b-col cols="12" class="text-right" v-if="item.mintInfo && item.mintInfo.txId">
          <a class="text-info" :href="transactionUrl(item.mintInfo.txId)" target="_blank">Show in Explorer</a>
        </b-col>
      </b-row>
      <b-row v-if="showRoyalties">
        <b-col cols="12">
          <h4 class="text-warning">Royalties</h4>
          <p class="text-small">First payment is split as follows - thereafter 90% goes to the seller and these addresses get 1/10 th of the original percentage</p>
          <ListBeneficiaries :item="item" />
        </b-col>
      </b-row>
    </b-alert>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ListBeneficiaries from '@/components/toolkit/ListBeneficiaries'

export default {
  name: 'MintInfo',
  components: {
    ListBeneficiaries
  },
  props: ['item'],
  data () {
    return {
      showRoyalties: false
    }
  },
  methods: {
    variant () {
      let v = (this.iAmOwner) ? 'warning' : 'danger'
      if (this.$route.name === 'asset-by-hash' || this.$route.name === 'asset-by-index') {
        v = (this.iAmOwner) ? 'danger' : 'warning'
      }
      return v
    },
    transactionUrl: function (txId) {
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    }
  },
  computed: {
    txPending () {
      let transactions = []
      if (this.item.contractAsset) {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_TX_ID](this.item.contractAsset.nftIndex)
      } else {
        transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_PENDING_BY_ASSET_HASH](this.item.assetHash)
      }
      return transactions
    },
    minted: function () {
      return !this.item.contractAsset && this.item.mintInfo && this.item.mintInfo.txId && this.item.mintInfo.txStatus === 'success'
    },
    ttStacksAddress () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-stacks-address')
      return (tooltip) ? tooltip[0].text : ''
    },
    publicAssetDetails () {
      return (this.$route.name === 'asset-by-hash' || this.$route.name === 'asset-by-index')
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    iAmOwner () {
      return this.item.contractAsset && this.item.contractAsset.owner === this.profile.stxAddress
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
