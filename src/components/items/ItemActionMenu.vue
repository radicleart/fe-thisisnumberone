<template>
<span>
  <span class="ml-2" v-if="showPreviewLink"><b-link :to="'/item-preview/' + item.assetHash"><span class="mb-0">open</span></b-link></span>
  <span class="ml-2" v-if="showEditLink"><b-link :to="'/edit-item/' + item.assetHash"><span class="mb-0">edit</span></b-link></span>
  <span class="ml-2" v-if="showDeleteLink && !item.contractAsset"><a href="#" @click.prevent="deleteItem" class="text-danger"><span class="mb-0">delete</span></a></span>
</span>
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
      this.$store.dispatch('myItemStore/deleteItem', this.item)
    }
  },
  computed: {
    testMode () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.superAdmin
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
