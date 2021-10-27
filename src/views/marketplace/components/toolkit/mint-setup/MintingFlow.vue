<template>
<div v-if="!loading" class="bg-dark d-flex justify-content-center">
  <div class="mx-auto">
    <b-card-group>
      <b-card bg-variant="dark" class="text-white" header-tag="header" footer-tag="footer">
        <template #header>
          <ItemDisplay :item="item" :loopRun="loopRun"/>
        </template>
        <div class="bg-dark mt-0">
          <RoyaltyScreen :errorMessage="errorMessage" :item="item" @mintToken="mintTwentyTokens" @editBeneficiary="editBeneficiary" @removeBeneficiary="removeBeneficiary" @updateBeneficiary="updateBeneficiary" @addNewBeneficiary="addNewBeneficiary" :beneficiaries="beneficiaries" v-if="displayCard !== 102"/>
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
import utils from '@/services/utils'

export default {
  name: 'MintingFlow',
  components: {
    RoyaltyScreen,
    ItemDisplay,
    AddBeneficiaryScreen
  },
  props: ['items', 'loopRun', 'mintAllocations'],
  data () {
    return {
      loading: true,
      errorMessage: null,
      beneficiaries: null,
      eBen: null,
      submitUrl: '/mesh/v2/stacksmate/square/charge'
    }
  },
  mounted () {
    this.$store.dispatch('rpayCategoryStore/fetchRoyalties', this.loopRun.currentRunKey).then((royalties) => {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      this.minteficaries = royalties.mintRoyalties
      this.beneficiaries = royalties.saleRoyalties
      this.beneficiaries[1].chainAddress = profile.stxAddress
      this.beneficiaries[1].username = profile.username

      this.$store.commit(APP_CONSTANTS.SET_DISPLAY_CARD, 100)

      // const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.items[0].assetHash)
      // const configuration = this.$store.getters['rpayStore/getConfiguration']
      // configuration.minter.beneficiaries[1].chainAddress = profile.stxAddress
      // configuration.minter.beneficiaries[1].username = profile.username
      // item.beneficiaries = configuration.minter.beneficiaries
      // this.beneficiaries = item.beneficiaries
      // if (!item.beneficiaries) {
      // this.beneficiaries = item.beneficiaries
      // }
      this.setPage()
    })
  },
  methods: {
    mintToken: function () {
      // this.errorMessage = 'Minting non fungible token - takes a minute or so..'
      // the post condition applies to the address the funds are going to not from!!!
      // when minting the funds go to the contract admin.
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.items[0].assetHash)
      if (contractAsset) {
        return
      }
      /**
      const keys1 = {
        privateKey: '0f441228ec966d9e28ae75a4559a25f77d25b2752db6dedc7c67acb7881be61b',
        publicKey: '0242dc3e6bb59ed05a5f71c97af420b4cc4c732d022c9e2b265ef3df92947de0b2',
        // publicKey: '036ecd3dc600fd37287f5aef4750d72c0731ee9607a959f64a1ab7d5de6dad26d0',
        address: '16f9wH7uao2aficu7BkciEjFoKuJm83j8o',
        asssetHash: this.items[0].assetHash
      }
      dooguns
      const keys1 = {
        address: '148h5pkD5QbA3h64u9SWJD9FaB5qMBbD6t',
        publicKey: '02815c03f6d7181332afb1b0114f5a1c97286b6092957910ae3fab4006598aee1b',
        sig: 'aef4558084f7166870b6354212299aeddb29fa21445d2af53da96c34566bb6484b4de74ddf589f73dc788d9ff74bd42dfcd1bceeaec2a2199d97edf2924e8e5500',
        ahash: '46295599467141f4f02cecc97cfd576067407a4f904f798674780601a1319c6c'
      }
      **/
      // const hashOfMessage = utils.sha256(this.items[0].assetHash)
      const hashOfMessage = utils.buildHash(this.items[0].assetHash)
      // const sig = utils.signPayloadEC(this.items[0].assetHash, keys1.privateKey)
      this.$store.dispatch('assetGeneralStore/stacksmateSignme', this.items[0].assetHash).then((signature) => {
        const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
        const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
        let mintPrice = application.tokenContract.mintPrice
        const defaultMintPrice = Number(process.env.VUE_APP_DEFAULT_MINT_PRICE)
        mintPrice = Math.max(application.tokenContract.mintPrice, defaultMintPrice)
        if (!this.items[0].attributes.buyNowPrice) this.items[0].attributes.buyNowPrice = 0
        const data = {
          // message: keys1.publicKey,
          message: hashOfMessage,
          sig: signature,
          buyNowPrice: this.items[0].attributes.buyNowPrice,
          mintPrice: mintPrice,
          owner: profile.stxAddress,
          assetHash: this.items[0].assetHash,
          metaDataUrl: this.items[0].metaDataUrl,
          minteficaries: this.minteficaries,
          beneficiaries: this.beneficiaries || [],
          editions: (this.items[0].editions) ? this.items[0].editions : 1,
          editionCost: (this.items[0].editionCost) ? this.items[0].editionCost : 0,
          sendAsSky: true, // only applicable in local
          contractAddress: this.loopRun.contractId.split('.')[0],
          contractName: this.loopRun.contractId.split('.')[1],
          functionName: 'mint-token'
        }
        this.$store.dispatch('rpayPurchaseStore/mintTokenV3', data).then((result) => {
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
      })
      // const keys2 = utils.makeKeys()
      // if (keys1) return
      // this.sig = utils.signPayloadEC(message, keys.privateKey)
    },
    mintTwentyTokens: function () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.items[0].assetHash)
      if (contractAsset) {
        return
      }
      if (!this.loopRun.batchMode || !this.mintAllocations || this.loopRun.batchSize === 1) {
        this.mintToken()
        return
      }
      const endPointer = this.loopRun.batchPointer + this.loopRun.batchSize
      this.loopRun.batchPointer = endPointer
      const bean = { loopRun: this.loopRun, mintAllocations: this.mintAllocations }
      this.$store.dispatch('rpayCategoryStore/updateLoopRunAndAllocations', bean).then(() => {
        this.$notify({ type: 'success', title: 'Meta Data', text: 'Meta data created and uploaded!' })
        this.callWallet()
      }).catch(() => {
        this.$notify({ type: 'warning', title: 'Mint Race', text: 'Someone beat you to this one - try again?' })
      })
    },
    callWallet () {
      if (this.loopRun.batchSize === 1) {
        this.mintToken()
        return
      }
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      let mintPrice = application.tokenContract.mintPrice
      if (this.items[0].attributes.mintPrice) {
        mintPrice = Math.max(application.tokenContract.mintPrice, this.items[0].attributes.mintPrice)
      }
      const twenties = []
      this.items.forEach((o) => {
        twenties.push({
          assetHash: o.assetHash,
          metaDataUrl: o.metaDataUrl
        })
      })
      const data = {
        buyNowPrice: this.items[0].attributes.buyNowPrice,
        mintPrice: mintPrice,
        twenties: twenties,
        owner: profile.stxAddress,
        minteficaries: this.minteficaries,
        beneficiaries: this.beneficiaries || [],
        editions: (this.items[0].editions) ? this.items[0].editions : 1,
        editionCost: (this.items[0].editionCost) ? this.items[0].editionCost : 0,
        sendAsSky: true, // only applicable in local
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: this.loopRun.contractId.split('.')[1],
        functionName: 'mint-token-twenty'
      }
      this.$store.dispatch('rpayPurchaseStore/mintTwentyTokens', data).then((result) => {
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
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.items[0].assetHash)
      item.contractId = this.loopRun.contractId
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
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.items[0].assetHash)
      return item
    },
    isMinted () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.items[0].assetHash)
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
