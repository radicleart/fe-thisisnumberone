<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="rpay-card">
  <b-card-text class="border-bottom d-flex justify-content-center">
    <img height="100%" width="100%" :src="logoDone"/>
  </b-card-text>
  <b-card-text class="text-center mx-4">
    <div class="mb-4 text-two text-success"><b-icon width="4em" height="4em" scale="1" icon="check-circle"></b-icon></div>
    <h2 class="text-h2 mb-3" v-html="getPendingMessage"></h2>
  </b-card-text>
  <template v-slot:footer>
    <div class="">
      <div>
        <div class="bg-dark p-3 d-flex justify-content-between">
          <b-button variant="outline-primary" @click="backData()">Back</b-button>
        </div>
      </div>
    </div>
  </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SquareButton from '@/components/utils/SquareButton'

export default {
  name: 'PendingScreen',
  components: {
    SquareButton
  },
  data () {
    return {
      pendingMessage: 'Minting token - please sit tight',
      errorMessage: null,
      mintedMessage: null,
      logoDone: 'https://images.prismic.io/risidio-journal/bf9dce36-1caf-49e3-832c-d6877ac136a7_mint_success.png?auto=compress,format'
    }
  },
  methods: {
    backData: function () {
      this.$store.commit('rpayStore/setDisplayCard', 100)
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      configuration.opcode = 'stx-save-and-close-mint-data'
      window.eventBus.$emit('rpayEvent', configuration)
    }
  },
  computed: {
    getPendingMessage () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
      const assetHash = configuration.gaiaAsset.assetHash
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](assetHash)

      const preferredNetwork = this.$store.getters[APP_CONSTANTS.KEY_PREFERRED_NETWORK]
      let message = 'This NFT (#' + asset.contractAsset.nftIndex + ') has been minted on the Stacks Blockchain!'
      if (preferredNetwork.network === 'ethereum') {
        message = 'This NFT (#' + asset.tokenId + ') has been minted on the Ethereum Blockchain'
      }
      const mintingObject = this.$store.getters[APP_CONSTANTS.KEY_MINTING_MESSAGE]
      if (mintingObject && mintingObject.message) {
        message = mintingObject.message
      }
      return message
    },
    displayCard () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      return displayCard
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
