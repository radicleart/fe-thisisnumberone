<template>
<div v-if="!loading" class="bg-dark d-flex justify-content-center">
  <div class="mx-auto">
    <b-card-group>
      <b-card bg-variant="dark" class="text-white" header-tag="header" footer-tag="footer">
        <template #header>
          <ItemDisplay :item="null" :loopRun="loopRun"/>
        </template>
        <div class="bg-dark mt-0">
          <RoyaltyScreen :hidePrimaries="true" :errorMessage="errorMessage" :item="null" @mintToken="beginMintProcess" :beneficiaries="beneficiaries" v-if="displayCard !== 102"/>
        </div>
      </b-card>
    </b-card-group>
  </div>
</div>

</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RoyaltyScreen from './minting-screens/RoyaltyScreen'
import ItemDisplay from './minting-screens/ItemDisplay'
import utils from '@/services/utils'

export default {
  name: 'MintingCollectionFlow',
  components: {
    RoyaltyScreen,
    ItemDisplay
  },
  props: ['loopRun'],
  data () {
    return {
      imagePath: 'https://res.cloudinary.com/mijo-enterprises/image/upload/v1633523528/collections/artists/artist1/set1/',
      loading: true,
      gaiaAssets: [],
      makerUrlKey: null,
      currentRunKey: null,
      errorMessage: null,
      beneficiaries: null,
      eBen: null,
      submitUrl: '/mesh/v2/stacksmate/square/charge'
    }
  },
  watch: {
    'items' () {
      if (this.fetchedItems) {
        this.uiState = 'ready'
      }
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
      this.setPage()
    })
    this.makerUrlKey = this.$route.params.maker
    this.currentRunKey = this.$route.params.collection
    this.handleResult()
  },
  methods: {
    handleResult () {
      if (window.eventBus && window.eventBus.$on) {
        const $self = this
        window.eventBus.$on('rpayEvent', function (data) {
          if (data.opcode === 'stx-transaction-sent') {
            $self.$bvModal.hide('minting-modal')
            if (data.txStatus === 'success') {
              $self.$notify({ type: 'success', title: 'Tx Sent', text: 'Punks minted and meta data saved to Gaia!' })
            } else if (data.txStatus.indexOf('abort') > -1) {
              const punkIndexes = []
              $self.mintAllocations.forEach((ma) => {
                punkIndexes.push(ma.punkIndex)
              })
              const bean = {
                punkIndexes: punkIndexes,
                currentRunKey: $self.loopRun.currentRunKey
              }
              $self.$store.dispatch('rpayCategoryStore/clearMintAllocations', bean)
              $self.$notify({ type: 'error', title: 'Tx Failed', text: 'Probably a post condition failure - not enough stacks to pay the minting fee?' })
            } else if (data.txStatus.indexOf('replace') > -1) {
              $self.$notify({ type: 'warning', title: 'Tx Replaced', text: 'We may have lost the tx id - if so your token is still safe and will be reconnected once confirmed.' })
            }
          } else if (data.opcode === 'collection-mint-token' || data.opcode === 'collection-mint-token-twenty') {
            $self.gaiaAssets.forEach((ga) => {
              ga.mintInfo = {
                txId: data.txId,
                txStatus: data.txStatus
              }
              $self.saveAsset(ga)
            })
          }
        })
      }
    },
    beginMintProcess: function () {
      // 1. create a mongodb lock the items to be minted (api call - the number locked is determined by the batch size on the collection)
      // 2. create and upload the meta data for each item
      // 3. sign the hash of the first item in the batch (api call to stacksmate endpoint)
      // 4. build the parameters for the mint
      // 5. call rpay modult to build and broadcast transaction via web wallet
      const lockData = { stxAddress: this.profile.stxAddress, currentRunKey: this.currentRunKey }
      this.$store.dispatch('rpayCategoryStore/fetchNextToMint', lockData).then((mintAllocations) => {
        // utils.fetchBase64FromImageUrl(this.imagePath + '1.png', document).then((data) => {
        if (!mintAllocations || mintAllocations.length === 0) {
          this.$notify({ type: 'success', title: 'All Minted', text: 'We hey - no more left - better luck next time!' })
          return
        }
        this.loaded = true
        this.mintAllocations = mintAllocations
        this.mintAllocations.forEach((ma) => {
          this.createMetaData(ma.punkIndex)
        })
        this.$store.dispatch('assetGeneralStore/stacksmateSignme', this.gaiaAssets[0].assetHash).then((signature) => {
          if (this.loopRun.batchSize === 1) {
            this.mintCollectionSingle(this.getData(signature))
          } else {
            this.mintCollectionBatch(this.getData(signature))
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    createMetaData (index) {
      // create but don't store - wait till the last minute to register the batch!
      // see component MintingFlow.vue
      const image = this.imagePath + index + '.png'
      const imgHash = utils.buildHash(image)
      const myAsset = {
        assetHash: imgHash,
        attributes: {
          artworkFile: {
            type: 'image/png',
            fileUrl: image,
            ratio: '1:1'
          }
        },
        cryptoPunk: true,
        image: image,
        name: index
      }
      myAsset.currentRunKey = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
      myAsset.contractId = this.loopRun.contractId
      let assetPath = myAsset.assetHash + '.json'
      if (myAsset.currentRunKey) {
        assetPath = myAsset.currentRunKey + '/' + myAsset.assetHash + '.json'
      }
      myAsset.metaDataUrl = this.profile.gaiaHubConfig.url_prefix + this.profile.gaiaHubConfig.address + '/' + assetPath
      this.gaiaAssets.push(myAsset)
      // this.saveAsset()
    },
    saveAsset (gaiaAsset) {
      this.$store.dispatch('rpayMyItemStore/saveItem', gaiaAsset).then(() => {
        // this.$notify({ type: 'success', title: 'Meta Data', text: 'Meta data saved to users gaia hub! ' + gaiaAsset.assetHash })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Upload File', text: 'Collision - please reload to check for next available item!' })
        this.errored = true
      })
    },
    mintCollectionSingle: function (data) {
      this.$store.dispatch('rpayPurchaseStore/mintCollectionSingle', data).then((result) => {
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
    mintCollectionBatch: function (data) {
      this.$store.dispatch('rpayPurchaseStore/mintCollectionBatch', data).then((result) => {
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
    getData (signature) {
      // (define-public (collection-mint-token        (signature (buff 65)) (message-hash (buff 32)) (asset-hash (buff 32)) (metaDataUrl (buff 200)) (maxEditions uint) (editionCost uint) (clientMintPrice uint) (buyNowPrice uint))
      // (define-public (collection-mint-token-twenty (signature (buff 65)) (message-hash (buff 32)) (hashes (list 20 (buff 32))) (meta-urls (list 20 (buff 200))) (maxEditions uint) (editionCost uint) (clientMintPrice uint) (buyNowPrice uint))
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      let mintPrice = application.tokenContract.mintPrice
      const defaultMintPrice = Number(process.env.VUE_APP_DEFAULT_MINT_PRICE)
      mintPrice = Math.max(application.tokenContract.mintPrice, defaultMintPrice)
      if (!this.gaiaAssets[0].attributes.buyNowPrice) this.gaiaAssets[0].attributes.buyNowPrice = 0
      const hashOfMessage = utils.buildHash(this.gaiaAssets[0].assetHash)
      const data = {
        message: hashOfMessage,
        sig: signature,
        editions: (this.gaiaAssets[0].editions) ? this.gaiaAssets[0].editions : 1,
        editionCost: (this.gaiaAssets[0].editionCost) ? this.gaiaAssets[0].editionCost : 0,
        buyNowPrice: this.gaiaAssets[0].attributes.buyNowPrice,
        mintPrice: mintPrice,
        owner: profile.stxAddress,
        sendAsSky: true, // only applicable in local
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: this.loopRun.contractId.split('.')[1]
      }
      if (this.gaiaAssets.length > 1) {
        const twenties = []
        this.gaiaAssets.forEach((o) => {
          twenties.push({
            assetHash: o.assetHash,
            metaDataUrl: o.metaDataUrl
          })
        })
        data.twenties = twenties
        data.functionName = 'collection-mint-token-twenty'
      } else {
        data.assetHash = this.gaiaAssets[0].assetHash
        data.metaDataUrl = this.gaiaAssets[0].metaDataUrl
        data.functionName = 'collection-mint-token'
      }
      return data
    },
    updateItem () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.gaiaAssets[0].assetHash)
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
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    isMinted () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.gaiaAssets[0].assetHash)
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
