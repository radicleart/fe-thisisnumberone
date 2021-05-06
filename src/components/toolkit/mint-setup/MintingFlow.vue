<template>
<div class="d-flex justify-content-center" v-if="!loading">
  <div class="mx-auto">
    <royalty-screen :errorMessage="errorMessage" :item="item" @mintToken="mintToken" @editBeneficiary="editBeneficiary" @removeBeneficiary="removeBeneficiary" @updateBeneficiary="updateBeneficiary" @addNewBeneficiary="addNewBeneficiary" :beneficiaries="beneficiaries" v-if="!isMinted && displayCard !== 102"/>
    <add-beneficiary-screen :errorMessage="errorMessage" :eBen="eBen" @addBeneficiary="addBeneficiary" :beneficiaries="beneficiaries" :item="item" v-if="!isMinted && displayCard === 102"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RoyaltyScreen from './minting-screens/RoyaltyScreen'
import AddBeneficiaryScreen from './minting-screens/AddBeneficiaryScreen'

export default {
  name: 'MintingFlow',
  components: {
    RoyaltyScreen,
    AddBeneficiaryScreen
  },
  props: ['assetHash'],
  data () {
    return {
      loading: true,
      errorMessage: null,
      beneficiaries: null,
      eBen: null
    }
  },
  mounted () {
    const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
    if (item.beneficiaries && item.beneficiaries.length > 0) {
      this.beneficiaries = item.beneficiaries
    } else {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      this.beneficiaries = [
        {
          username: profile.username,
          role: 'Seller',
          owner: true,
          email: profile.username,
          royalty: 100,
          chainAddress: profile.stxAddress
        }
      ]
      this.updateItem()
    }
    this.setPage()
  },
  methods: {
    mintToken: function () {
      this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        mintingFee: 1.1,
        owner: profile.stxAddress, // process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        // methos: 'rpayStacksStore/callContractBlockstack',
        assetHash: this.item.assetHash,
        metaDataUrl: this.item.metaDataUrl,
        beneficiaries: this.item.beneficiaries,
        editions: this.item.editions,
        editionCost: (this.item.editionCost) ? this.item.editionCost : 0,
        sendAsSky: true,
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
        functionName: 'mint-token'
      }
      this.$store.dispatch('rpayPurchaseStore/mintToken', data).then((result) => {
        this.result = result
      })
    },
    addNewBeneficiary: function () {
      this.eBen = null
      this.$store.commit('rpayStore/setDisplayCard', 102)
    },
    editBeneficiary: function (beneficiary) {
      this.eBen = beneficiary
      this.$store.commit('rpayStore/setDisplayCard', 102)
    },
    removeBeneficiary: function (beneficiary) {
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1)
        this.setBaseRoyalty()
        this.updateItem()
      }
    },
    updateBeneficiary: function (beneficiary) {
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1, beneficiary)
        this.setBaseRoyalty()
        this.updateItem()
      }
    },
    addBeneficiary: function (beneficiary) {
      this.errorMessage = null
      if (!beneficiary || !beneficiary.royalty || !beneficiary.chainAddress) {
        this.errorMessage = 'Bad value for beneficiary'
        return
      }
      if (beneficiary.chainAddress === this.beneficiaries[0].chainAddress) {
        this.errorMessage = 'Can not have the same address as owner!'
        return
      }
      this.beneficiaries[0].royalty = this.beneficiaries[0].royalty - beneficiary.royalty
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1, beneficiary)
      } else {
        if (this.beneficiaries.length === 10) {
          this.errorMessage = 'No more beneficiaries allowed'
        } else {
          this.beneficiaries.push(beneficiary)
        }
      }
      this.setBaseRoyalty()
      this.updateItem()
      this.$store.commit('rpayStore/setDisplayCard', 100)
    },
    setBaseRoyalty () {
      let sum = 0
      this.beneficiaries.forEach((o) => {
        if (!o.owner) {
          sum += o.royalty
        }
      })
      this.beneficiaries[0].royalty = 100 - sum
      sum = 0
      this.beneficiaries.forEach((o) => {
        sum += o.royalty
      })
      if (sum !== 100) {
        this.errorMessage = 'Royalties must add up to 100%'
      }
    },
    updateItem () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      item.beneficiaries = this.beneficiaries
      this.$store.dispatch('myItemStore/saveItem', item).then((item) => {
        this.beneficiaries = item.beneficiaries
      })
    },
    setPage () {
      this.loading = false
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      if (!displayCard) {
        this.$store.commit('rpayStore/setDisplayCard', 100)
      }
    }
  },
  computed: {
    item () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    isMinted () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return asset
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
