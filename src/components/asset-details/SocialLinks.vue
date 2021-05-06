<template>
<div :class="themeClass">
  <span v-for="(link, index) in socialLinks" :key="index">
    <b-link class="mr-5" router-tag="span" :to="target(link)" target="_blank"><b-icon style="width: 30px; height: 30px;" :icon="icon(link)"/></b-link>
  </span>
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
