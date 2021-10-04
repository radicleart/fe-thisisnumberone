<template>
<div v-if="!loading" class="bg-dark d-flex justify-content-center">
  <div class="mx-auto">
    <b-card-group>
      <b-card bg-variant="dark" class="text-white" header-tag="header" footer-tag="footer">
        <template #header>
          <ItemDisplay :item="item"/>
        </template>
        <div class="mt-0">
          <RoyaltyScreen :errorMessage="errorMessage" :item="item" @mintToken="mintToken" @editBeneficiary="editBeneficiary" @removeBeneficiary="removeBeneficiary" @updateBeneficiary="updateBeneficiary" @addNewBeneficiary="addNewBeneficiary" :beneficiaries="beneficiaries" v-if="displayCard !== 102"/>
          <AddBeneficiaryScreen :errorMessage="errorMessage" :eBen="eBen" @addBeneficiary="addBeneficiary" :beneficiaries="beneficiaries" :item="item" v-if="displayCard === 102"/>
        </div>
      </b-card>
    </b-card-group>
  </div>
</div>

</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RoyaltyScreen from './minting-screens/RoyaltyScreen'
import AddBeneficiaryScreen from './minting-screens/AddBeneficiaryScreen'
import ItemDisplay from './minting-screens/ItemDisplay'

export default {
  name: 'MintingFlow',
  components: {
    RoyaltyScreen,
    ItemDisplay,
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
    this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 100)
    const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
    const configuration = this.$store.getters['rpayStore/getConfiguration']
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    configuration.minter.beneficiaries[1].chainAddress = profile.stxAddress
    configuration.minter.beneficiaries[1].username = profile.username
    item.beneficiaries = configuration.minter.beneficiaries
    this.beneficiaries = item.beneficiaries
    if (!item.beneficiaries) {
      this.beneficiaries = item.beneficiaries
    }
    this.setPage()
  },
  methods: {
    mintToken: function () {
      // this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      // the post condition applies to the address the funds are going to not from!!!
      // when minting the funds go to the contract admin.
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.item.assetHash)
      if (contractAsset) {
        return
      }
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      let contractName = process.env.VUE_APP_STACKS_CONTRACT_NAME
      if (process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT) {
        contractName = process.env.VUE_APP_STACKS_CONTRACT_NAME_NEXT
      }
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      const data = {
        mintingFee: application.tokenContract.mintPrice,
        owner: profile.stxAddress, // process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        assetHash: this.item.assetHash,
        metaDataUrl: this.item.metaDataUrl,
        beneficiaries: this.item.beneficiaries || [],
        editions: (this.item.editions) ? this.item.editions : 1,
        editionCost: (this.item.editionCost) ? this.item.editionCost : 0,
        sendAsSky: true, // only applicable in local
        contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
        contractName: contractName,
        functionName: 'mint-token'
      }
      this.$store.dispatch('rpayPurchaseStore/mintTokenV2', data).then((result) => {
        const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](result.assetHash)
        if (result.txId) {
          item.mintInfo = {
            txId: result.txId,
            txStatus: result.txStatus,
            timestamp: result.timestamp
          }
          this.$store.dispatch('rpayMyItemStore/quickSaveItem', item).then((item) => {
            this.$emit('update', item)
          })
        }
      }).catch((err) => {
        this.errorMessage = 'Minting error: ' + err
      })
    },
    addNewBeneficiary: function () {
      this.eBen = null
      this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 102)
    },
    editBeneficiary: function (beneficiary) {
      this.eBen = beneficiary
      this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 102)
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
      // if (beneficiary.chainAddress === this.beneficiaries[0].chainAddress) {
      //  this.errorMessage = 'Can not have the same address as owner!'
      //  return
      // }
      // this.beneficiaries[0].royalty = this.beneficiaries[0].royalty - beneficiary.royalty
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
      // this.setBaseRoyalty()
      this.updateItem()
      this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 100)
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
      this.$store.dispatch('rpayMyItemStore/saveItem', item).then((item) => {
        this.beneficiaries = item.beneficiaries
      })
    },
    setPage () {
      this.loading = false
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      if (!displayCard) {
        this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 100)
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
