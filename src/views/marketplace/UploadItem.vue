<template>
<section class="" id="section-upload">
  <b-container class="mt-5 pt-5 text-white">
    <b-row>
      <b-col md="6" offset-md="3" sm="12" align-self="start" class="">
        <ChooseCollection :type="'traditional'" @updateCollection="updateCollection"/>
      </b-col>
    </b-row>
    <b-row v-if="loopRun">
      <b-col md="6" offset-md="3" sm="12" align-self="start" class=" text-center">
        <MediaUpload :hideLinkPaste="true" :myUploadId="'artworkFile'" :dims="dims" :contentModel="contentModelArtwork" :limit="1" :sizeLimit="20" :mediaTypes="'video,image,threed,audio,pdf'" @updateMedia="updateMedia($event)"/>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaUpload from '@/views/marketplace/components/update/MediaUpload'
import ChooseCollection from '@/views/marketplace/components/toolkit/ChooseCollection'
import utils from '@/services/utils'

export default {
  name: 'UploadItem',
  components: {
    MediaUpload,
    ChooseCollection
  },
  data () {
    return {
      loopRun: null,
      formSubmitted: false,
      dims: { width: 360, height: 202 },
      componentKey: 0,
      uploadState: 0,
      showHash: false,
      loading: true,
      itemUUID: null,
      loaded: false,
      item: {
        owner: null,
        coverArtist: null,
        privacy: 'public',
        name: '',
        description: '',
        editions: null,
        keywords: '',
        attributes: {}
      },
      result: 'Saving data to your storage - back in a mo!',
      doValidate: true,
      defaultBadge: require('@/assets/img/risidio_white.png'),
      defaultBadgeData: null,
      contentModelArtwork: {
        id: 'artworkFile',
        title: 'Upload a new item',
        buttonName: 'choose a file',
        message: 'Drop your NFT file',
        iconName: 'file-earmark-arrow-down',
        errorMessage: 'A mp4 file is required',
        popoverBody: 'The NFT file.'
      }
    }
  },
  mounted () {
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    if (!profile.loggedIn) this.$router.push('/')
    const assetHash = this.$route.params.assetHash
    if (assetHash) {
      this.assetHash = assetHash
      this.loaded = true
    }
    this.loaded = true
  },
  methods: {
    updateCollection (data) {
      this.loopRun = data.loopRun
    },
    hasFile (file) {
      if (file === 'artworkFile') return this.attributes.artworkFile && this.attributes.artworkFile.fileUrl
      else if (file === 'artworkClip') return this.attributes.artworkClip && this.attributes.artworkClip.fileUrl
      else if (file === 'coverImage') return this.attributes.coverImage && this.attributes.coverImage.fileUrl
    },
    setHandler: function (data) {
      this.handler = data.handler
      this.uploadState = 1
    },
    updateMedia: function (data) {
      if (data.startLoad) {
        this.$store.commit('setModalMessage', data.startLoad)
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      } else if (data.errorMessage) {
        this.$store.commit('setModalMessage', data.errorMessage)
      }
      if (data.media && data.media.dataHash) {
        if (!data.media.id === 'artworkFile') {
          throw new Error('not allowed - use UpdatItem instead')
        }
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: data.media.dataHash, attributes: data.media }).then((attributes) => {
          const myAsset = {
            assetHash: data.media.dataHash,
            attributes: {}
          }
          myAsset.attributes[attributes.id] = data.media
          if (data.media.type.indexOf('image') > -1) {
            myAsset.attributes.coverImage = data.media
          }
          myAsset.projectId = this.loopRun.contractId
          myAsset.attributes.collection = this.loopRun.currentRunKey + '/' + this.loopRun.makerUrlKey
          myAsset.attributes.editions = 10
          myAsset.attributes.editionCost = 10
          this.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then(() => {
            this.$store.dispatch('rpayMyItemStore/saveRootFileOnce')
            this.$store.commit('setModalMessage', 'Saved NFT file.')
            this.$root.$emit('bv::hide::modal', 'waiting-modal')
            this.$router.push('/edit-item/' + data.media.dataHash)
          }).catch((error) => {
            this.$store.commit('setModalMessage', 'Error occurred processing file upload.')
            this.result = error
          })
        })
      }
    },
    isValid: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems.length === 0
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
      if (this.uploadState === 0) return 'Upload artwork'
      else if (this.uploadState === 1) return 'Upload your music'
      else if (this.uploadState === 2) return 'Add cover art'
      else if (this.uploadState === 3) return 'Help people find it..'
    }
  },
  computed: {
    /**
    loopRun () {
      const loopRun = this.$store.getters[APP_CONSTANTS.GET_LOOP_RUN_BY_KEY](this.runKey)
      return loopRun
    },
    runKey () {
      const defaultLoopRun = process.env.VUE_APP_DEFAULT_LOOP_RUN
      let runKey = (this.item && this.item.attributes.collection) ? this.item.attributes.collection : defaultLoopRun
      if (runKey.indexOf('/') > -1) {
        runKey = runKey.split('/')[0]
      }
      return runKey
    },
    **/
    myAsset: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      return item
    },
    itemSummary () {
      return {
        uploadState: this.uploadState,
        displayTitle: 'Preview',
        item: this.item,
        isValid: this.isValid(),
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
