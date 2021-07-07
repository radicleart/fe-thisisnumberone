<template>
<section class="" id="section-upload">
  <b-container class="mt-5 pt-5">
    <b-row style="min-height: 40vh" >
      <b-col md="6" sm="12" align-self="start" class=" text-center">
        <div  class="bg-white" style="width:80%;">
          <media-upload :myUploadId="'artworkFile'" :dims="dims" :contentModel="contentModelArtwork" :limit="1" :sizeLimit="20" :mediaTypes="'video'" @updateMedia="updateMedia($event)"/>
        </div>
      </b-col>
      <b-col md="6" sm="12" align-self="end"  class="mb-4 text-white">
        <h1 class="border-bottom mb-5">Upload Item</h1>
        <div>First step to creating your NFT is to upload it here.</div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaUpload from '@/components/utils/MediaUpload'
import utils from '@/services/utils'

export default {
  name: 'UploadItem',
  components: {
    MediaUpload
  },
  data () {
    return {
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
        private: false,
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
        title: 'UPLOAD FILE',
        buttonName: 'CHOOSE A FILE',
        message: 'Main Artwork File',
        iconName: 'film',
        errorMessage: 'A mp4 file is required',
        popoverBody: 'The artwork file.'
      }
    }
  },
  mounted () {
    const assetHash = this.$route.params.assetHash
    if (assetHash) {
      this.assetHash = assetHash
      this.loaded = true
    }
    this.loaded = true
  },
  methods: {
    hasFile (file) {
      if (file === 'artworkFile') return this.attributes.artworkFile && this.attributes.artworkFile.fileUrl
      else if (file === 'artworkClip') return this.attributes.artworkClip && this.attributes.artworkClip.fileUrl
      else if (file === 'coverImage') return this.attributes.coverImage && this.attributes.coverImage.fileUrl
    },
    videoOptions () {
      if (this.assetHash) return
      const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      if (!myAsset) return
      const videoOptions = {
        allowClip: true,
        emitOnHover: true,
        playOnHover: true,
        bigPlayer: false,
        showMeta: true,
        assetHash: this.assetHash,
        autoplay: false,
        muted: true,
        controls: true,
        poster: (myAsset.attributes.coverImage) ? myAsset.attributes.coverImage.fileUrl : null,
        sources: [
          { src: myAsset.attributes.artworkFile.fileUrl, type: myAsset.attributes.artworkFile.type }
        ],
        fluid: false
      }
      return videoOptions
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
        const $self = this
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('myItemStore/saveAttributesObject', { assetHash: data.media.dataHash, attributes: data.media }).then((attributes) => {
          const myAsset = {
            assetHash: data.media.dataHash,
            attributes: {}
          }
          myAsset.attributes[attributes.id] = data.media
          $self.$store.dispatch('myItemStore/saveItem', myAsset).then(() => {
            $self.$store.commit('setModalMessage', 'Saved artwork file.')
            this.$root.$emit('bv::hide::modal', 'waiting-modal')
            $self.$router.push('/edit-item/' + data.media.dataHash)
          }).catch((error) => {
            $self.$store.commit('setModalMessage', 'Error occurred processing file upload.')
            $self.result = error
          })
        })
      }
    },
    updateUploadState: function (data) {
      if (data.change === 'done') {
        this.$router.push('/edit-item/' + this.item.assetHash)
      } else if (data.change === 'up') {
        this.uploadState++
      } else {
        this.uploadState--
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
    },
    uploadItem: function () {
      if (this.item.editions) this.item.editions = parseInt(this.item.editions)
      if (this.doValidate && !this.isValid()) {
        this.$notify({ type: 'error', title: 'Upload Error', text: 'Please enter missing data' })
        return
      }
      this.showWaitingModal = true
      this.$store.commit('setModalMessage', 'Uploading files - can take a while.. <a target="_blank" href="https://radiclesociety.medium.com/radicle-peer-to-peer-marketplaces-whats-the-deal-767960da195b">read why</a>')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('myItemStore/saveItem', { item: this.item, musicFile: this.item.attributes.musicFile[0], coverImage: this.item.attributes.coverImage[0] }).then(() => {
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Uploading... once its saved you\'ll be able to mint this artowrk - registering your ownership on the blockchain. Once registered you\'ll be able to prove you own this artwork and be able to benefit not only from its sale but also from all secondary sales.')
      }).catch((error) => {
        this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
        this.result = error
      })
    }
  },
  computed: {
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
