<template>
<div class="d-flex justify-content-center" v-if="!loading">
  <div class="mx-auto">
    <royalty-screen :errorMessage="errorMessage" :item="item" @editBeneficiary="editBeneficiary" @removeBeneficiary="removeBeneficiary" @updateBeneficiary="updateBeneficiary" @addNewBeneficiary="addNewBeneficiary" :beneficiaries="beneficiaries" v-if="!isMinted && displayCard === 100"/>
    <add-beneficiary-screen :eBen="eBen" @addBeneficiary="addBeneficiary" :beneficiaries="beneficiaries" :item="item" v-if="!isMinted && displayCard === 102"/>
    <pending-screen :item="item" v-if="!isMinted && displayCard === 104"/>
    <success-screen :item="item" v-if="isMinted || displayCard === 106"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SuccessScreen from './minting-screens/SuccessScreen'
import PendingScreen from './minting-screens/PendingScreen'
import RoyaltyScreen from './minting-screens/RoyaltyScreen'
import AddBeneficiaryScreen from './minting-screens/AddBeneficiaryScreen'

export default {
  name: 'MintingFlow',
  components: {
    RoyaltyScreen,
    PendingScreen,
    SuccessScreen,
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
    this.setPage()
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    this.beneficiaries = [
      {
        username: profile.username,
        role: 'Owner',
        owner: true,
        email: profile.username,
        royalty: 100,
        chainAddress: profile.stxAddress
      }
    ]
    const $self = this
    window.eventBus.$on('rpayEvent', function (data) {
      if (data.opcode.indexOf('-mint-success') > -1) {
        $self.$store.commit('rpayStore/setDisplayCard', 106)
      }
    })
  },
  methods: {
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
      }
    },
    updateBeneficiary: function (beneficiary) {
      const index = this.beneficiaries.findIndex((obj) => obj.chainAddress === beneficiary.chainAddress)
      if (index > -1) {
        this.beneficiaries.splice(index, 1, beneficiary)
      }
    },
    addBeneficiary: function (beneficiary) {
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
