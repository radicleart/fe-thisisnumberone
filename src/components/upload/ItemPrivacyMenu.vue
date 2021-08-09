<template>
<div>
  <div v-if="mode === 'update'">
    <b-form-checkbox @change="togglePrivacy" v-model="publicAvailable" name="check-button" switch class="text-secondary">
      <span v-if="!publicAvailable"><b>Private</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Not displayed in ThisIsNumberOne Marketplace'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></span>
      <span v-else><b>Public</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Displayed in ThisIsNumberOne Marketplace'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></span>
    </b-form-checkbox>
  </div>
  <div v-else>
    {{item.privacy}}
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemPrivacyMenu',
  components: {
  },
  props: ['assetHash', 'mode'],
  data () {
    return {
      publicAvailable: true
    }
  },
  mounted () {
    if (!this.item.privacy && !this.item.privacy === 'private') {
      this.item.privacy = 'public'
      this.publicAvailable = true
    } else {
      this.publicAvailable = false
    }
  },
  methods: {
    togglePrivacy: function () {
      if (this.publicAvailable) {
        this.item.privacy = 'public'
      } else {
        this.item.privacy = 'private'
      }
      this.$store.dispatch('rpayMyItemStore/saveItem', this.item).then((item) => {
        this.$notify({ type: 'warning', title: 'Privacy Update', text: 'Item is now: ' + item.privacy })
      })
    }
  },
  computed: {
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
