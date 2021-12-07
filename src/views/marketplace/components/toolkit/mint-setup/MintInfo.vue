<template>
<div>
  <div class="text-white" v-if="item && item.contractAsset">
    <b-alert class="text-small" show :variant="variant()">
      <b-row class="text-small">
        <b-col cols="12">
          <span class="text-small text-bold">NFT #{{item.contractAsset.nftIndex}}
            <!-- : Edition {{item.contractAsset.tokenInfo.edition}} of {{item.contractAsset.tokenInfo.maxEditions}} -->
          </span>
        </b-col>
        <b-col cols="12">
          <span class="pointer" @click="showRoyalties = !showRoyalties">{{item.contractAsset.owner}} <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }"  :title="'The owning stacks address of this loopbomb'"><b-icon class="ml-2" font-scale="1.3" icon="question-circle"/></b-link></span>
        </b-col>
      </b-row>
      <b-row v-if="showRoyalties">
        <b-col cols="12" class="mt-3">
          <h6 style="font-weight: 700;">Royalty Payments</h6>
          <ListBeneficiaries v-if="loopRun" :loopRun="loopRun" :item="item" />
        </b-col>
        <!--
        <b-col cols="12">
          <p class="text-bold text-xsmall mt-3"><span>Collection </span><span class="text-info" v-b-tooltip.hover="{ variant: 'warning' }"  :title="'Collection key: ' + loopRun.currentRunKey">{{loopRun.currentRun + ' / ' + loopRun.makerName}}</span></p>
          <p class="text-bold text-xsmall mt-3"><span>Contract </span><span class="text-info">{{loopRun.contractId}}</span></p>
        </b-col>
        -->
      </b-row>
    </b-alert>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ListBeneficiaries from '@/views/marketplace/components/toolkit/ListBeneficiaries'

export default {
  name: 'MintInfo',
  components: {
    ListBeneficiaries
  },
  props: ['item', 'loopRun'],
  data () {
    return {
      showRoyalties: false
    }
  },
  methods: {
    variant () {
      let v = (this.iAmOwner) ? 'dark' : 'light'
      if (this.$route.name === 'asset-by-hash' || this.$route.name === 'asset-by-index') {
        v = (this.iAmOwner) ? 'light' : 'dark'
      }
      return v
    }
  },
  computed: {
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
