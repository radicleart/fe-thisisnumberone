<template>
<b-card-group deck v-if="item">
  <b-card class="text-center" header-tag="header" footer-tag="footer">
    <!-- <header-screen :allowEdit="false" :item="item"/> -->
    <ItemDisplay class="my-5" :item="item"/>
    <div class="d-flex justify-content-center"><p class="w-50 bg-warning py-3 px-5 mb-5"><a class="text-white" href="#" @click="showBeneficiaries = true">Set Your Royalties</a></p></div>
    <beneficiaries class="mb-5 text-left" v-if="showBeneficiaries" :beneficiaries="beneficiaries" v-on="$listeners" :item="item"/>
    <div class="my-4 text-danger" v-html="errorMessage"></div>
    <template v-slot:footer>
      <div class="d-flex justify-content-between">
        <b-button @click="saveData()" class="w-50 mr-4" variant="outline-light">save mint later</b-button>
        <b-button @click="sendMintEvent()" v-if="allowMint()"  class="w-50 ml-4" variant="outline-dark">mint now</b-button>
      </div>
    </template>
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
      mintedMessage: null,
      showBeneficiaries: false
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
