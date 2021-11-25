<template>
<div v-if="!loading" class="bg-dark d-flex justify-content-center">
  <div class="mx-auto">
    <b-card-group>
      <b-card bg-variant="dark" class="border-white text-white" header-tag="header" footer-tag="footer">
        <template #header>
        </template>
        <b-row class="">
          <b-col cols="4" class="px-5">
            <ItemDisplay :item="null" :loopRun="loopRun"/>
          </b-col>
          <b-col cols="8" class="px-5">
            <div class="bg-dark mt-0">
              <RoyaltyScreen :hidePrimaries="true" :mintButtonText="mintButtonText()" :errorMessage="errorMessage" :item="null" @mintToken="beginMintProcess" :loopRun="loopRun" v-if="displayCard !== 102"/>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-card-group>
  </div>
  <b-modal scrollable id="upload-modal" title="">
    <div class="row">
      <div class="col-12 my-1">
        <h2>Uploading Assets</h2>
        <div class="">Uploading ({{gaiaed}}) assets to your decentralised data store</div>
        <div class="text-center mt-2"><b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon></div>
      </div>
    </div>
    <template v-slot:modal-footer>
      <div></div>
    </template>
  </b-modal>
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
  props: ['loopRun', 'batchOption'],
  data () {
    return {
      loading: true,
      gaiaAssets: [],
      makerUrlKey: null,
      mintAllocations: [],
      currentRunKey: null,
      errorMessage: null,
      beneficiaries: null,
      eBen: null,
      gaiaed: 0,
      submitUrl: '/mesh/v2/stacksmate/square/charge'
    }
  },
  watch: {
    'gaiaed' () {
      if (this.gaiaed === this.mintAllocations.length) {
        this.gaiaUploadComplete()
        // this.$bvModal.hide('upload-modal')
        this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
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
    mintButtonText () {
      return 'Mint ' + this.batchOption + ' Now'
    },
    handleResult () {
      if (window.eventBus && window.eventBus.$on) {
        const $self = this
        window.eventBus.$on('rpayEvent', function (data) {
          if (data.opcode === 'stx-transaction-sent') {
            $self.$bvModal.hide('minting-modal')
            if (data.txStatus.indexOf('abort') > -1) {
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
      const lockData = { batchOption: this.batchOption, stxAddress: this.profile.stxAddress, currentRunKey: this.currentRunKey }
      this.$store.dispatch('rpayCategoryStore/fetchNextToMint', lockData).then((mintAllocations) => {
        if (!mintAllocations || mintAllocations.length === 0) {
          this.$notify({ type: 'success', title: 'All Minted', text: 'Wey hey - no more left - better luck next time!' })
          return
        }
        this.loaded = true
        this.mintAllocations = mintAllocations
        // this.$bvModal.show('upload-modal')
        this.mintAllocations.forEach((ma) => {
          this.createMetaData(ma.punkIndex)
        })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Minting', text: 'Server error callng mint - please try later!' })
      })
    },
    gaiaUploadComplete () {
      this.$store.dispatch('rpayPurchaseStore/stacksmateSignme', this.gaiaAssets[0].assetHash).then((signature) => {
        if (this.batchOption === 1) {
          this.mintCollectionSingle(this.getData(signature))
        } else {
          this.mintCollectionBatch(this.getData(signature))
        }
      })
    },
    updateMetaData (data) {
      this.mintAllocations.forEach((ma) => {
        const ga = this.gaiaAssets.find((o) => o.image.indexOf('/' + ma.punkIndex + '.png'))
        ma.txId = data.txId
        ma.status = (data.txStatus) ? data.txStatus : 'pending'
        ma.assetHash = ga.assetHash
      })
      this.$store.dispatch('rpayCategoryStore/updateMintAllocations', this.mintAllocations)

      this.gaiaAssets.forEach((ga) => {
        ga.mintInfo = {
          txId: data.txId,
          txStatus: (data.txStatus) ? data.txStatus : 'pending'
        }
        this.saveAssetWithMintTxId(ga)
      })
    },
    createMetaData (index) {
      const artworkFile = {
        type: 'image/png',
        fileUrl: this.loopRun.mintImage3,
        id: 'artworkFile',
        ratio: '1:1'
      }
      const myAsset = {
        attributes: {
          buyNowPrice: 0,
          editions: 1,
          editionCost: 0,
          index: index,
          artworkFile: artworkFile
        },
        cryptoPunk: true,
        image: this.loopRun.mintImage3,
        name: index
      }
      myAsset.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
      myAsset.projectId = this.loopRun.contractId
      let assetPath = myAsset.assetHash + '.json'
      if (myAsset.attributes.collection) {
        assetPath = myAsset.attributes.collection + '/' + index + '.json'
      }
      if (!this.profile.gaiaHubConfig) {
        location.reload()
      }
      myAsset.metaDataUrl = this.profile.gaiaHubConfig.url_prefix + this.profile.gaiaHubConfig.address + '/' + assetPath
      this.buildAssetHash(myAsset)
      this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((item) => {
        this.gaiaed++
        this.gaiaAssets.push(item)
      }).catch((error) => {
        this.$notify({ type: 'error', title: 'Save Data', text: 'Error save meta data file to gaia!' })
        this.result = error
      })
    },
    buildAssetHash (myAsset) {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.loopRun.contractId)
      let mintPrice = application.tokenContract.mintPrice
      const defaultMintPrice = Number(process.env.VUE_APP_DEFAULT_MINT_PRICE)
      mintPrice = Math.max(application.tokenContract.mintPrice, defaultMintPrice)
      const editions = myAsset.attributes.editions
      const editionCost = myAsset.attributes.editionCost
      const buyNowPrice = myAsset.attributes.buyNowPrice
      const hashish = myAsset.image + myAsset.metaDataUrl + mintPrice + editions + editionCost + buyNowPrice
      myAsset.assetHash = utils.buildHash(hashish)
    },
    saveAssetWithMintTxId (gaiaAsset) {
      this.$store.dispatch('rpayMyItemStore/saveItem', gaiaAsset).then(() => {
        // this.$notify({ type: 'success', title: 'Meta Data', text: 'Meta data saved to users gaia hub! ' + gaiaAsset.assetHash })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Upload File', text: 'Collision - please reload to check for next available item!' })
        this.errored = true
      })
    },
    mintCollectionSingle: function (data) {
      this.$store.dispatch('rpayPurchaseStore/mintCollectionSingle', data).then((result) => {
        this.updateMetaData(result)
      }).catch(() => {
        this.$store.dispatch('rpayCategoryStore/updateMintAllocations', this.mintAllocations)
      })
    },
    mintCollectionBatch: function (data) {
      this.$store.dispatch('rpayPurchaseStore/mintCollectionBatch', data).then((result) => {
        this.updateMetaData(result)
      }).catch(() => {
        this.$store.dispatch('rpayCategoryStore/updateMintAllocations', this.mintAllocations)
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
        editions: this.gaiaAssets[0].attributes.editions,
        editionCost: this.gaiaAssets[0].attributes.editionCost,
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
