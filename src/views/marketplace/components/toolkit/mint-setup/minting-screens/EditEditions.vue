<template>
<b-card-text class="mx-4">
  <b-row>
    <b-col cols="12">
      <label for="buyNowPrice"><a v-b-tooltip.hover="{ variant: 'warning' }" :title="'Set buy now price - or 0 to sell later'" href="#">Buy Now <b-icon icon="question-circle"/></a></label>
        <b-form-input
          id="buyNowPrice"
          size="sm"
          v-model="item.attributes.buyNowPrice"
          @blur="updateItem"
          aria-describedby="buyNowPrice-help buyNowPrice-feedback"
          placeholder="Buy now price"
        ></b-form-input>
      <b-form-invalid-feedback id="editions-feedback">
        How many editions of this NFT do you want to allow? At least 1 - at most 100
      </b-form-invalid-feedback>
    </b-col>
    <b-col cols="6">
      <label for="editions"><a v-b-tooltip.hover="{ variant: 'warning' }" :title="'Set the number of editions to allow users to mint'" href="#">Editions <b-icon icon="question-circle"/></a></label>
        <b-form-input
          id="editions"
          size="sm"
          v-model="item.attributes.editions"
          @blur="updateItem"
          :state="itemEditionsState"
          aria-describedby="editions-help editions-feedback"
          placeholder="Number of editions"
          trim
        ></b-form-input>
      <b-form-invalid-feedback id="editions-feedback">
        How many editions of this NFT do you want to allow? At least 1 - at most 100
      </b-form-invalid-feedback>
    </b-col>
    <b-col cols="6">
      <label for="editions"><a v-b-tooltip.hover="{ variant: 'warning' }" :title="'Set the cost for a user to mint a new edition - you can change this price at any time'" href="#">Edition Cost <b-icon icon="question-circle"/></a></label>
        <b-form-input
          id="editionCost"
          size="sm"
          @blur="updateItem"
          v-model="item.attributes.editionCost"
          :state="itemEditionCostState"
          aria-describedby="edition-cost-help editions-feedback"
          placeholder="Cost in STX"
          trim
        ></b-form-input>
      <b-form-invalid-feedback id="edition-cost-feedback">
        Cost of minting an edition (STX) - the amount is split between the royalties
      </b-form-invalid-feedback>
    </b-col>
  </b-row>
</b-card-text>
</template>

<script>
export default {
  name: 'EditEditions',
  components: {
  },
  props: ['item'],
  data () {
    return {
      formSubmitted: false
    }
  },
  mounted () {
    if (!this.item.attributes.buyNowPrice || this.item.attributes.buyNowPrice < 1) {
      this.item.attributes.buyNowPrice = 0
    }
  },
  methods: {
    updateItem: function () {
      if (!this.item.attributes.buyNowPrice || this.item.attributes.buyNowPrice < 1) {
        this.item.attributes.buyNowPrice = 0
      }
      if (!this.item.attributes.editions || this.item.attributes.editions < 1) {
        this.item.attributes.editions = 1
      }
      if (!this.item.attributes.editionCost || this.item.attributes.editionCost < 0) {
        this.item.attributes.editionCost = 0
      }
      this.item.attributes.editions = Number(this.item.attributes.editions)
      this.item.attributes.editionCost = Number(this.item.attributes.editionCost)
      this.$store.dispatch('rpayMyItemStore/quickSaveItem', this.item)
    }
  },
  computed: {
    itemEditionsState () {
      if (!this.formSubmitted && !this.item.attributes.editions) return null
      return (this.item.attributes.editions > 0 && this.item.attributes.editions < 101)
    },
    itemEditionCostState () {
      if (!this.formSubmitted && !this.item.attributes.editionCost) return null
      return (this.item.attributes.editionCost >= 0)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
