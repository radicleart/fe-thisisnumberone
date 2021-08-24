<template>
<div class="row">
  <div class="col-12 mb-5">
    <div class="mb-5">
      <h3>Sale Type: Not For Sale</h3>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'NotForSale',
  components: {
  },
  props: ['contractAsset'],
  data () {
    return {
    }
  },
  mounted () {
    this.contractAsset.saleData.buyNowOrStartingPrice = 0
    this.contractAsset.saleData.reservePrice = 0
    this.contractAsset.saleData.incrementPrice = 0
    this.contractAsset.saleData.saleType = 0
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
