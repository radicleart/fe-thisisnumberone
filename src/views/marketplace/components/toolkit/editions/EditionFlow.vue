<template>
<div v-if="myDialog">
  <b-row>
    <b-col cols="12">
      <h1>Mint Next Edition</h1>
    </b-col>
  </b-row>
  <b-row class="row text-left mt-2">
    <b-col md="4" sm="12">
      <p v-if="myDialog[2]">{{myDialog[2].text}}</p>
      <p v-if="myDialog[3]">{{myDialog[3].text}}
      </p>
    </b-col>
    <b-col md="5" sm="6" style="border-right: 1pt solid #000;">
      <div>
        <h3>Mint Edition: <span class="text-warning">{{currentCost}}</span> STX</h3>
        <h5>{{currentMaxEditions - (editionCounter - 1)}} available in current run</h5>
      </div>
      <div class="text-small">
        <RatesListing :message="''" :amount="currentCost"/>
      </div>
    </b-col>
  </b-row>
  <ActionRow :buttonLabel="'MINT EDITION'" @clickButton="mintEdition" :svgImage="icon"/>
</div>
</template>

<script>
import RatesListing from '@/views/marketplace/components/toolkit/RatesListing'
import ActionRow from '@/components/utils/ActionRow'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'PurchaseBuyNow',
  components: {
    ActionRow,
    RatesListing
  },
  props: ['item'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      loading: true,
      formSubmitted: false,
      errorMessage: null,
      defaultRate: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rateMessage: function () {
      return 'Mint the next edition for ' + this.currentCost + ' STX'
    },
    mintEdition: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      const methos = (process.env.VUE_APP_NETWORK === 'local') ? 'callContractRisidio' : 'callContractBlockstack'
      const data = {
        owner: this.item.contractAsset.owner,
        editionCost: this.currentCost,
        action: methos,
        nftIndex: this.item.contractAsset.nftIndex,
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        functionName: 'mint-edition'
      }
      this.$store.dispatch('rpayPurchaseStore/mintEdition', data).then((result) => {
        this.$emit('mintedEvent', result)
      }).catch(() => {
        this.$emit('mintedEvent', { opcode: 'mint-edition-failed' })
      })
    }
  },
  computed: {
    myDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('buy-now')
      return dialog
    },
    currentCost: function () {
      return this.item.contractAsset.tokenInfo.editionCost
    },
    editionsMintable: function () {
      return (this.item.contractAsset.tokenInfo.maxEditions >= this.item.contractAsset.editionCounter)
    },
    editionCounter: function () {
      return this.item.contractAsset.editionCounter
    },
    currentMaxEditions: function () {
      return this.item.contractAsset.tokenInfo.maxEditions
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
