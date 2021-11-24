<template>
<b-card-group>
  <b-card class="text-white text-xsmall bg-dark" style="min-height: 30vh;" header-tag="header" footer-tag="footer">
    <!-- <header-screen :allowEdit="false" :item="item"/> -->
    <div class="text-danger" v-html="errorMessage"></div>
    <EditEditions v-if="allowEditEditions" :item="item"/>
    <!-- <Beneficiaries :hidePrimaries="hidePrimaries" :beneficiaries="beneficiaries" v-on="$listeners"/> -->
    <ListBeneficiaries :loopRun="loopRun" :item="item" />
    <template v-slot:footer>
      <div class="d-flex justify-content-between">
        <b-button @click="saveData()" class="rounded w-50 mr-2" variant="outline-light">Cancel</b-button>
        <b-button @click="sendMintEvent()" class="w-50 ml-2" variant="warning"><span v-if="mintButtonText">{{mintButtonText}}</span><span v-else>Mint Now</span></b-button>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import Beneficiaries from './Beneficiaries'
import EditEditions from './EditEditions'
import ListBeneficiaries from '@/views/marketplace/components/toolkit/ListBeneficiaries'

export default {
  name: 'RoyaltyScreen',
  components: {
    EditEditions,
    ListBeneficiaries
  },
  props: ['loopRun', 'item', 'errorMessage', 'hidePrimaries', 'mintButtonText'],
  data () {
    return {
      allowEditEditions: true, // process.env.VUE_APP_ALLOW_EDIT_EDITIONS,
      mintedMessage: null
    }
  },
  methods: {
    rangeEvent (displayCard) {
      this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, displayCard)
    },
    getRangeValue () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      if (displayCard === 100) return 0
      else if (displayCard === 102) return 1
      else if (displayCard === 104) return 2
    },
    /**
    allowMint () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.royalty
      })
      sum = Math.round(sum * 100) / 100
      return sum === 100.00
    },
    **/
    saveData: function () {
      window.eventBus.$emit('rpayEvent', { opcode: 'cancel-minting' })
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
      // const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
