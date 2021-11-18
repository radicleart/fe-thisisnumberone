<template>
<div class="text-small pb-0 mb-0">
  <span v-if="this.item.contractAsset">
    <span class="ml-2"><a :href="item.contractAsset.tokenInfo.metaDataUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Meta Data URL: ' + item.contractAsset.tokenInfo.metaDataUrl" target="_blank">meta data</a></span>
    <span class="ml-2 border-bottom" v-if="item.mintInfo"><a :href="transactionUrl" v-b-tooltip.hover="{ variant: 'light' }" :title="'Show on explorer'" target="_blank">explorer</a></span>
  </span>
  <span v-else>
    <span class="ml-2" v-if="showEditLink"><b-link :to="'/edit-item/' + item.assetHash"><span class="mb-0">edit</span></b-link></span>
    <span class="ml-2" v-if="showDeleteLink"><a href="#" @click.prevent="deleteItem" class="text-danger"><span class="mb-0">delete</span></a></span>
  </span>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemActionMenu',
  components: {
  },
  props: ['item', 'variant'],
  data () {
    return {
      showPreviewLink: false,
      showDeleteLink: false,
      showEditLink: false
    }
  },
  mounted () {
    this.showPreviewLink = this.$route.name !== 'item-preview'
    this.showDeleteLink = !this.item.contractAsset
    this.showEditLink = !this.item.contractAsset
  },
  methods: {
    deleteItem () {
      this.$store.dispatch('rpayMyItemStore/deleteItem', this.item)
    }
  },
  computed: {
    itemPreviewUrl () {
      let edition = 0
      if (this.item.contractAsset) {
        edition = this.item.contractAsset.tokenInfo.edition
      }
      return '/item-preview/' + this.item.assetHash + '/' + edition
    },
    transactionUrl: function () {
      return 'https://explorer.stacks.co/txid/' + this.item.mintInfo.txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application
    },
    testMode () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.superAdmin
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
