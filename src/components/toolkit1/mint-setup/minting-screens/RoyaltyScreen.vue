<template>
<b-card-group class="m-5">
  <b-card header-tag="header" footer-tag="footer" class="rpay-card">
    <!-- <header-screen :allowEdit="false" :item="item"/> -->
    <item-display :item="item"/>
    <div class="text-danger" v-html="errorMessage"></div>
    <beneficiaries :beneficiaries="beneficiaries" v-on="$listeners" :item="item"/>
    <b-card-text class="mx-4">
      <div class="d-flex justify-content-between">
        <b-button @click="saveData()" class="w-50 mr-2" variant="outline-light">CANCEL</b-button>
        <b-button @click="sendMintEvent()" v-if="allowMint()"  class="w-50 ml-2" variant="warning">MINT NOW</b-button>
      </div>
    </b-card-text>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Beneficiaries from './Beneficiaries'
import ItemDisplay from './ItemDisplay'

export default {
  name: 'RoyaltyScreen',
  components: {
    Beneficiaries,
    ItemDisplay
  },
  props: ['item', 'beneficiaries', 'errorMessage'],
  data () {
    return {
      mintedMessage: null
    }
  },
  methods: {
    rangeEvent (displayCard) {
      this.$store.commit('rpayStore/setDisplayCard', displayCard)
    },
    getRangeValue () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      if (displayCard === 100) return 0
      else if (displayCard === 102) return 1
      else if (displayCard === 104) return 2
    },
    allowMint () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.royalty
      })
      sum = Math.round(sum * 100) / 100
      return sum === 100.00
    },
    saveData: function () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      configuration.opcode = 'cancel-minting'
      window.eventBus.$emit('rpayEvent', configuration)
    },
    sendMintEvent: function () {
      this.$emit('mintToken')
    }
  },
  computed: {
    displayCard () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      return displayCard
    },
    enableRoyalties () {
      // const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
