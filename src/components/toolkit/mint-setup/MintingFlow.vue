<template>
<div class="d-flex justify-content-center" v-if="!loading">
  <div class="mx-auto">
    <royalty-screen :errorMessage="errorMessage" :item="item" @mintToken="mintToken" @editBeneficiary="editBeneficiary" @removeBeneficiary="removeBeneficiary" @updateBeneficiary="updateBeneficiary" @addNewBeneficiary="addNewBeneficiary" :beneficiaries="beneficiaries" v-if="displayCard !== 102"/>
    <add-beneficiary-screen :errorMessage="errorMessage" :eBen="eBen" @addBeneficiary="addBeneficiary" :beneficiaries="beneficiaries" :item="item" v-if="displayCard === 102"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RoyaltyScreen from './minting-screens/RoyaltyScreen'
import AddBeneficiaryScreen from './minting-screens/AddBeneficiaryScreen'
import utils from '@/services/utils'

export default {
  name: 'MintingFlow',
  components: {
    RoyaltyScreen,
    AddBeneficiaryScreen
  },
  props: ['item'],
  data () {
    return {
      loading: true,
      errorMessage: null,
      beneficiaries: [],
      eBen: null
    }
  },
  mounted () {
    if (this.item.beneficiaries && this.item.beneficiaries.length > 0) {
      this.beneficiaries = this.item.beneficiaries
    } else {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const lben = JSON.parse(process.env.VUE_APP_BENEFICIARIES)
      let tots = 0
      lben.forEach((b) => {
        tots += b.royalty
      })
      lben.push({
        username: profile.username,
        role: 'Seller',
        owner: true,
        email: profile.username,
        royalty: 100 - tots,
        chainAddress: profile.stxAddress
      })
      this.beneficiaries = lben
      this.item.beneficiaries = this.beneficiaries
      this.updateItem()
    }
    this.setPage()
  },
  methods: {
    mintToken: function () {
      // this.$notify({ type: 'warning', title: 'Minting', text: 'Minting non fungible token - takes a minute or so..' })
      // the post condition applies to the address the funds are going to not from!!!
      // when minting the funds go to the contract admin.
      // const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const contractAddress = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
      let contractName = process.env.VUE_APP_STACKS_CONTRACT_NAME
      if (process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT) {
        contractName = process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT
      }
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](contractAddress + '.' + contractName)
      const data = {
        mintingFee: application.tokenContract.mintPrice,
        assetHash: this.item.assetHash,
        metaDataUrl: this.item.metaDataUrl,
        beneficiaries: this.beneficiaries || [],
        editions: this.item.editions,
        editionCost: utils.toOnChainAmount(this.item.editionCost),
        sendAsSky: true, // only applicable in local
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'mint-token'
      }
      this.$store.dispatch('rpayPurchaseStore/mintToken', data).then((result) => {
        this.result = result
      }).catch(() => {
        this.$notify({ type: 'danger', title: 'Minting Error', text: 'Minting error - do you have enough STX to  pay the gas fee? Check the network is correct?' })
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
        this.item.beneficiaries = this.beneficiaries
        this.updateItem()
      }
    },
    updateBeneficiary: function (beneficiary) {
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1, beneficiary)
        this.setBaseRoyalty()
        this.item.beneficiaries = this.beneficiaries
        this.updateItem()
      }
    },
    addBeneficiary: function (beneficiary) {
      this.errorMessage = null
      if (!beneficiary || !beneficiary.royalty || !beneficiary.chainAddress) {
        this.$notify({ type: 'error', title: 'Minting Error', text: 'Bad value for beneficiary' })
        return
      }
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1, beneficiary)
      } else {
        if (this.beneficiaries.length === 10) {
          this.$notify({ type: 'error', title: 'Minting Error', text: 'No more beneficiaries allowed' })
        } else {
          this.beneficiaries.push(beneficiary)
        }
      }
      // this.setBaseRoyalty()
      this.item.beneficiaries = this.beneficiaries
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
        this.$notify({ type: 'error', title: 'Minting Error', text: 'Royalties must add up to 100%' })
      }
    },
    updateItem () {
      this.$store.dispatch('rpayMyItemStore/saveItem', this.item)
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
    isMinted () {
      return this.item.contractAsset
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
