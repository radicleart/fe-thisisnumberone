<template>
<div>
  <div><span class="" v-html="displayable"></span>
  <span v-if="overflow && morable" class="text-muted">
    <a href="" class="text-warning px-2" @click.prevent="truncated = !truncated" v-if="truncated" >read more</a>
    <a href="" class="text-warning px-2" @click.prevent="truncated = !truncated" v-else>less</a>
  </span>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'DescriptionContainer',
  components: {
  },
  props: ['text', 'limit', 'morable'],
  data () {
    return {
      truncated: true
    }
  },
  computed: {
    displayable () {
      let splittedLength = 0
      if (this.text) {
        splittedLength = this.text.split(' ').length
      }
      if (splittedLength > this.limit && this.truncated) {
        const words = this.text.split(' ')
        const limit = words.length - 1
        const trunc = Math.min(limit, this.limit)
        const truncStr = words.slice(0, trunc)
        return truncStr.join(' ')
      } else {
        return this.text
      }
    },
    overflow () {
      let splittedLength = 0
      if (this.text) {
        splittedLength = this.text.split(' ').length
      }
      return splittedLength > this.limit
    }
  },
  methods: {
  }
}
</script>
<style>

</style>
<style scoped>
</style>
