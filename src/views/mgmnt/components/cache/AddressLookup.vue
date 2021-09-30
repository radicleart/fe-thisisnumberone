<template>
<div>
  <div>
      <label class="mt-2 d-flex justify-content-between" for="item-name">
        <span>Lookup STX Address:</span>
      </label>
      <b-form-input
        id="item-name"
        v-model="recipient"
        aria-describedby="item-name-help item-name-feedback"
        placeholder="Recipient address - where to send the STX tokens for the swap"
        trim></b-form-input>
      <p class="mt-3 text-left"><b-button variant="warning" @click="lookup">Lookup</b-button></p>
  </div>
  <div>
    <b-card bg-variant="secondary" v-for="(item, index) in items" :key="index">
      <vue-json-pretty :data="item" @click="handleClick"> </vue-json-pretty>
    </b-card>
  </div>
</div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'AddressLookup',
  components: {
  },
  data () {
    return {
      recipient: null,
      items: null,
      VueJsonPretty
    }
  },
  methods: {
    lookup () {
      this.$store.dispatch('rpayStacksContractStore/fetchAssetsByOwner', { stxAddress: this.recipient, mine: false }).then((items) => {
        this.items = items
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
