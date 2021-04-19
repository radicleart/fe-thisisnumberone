<template>
<div :class="themeClass" class="w-50 d-flex justify-content-around">
  <div v-for="(link, index) in socialLinks" :key="index">
    <b-link router-tag="span" :to="target(link)" target="_blank"><b-icon style="width: 20px; height: 20px;" :icon="icon(link)"/></b-link>
  </div>
</div>
</template>

<script>

export default {
  name: 'SocialLinks',
  components: {
  },
  props: ['socialLinks', 'themeClass'],
  data: function () {
    return {
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
  },
  methods: {
    target: function (link) {
      if (link) {
        const inner = link.social_link[0].text
        const type = inner.split('&')[1]
        if (type && type.indexOf('=') > -1) {
          return type.split('=')[1]
        }
      }
      return ''
    },
    icon: function (link) {
      if (link) {
        const inner = link.social_link[0].text
        const type = inner.split('&')[0]
        if (type && type.indexOf('=') > -1) {
          return type.split('=')[1]
        }
      }
      return ''
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
