<template>
<div class="">
  <div v-for="(result, index) in resultSet" :key="index" :class="gridClasses">
    <result-item :result="result" />
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultItem from './ResultItem'

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['gridClasses'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT]
      return (application && application.gaiaProject) ? application : null
    },
    resultSet () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT]
      return (application && application.gaiaProject) ? application : null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
