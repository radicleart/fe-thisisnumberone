<template>
<div v-if="!publicAssetDetails">
  <b-alert show :variant="variant()">
    <b-row>
      <b-col cols="12" class="text-small">
        <span>Minted</span><br/><span class="text-bold">NFT #{{item.contractAsset.nftIndex}} : Edition {{item.contractAsset.tokenInfo.edition}} of {{item.contractAsset.tokenInfo.maxEditions}}</span>
      </b-col>
      <b-col cols="12" class="text-small">
        <span>Owner <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }"  :title="ttStacksAddress"><b-icon class="ml-2" icon="question-circle"/></b-link>
        </span>
        <br/><span class="">{{item.contractAsset.owner}}</span>
      </b-col>
    </b-row>
  </b-alert>
</div>
<div v-else>
  <b-alert show :variant="variant()">
    <b-row>
      <b-col cols="12">
        <span class="text-small text-bold">NFT #{{item.contractAsset.nftIndex}} : Edition {{item.contractAsset.tokenInfo.edition}} of {{item.contractAsset.tokenInfo.maxEditions}}</span>
      </b-col>
      <b-col cols="12">
        <span class="text-small">{{item.contractAsset.owner}} <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }"  :title="ttStacksAddress"><b-icon class="ml-2" icon="question-circle"/></b-link></span>
      </b-col>
    </b-row>
  </b-alert>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MintInfo',
  components: {
  },
  props: ['item'],
  data () {
    return {
    }
  },
  methods: {
    variant () {
      let v = (this.iAmOwner) ? 'warning' : 'danger'
      if (this.$route.name === 'asset-by-hash' || this.$route.name === 'asset-by-index') {
        v = (this.iAmOwner) ? 'light' : 'dark'
      }
      return v
    }
  },
  computed: {
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
