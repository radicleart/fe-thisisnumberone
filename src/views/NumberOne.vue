<template>
<section id="number-one-section" class="">
  <number-one-section />
</section>
</template>

<script>
import NumberOneSection from '@/components/asset-details/NumberOneSection'

export default {
  name: 'NumberOne',
  components: {
    NumberOneSection
  },
  data () {
    return {
    }
  },
  mounted () {
    this.findAssets()
  },
  methods: {
    findAssets () {
      // const pid = STX_CONTRACT_NAME.split('-')[0]
      this.$store.dispatch('rpayStacksContractStore/fetchContractDataFirstEditions').then(() => {
        // this.resultSet = results
        this.loaded = true
      })
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
