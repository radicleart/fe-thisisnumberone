<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="rpay-card">
    <!-- <header-screen :allowEdit="false" :item="item"/> -->
    <item-display :item="item"/>
    <div class="text-danger" v-html="errorMessage"></div>
    <beneficiaries :beneficiaries="beneficiaries" v-on="$listeners" :item="item"/>
    <template v-slot:footer>
      <div class="">
        <div>
          <div class="bg-dark p-3 d-flex justify-content-between">
            <square-button @clickButton="saveData()" :theme="'light'" :label1="'CANCEL'" :icon="'eye'"/>
            <square-button @clickButton="mintToken()" :theme="'light'" :label1="'MINT NOW'" :icon="'eye'"/>
          </div>
        </div>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import Beneficiaries from './Beneficiaries'
import ItemDisplay from './ItemDisplay'
import SquareButton from '@/components/utils/SquareButton'

export default {
  name: 'RoyaltyScreen',
  components: {
    Beneficiaries,
    ItemDisplay,
    SquareButton
  },
  props: ['item', 'beneficiaries'],
  data () {
    return {
      errorMessage: null,
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
    saveData: function () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      configuration.opcode = 'cancel-minting'
      window.eventBus.$emit('rpayEvent', configuration)
    },
    mintToken: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      this.$store.commit('rpayStore/setDisplayCard', 104)
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      const networkConfig = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      networkConfig.assetHash = configuration.gaiaAsset.assetHash
      networkConfig.editions = configuration.gaiaAsset.editions
      networkConfig.gaiaUsername = configuration.gaiaAsset.gaiaUsername
      networkConfig.beneficiaries = configuration.minter.beneficiaries
      if (networkConfig.network === 'stacks connect') {
        networkConfig.action = 'callContractBlockstack'
        this.mintTokenStacks(networkConfig)
      } else if (networkConfig.network === 'stacks risidio') {
        networkConfig.action = 'callContractRisidio'
        this.mintTokenStacks(networkConfig)
      } else {
        this.mintTokenEthereum(networkConfig)
      }
    },
    mintTokenStacks: function (data) {
      this.$store.dispatch('rpayStacksStore/mintToken', data)
    },
    mintTokenEthereum: function (networkConfig) {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      const mintConfig = {
        opcode: 'mint-token',
        ethContractAddress: networkConfig.contractAddress,
        assetHash: configuration.gaiaAsset.assetHash
      }
      this.$store.dispatch('rpayEthereumStore/transact', mintConfig)
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
