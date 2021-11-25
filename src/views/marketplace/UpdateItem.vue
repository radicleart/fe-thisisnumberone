<template>
<section id="section-upload">
  <b-container v-if="item" class="mt-5 pt-5 text-white">
    <b-row v-if="hasFile('coverImage')">
      <b-col class="" md="8" sm="12" align-self="start">
        <h2 class="mb-4"><span style="margin-bottom: 20px; font-size: 3.2rem;">NFT Info</span></h2>
        <div class="my-4 bg-danger p-3" v-if="invalidItems.length > 0 && showErrors">
          <div>Required fields:</div>
          <div class="mr-1" v-for="(field, index) in invalidItems" :key="index">{{field}}</div>
        </div>
        <div>
          <ChooseCollection :type="'traditional'" :runKey="runKey" @updateCollection="updateCollection"/>
        </div>
        <div>
          <ItemFormPart1 v-if="uploadState > 2" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <ItemFormPart2 v-if="uploadState > 3" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
        </div>
        <div class="my-4 bg-danger p-3" v-if="invalidItems.length > 0 && showErrors">
          <div>Required fields:</div>
          <div class="mr-1 text-white" v-for="(field, index) in invalidItems" :key="index">{{field}}</div>
        </div>
        <div class="my-4 text-right"><b-button class="" variant="warning" @click.prevent="uploadItem()">Continue</b-button></div>
      </b-col>
      <b-col md="4" sm="12" >
        <NftCoverImage :item="item" :displayHeader="false"/>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col md="6" offset-md="3" sm="12" align-self="start" class="text-center">
        <NftCoverImage :item="item" :displayHeader="true" />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import NftCoverImage from '@/views/marketplace/components/update/NftCoverImage'
import ItemFormPart1 from '@/views/marketplace/components/update/ItemFormPart1'
import ItemFormPart2 from '@/views/marketplace/components/update/ItemFormPart2'
import utils from '@/services/utils'
import ChooseCollection from '@/views/marketplace/components/toolkit/ChooseCollection'

export default {
  name: 'UpdateItem',
  components: {
    NftCoverImage,
    ItemFormPart1,
    ItemFormPart2,
    ChooseCollection
  },
  data () {
    return {
      showAFUpload: false,
      requireClip: false,
      formSubmitted: false,
      dims: { width: 360, height: 202 },
      showErrors: false,
      loopRun: null,
      componentKey: 0,
      uploadState: 10,
      loaded: false,
      result: 'Saving data to your storage - back in a mo!',
      assetHash: null,
      item: null,
      contentModelArtwork: {
        id: 'artworkFile',
        title: 'UPLOAD NFT FILE',
        buttonName: 'CHOOSE A FILE',
        message: 'Your NFT File',
        iconName: 'film',
        errorMessage: 'An image / audio / video / gltf file is required',
        popoverBody: 'The main NFT file.'
      },
      contentModelCoverImage: {
        id: 'coverImage',
        title: 'Cover Image<br/>up to 1M',
        buttonName: 'Choose Cover Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelClip: {
        id: 'artworkClip',
        title: 'Artwork Clip (up to 2M)<br/>up to 2M',
        buttonName: 'Choose Movie Clip',
        iconName: 'film',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      doValidate: true,
      defaultBadge: require('@/assets/img/risidio_white.png')
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpayMyItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      // this.uploadState++
      if (!item) {
        this.$router.push('/my-nfts/' + this.loopRun.currentRunKey)
        return
      }
      this.item = item
      this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.runKey).then((loopRun) => {
        this.loopRun = loopRun
        this.loaded = true
      })
    })
  },
  methods: {
    updateCollection (data) {
      this.loopRun = data.loopRun
    },
    hasFile (file) {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      if (!item || !item.attributes) return
      if (file === 'artworkFile') return item.attributes.artworkFile && item.attributes.artworkFile.fileUrl
      else if (file === 'artworkClip') return item.attributes.artworkClip && item.attributes.artworkClip.fileUrl
      else if (file === 'coverImage') return item.attributes.coverImage && item.attributes.coverImage.fileUrl
    },
    mediaFilesArtworkFile () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      if (!item) return
      const files = []
      if (item.attributes.artworkFile && item.attributes.artworkFile.dataUrl) {
        files.push(item.attributes.artworkFile)
      }
      return files
    },
    deleteMediaItem: function (mediaId) {
      this.$store.dispatch('rpayMyItemStore/deleteMediaItem', { item: this.item, id: mediaId }).then(() => {
        this.$emit('delete-cover')
      })
    },
    updateUploadState: function (data) {
      this.$store.dispatch('rpayMyItemStore/saveItem', this.item).then(() => {
        this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
        if (data.change === 'done') {
          this.$router.push(this.itemPreviewUrl)
        } else if (data.change === 'up') {
          this.uploadState++
        } else {
          this.uploadState--
        }
      })
    },
    updateMedia: function (data) {
      if (data.startLoad) {
        this.$store.commit('setModalMessage', data.startLoad)
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      } else if (data.errorMessage) {
        this.$store.commit('setModalMessage', data.errorMessage)
      } else if (data.media && data.media.dataHash) {
        const $self = this
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: this.assetHash, attributes: data.media }).then((attributes) => {
          const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
          myAsset.attributes[attributes.id] = attributes
          myAsset.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
          myAsset.projectId = this.loopRun.contractId
          $self.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((item) => {
            $self.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
            $self.item = item
            $self.$store.commit('setModalMessage', '')
            $self.$root.$emit('bv::hide::modal', 'waiting-modal')
            $self.componentKey++
          }).catch((error) => {
            $self.$store.commit('setModalMessage', 'Error occurred processing file upload.')
            $self.result = error
          })
        })
      }
    },
    setImage (trialImage) {
      if (!trialImage) {
        trialImage = this.defaultBadge
      }
      const $self = this
      utils.fetchBase64FromImageUrl(trialImage, document).then((data) => {
        $self.files = [{
          dataUrl: data.dataURL
        }]
      })
    },
    contextTitle: function () {
      if (this.uploadState === 1) return 'Upload your music'
      else if (this.uploadState === 2) return 'Add cover art'
      else if (this.uploadState === 3) return 'Help people find it..'
    },
    uploadItem: function () {
      this.showErrors = false
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      if (this.item.attributes.editions) {
        this.item.attributes.editions = parseInt(this.item.attributes.editions)
      } else {
        this.item.attributes.editions = 10
      }
      if (this.doValidate && invalidItems.length > 0) {
        this.showErrors = true
        this.$notify({ type: 'error', title: 'Upload Error', text: 'Please enter missing data' })
        return
      }
      this.showWaitingModal = true
      this.$store.commit('setModalMessage', 'Uploading... once its saved you\'ll be able to mint this artwork - registering your ownership on the blockchain. Once registered you\'ll be able to prove you own it and be able to benefit from sales and from secondary sales.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.item.projectId = this.loopRun.contractId
      if (this.overrideLoopRun) {
        this.item.attributes.collection = this.overrideLoopRun.currentRunKey + '/' + this.overrideLoopRun.makerUrlKey
      } else {
        this.item.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
      }
      this.$store.dispatch('rpayMyItemStore/saveItem', this.item).then(() => {
        this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::hide::modal', 'success-modal')
        this.$store.commit('setModalMessage', '')
        this.$router.push(this.itemPreviewUrl)
      }).catch((error) => {
        this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
        this.result = error
      })
    }
  },
  computed: {
    runKey () {
      const defaultLoopRun = process.env.VUE_APP_DEFAULT_LOOP_RUN
      let runKey = (this.item && this.item.attributes.collection) ? this.item.attributes.collection : defaultLoopRun
      if (runKey.indexOf('/') > -1) {
        runKey = runKey.split('/')[0]
      }
      return runKey
    },
    itemPreviewUrl () {
      let edition = 0
      if (this.item.contractAsset) {
        edition = this.item.contractAsset.tokenInfo.edition
      }
      return '/item-preview/' + this.item.assetHash + '/' + edition
    },
    superAdmin: function () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.superAdmin
    },
    myAsset: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    invalidItems: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems
    },
    itemSummary () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return {
        uploadState: this.uploadState,
        displayTitle: 'Preview',
        item: this.item,
        isValid: invalidItems.length === 0,
        context: 'upload'
      }
    }
  }
}
</script>
<style lang="scss" >
#upload-item .drop-zone {
  min-width: 300px;
  min-height: 300px;
  padding: 20px;
  height: auto;
  border-radius: 18px;
  border: 1pt dashed rgb(146, 146, 38);
  text-align: center;
}
#upload-item .badge {
  cursor: pointer;
  padding: 5px !important;
}
</style>
