<template>
<div class="d-flex justify-content-between">
  <ShareNetwork v-if="network"
      :network="network"
      :url="assetUrl()"
      :title="gaiaAsset.name"
      :description=gaiaAsset.description
      :quote="'Stacks Network - the user owned Internet uses Smart Contracts on Bitcoin'"
      :hashtags="gaiaAsset.artist"
    >
    <b-icon width="20" height="20" class="text-white" :icon="icon"/>
  </ShareNetwork>
</div>
</template>

<script>

export default {
  name: 'ShareContent',
  components: {
  },
  props: ['network', 'gaiaAsset', 'icon'],
  data () {
    return {
    }
  },
  methods: {
    assetUrl: function () {
      if (window.location.href.indexOf('localhost') > -1) {
        return 'https://thisisnumberone.com' + window.location.pathname
      }
      return window.location.href
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
