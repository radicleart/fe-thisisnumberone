<template>
<b-dropdown :variant="variant || 'white'" class="bg-none m-0 p-0" no-caret>
  <template #button-content class="bg-none m-0 p-0">
    <b-icon icon="three-dots"/>
  </template>
  <b-dropdown-item v-if="showPreviewLink"><b-link :to="'/item-preview/' + item.assetHash"><span class="mb-0">open item</span></b-link></b-dropdown-item>
  <b-dropdown-item v-if="!contractAsset"><b-link :to="'/edit-item/' + item.assetHash"><span class="mb-0">edit item</span></b-link></b-dropdown-item>
  <b-dropdown-item v-else-if="testMode"><b-link :to="'/edit-item/' + item.assetHash"><span class="mb-0">edit item</span></b-link></b-dropdown-item>
  <b-dropdown-item v-if="showDeleteLink && !contractAsset"><a href="#" @click.prevent="deleteItem" class="text-danger"><span class="mb-0">delete item</span></a></b-dropdown-item>
</b-dropdown>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemActionMenu',
  components: {
  },
  props: ['assetHash', 'variant'],
  data () {
    return {
    }
  },
  methods: {
    deleteItem () {
      this.$store.dispatch('myItemStore/deleteItem', this.item)
    }
  },
  computed: {
    testMode () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.superAdmin
    },
    showPreviewLink () {
      return this.$route.name !== 'item-preview'
    },
    showDeleteLink () {
      return this.$route.name === 'edit-item' || this.$route.name === 'my-items-filter'
    },
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
