<template>
<div>
  <div class="mb-3" role="group text-right w-100">
    <label for="item-editions">Editions :</label>
    <b-form-input
      id="item-editions"
      type="number"
      v-model="item.attributes.editions"
      :state="itemEditionsState"
      aria-describedby="item-editions-help item-editions-feedback"
      placeholder="Enter editions"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-editions-feedback">
      How many editions of this NFT do you want to allow? At least 1 - at most 100
    </b-form-invalid-feedback>
  </div>
  <div class="mb-3" role="group text-right w-100">
    <label for="item-edition-cost">Cost per edition (STX) :</label>
    <b-form-input
      id="item-edition-cost"
      type="number"
      v-model="item.attributes.editionCost"
      :state="itemEditionCostState"
      aria-describedby="item-edition-cost-help item-edition-cost-feedback"
      placeholder="Cost to mint an edition"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-editions-feedback">
      How much STX tokens each subsequent edition costs
    </b-form-invalid-feedback>
  </div>
</div>
</template>

<script>
export default {
  name: 'ItemFormPart2',
  props: ['upload', 'item', 'formSubmitted'],
  data: function () {
    return {
    }
  },
  methods: {
  },
  computed: {
    itemEditionsState () {
      if (!this.formSubmitted && !this.item.attributes.editions) return null
      return (this.item.attributes.editions > 0 && this.item.attributes.editions < 101)
    },
    itemEditionCostState () {
      if (!this.formSubmitted && !this.item.attributes.editionCost) return null
      return (parseInt(this.item.attributes.editionCost) >= 0)
    }
  }
}
</script>

<style scoped>
</style>
