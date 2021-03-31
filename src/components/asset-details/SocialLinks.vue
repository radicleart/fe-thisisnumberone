<template>
<div class="d-flex justify-content-around">
  <div v-for="(link, index) in socialLinks" :key="index">
    <a :href="target(link)" target="_blank"><b-icon :icon="icon(link)"/></a>
  </div>
</div>
</template>

<script>

export default {
  name: 'SocialLinks',
  components: {
  },
  props: ['socialLinks'],
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
</style>
