<template>
<div id="share-links" :class="themeClass">
  <div class="d-flex justify-content-between">
    <!-- <b-icon style="width: 30px; height: 30px;" icon="share"/> -->
    <span v-for="(link, index) in socialLinks" :key="index">
      <share-content :gaiaAsset="gaiaAsset" :network="getNetwork(link)" :icon="getIcon(link)" />
    </span>
  </div>
</div>
</template>

<script>
import ShareContent from '@/components/utils/ShareContent'

export default {
  name: 'SocialLinks',
  components: {
    ShareContent
  },
  props: ['socialLinks', 'link', 'themeClass', 'gaiaAsset'],
  data: function () {
    return {
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
  },
  methods: {
    getTarget: function (link) {
      if (link) {
        const hasNetwork = link.social_link[0].text.indexOf('type') > -1
        if (hasNetwork) {
          const params = link.social_link[0].text.split('&')
          const target = params.find((o) => o.indexOf('type') > -1)
          if (target) {
            return target.split('=')[1]
          }
        }
      }
    },
    getNetwork: function (link) {
      if (link) {
        const hasNetwork = link.social_link[0].text.indexOf('type') > -1
        if (hasNetwork) {
          const params = link.social_link[0].text.split('&')
          const network = params.find((o) => o.indexOf('type') > -1)
          if (network) {
            return network.split('=')[1]
          }
        }
      }
    },
    getIcon: function (link) {
      try {
        if (link) {
          const hasIcon = link.social_link[0].text.indexOf('icon') > -1
          if (hasIcon) {
            const params = link.social_link[0].text.split('&')
            const icon = params.find((o) => o.indexOf('icon') > -1)
            if (icon) {
              return icon.split('=')[1]
            } else {
              return this.getTarget(link)
            }
          }
        }
        return this.getTarget(link)
      } catch {
        return this.getTarget(link)
      }
    }
  },
  computed: {
  }
}
</script>

<style scoped>
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff !important;
}
</style>
