<template>
<div v-if="myDialog">
  <b-row>
    <b-col cols="12">
      <prismic-items :prismicItems="myDialog"></prismic-items>
    </b-col>
  </b-row>
  <b-row class="row text-left mt-2">
    <b-col md="5" sm="6">
      <div>
        <h5>{{currentMaxEditions - (editionCounter - 1)}} available in current run</h5>
      </div>
    </b-col>
  </b-row>
  <b-button v-if="webWalletNeeded" v-b-tooltip.hover="{ variant: 'dark' }" :title="ttWalletHelp" class="w-25"><a :href="webWalletLink" class="text-white" target="_blank">Get Stacks Web Wallet <b-icon class="" icon="arrow-up-right-square-fill"/></a></b-button>
  <action-row :buttonLabel="buttonLabel()" @clickButton="startMinting" :svgImage="icon"/>
</div>
</template>

<script>
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'EditionFlow',
  components: {
    PrismicItems,
    ActionRow
  },
  props: ['assetHash'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null,
      webWalletNeeded: false
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      return 'Mint the next edition for ' + this.currentCost + ' STX'
    },
    buttonLabel () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (this.webWalletNeeded) return 'GET STACKS WALLET'
      else if (!profile.loggedIn) {
        return 'LOG IN TO CLAIM'
      }
      return 'MINT EDITION'
    },
    startMinting: function () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile.loggedIn) {
        this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
          // this.$emit('registerByConnect')
        }).catch(() => {
          window.open(
            this.webWalletLink,
            '_blank'
          )
        })
      } else {
        this.mintEdition()
      }
    },
    mintEdition: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      const methos = (process.env.VUE_APP_NETWORK === 'local') ? 'callContractRisidio' : 'callContractBlockstack'
      const data = {
        owner: contractAsset.owner,
        editionCost: this.currentCost,
        action: methos,
        nftIndex: contractAsset.nftIndex,
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        functionName: 'mint-edition'
      }
      this.$store.dispatch('rpayPurchaseStore/mintEdition', data).then((result) => {
        this.result = result
        this.$emit('mintedEvent', result)
      })
    }
  },
  computed: {
    ttWalletHelp () {
      const tooltip = this.$store.getters[APP_CONSTANTS.KEY_TOOL_TIP]('tt-wallet-help')
      return (tooltip) ? tooltip[0].text : ''
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    myDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('mint-edition')
      return dialog
    },
    currentCost: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.editionCost
    },
    editionsMintable: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return (contractAsset.tokenInfo.maxEditions >= contractAsset.editionCounter)
    },
    editionCounter: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.editionCounter
    },
    currentMaxEditions: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (!contractAsset) return
      return contractAsset.tokenInfo.maxEditions
    }
  }
}
</script>
<style lang="scss" scoped>
.input-group-text {
  background: #fff;
  color: #000;
}
</style>
