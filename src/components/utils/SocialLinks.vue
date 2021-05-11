<template>
<div id="social-links" :class="themeClass">
  <div class="d-flex justify-content-between">
    <span v-for="(link, index) in socialLinks" :key="index">
      <a class="mr-5" :href="getTarget(link)" target="_blank"><b-icon class="text-white" style="width: 30px; height: 30px;" :icon="getIcon(link)"/></a>
    </span>
  </div>
</div>
</template>

<script>

export default {
  name: 'SocialLinks',
  components: {
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
          const target = params.find((o) => o.indexOf('link') > -1)
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
