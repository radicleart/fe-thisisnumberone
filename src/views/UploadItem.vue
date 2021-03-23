<template>
<div id="upload-item" class="mb-5 pb-5 container" v-if="loaded">
  <div class="" :key="componentKey">
    <div class="row mt-4">
      <div class="col-md-6 col-sm-12">
        <h4>{{contextTitle()}}</h4>
        <item-form-nav :item="item" @upload-state="updateUploadState" :uploadState="uploadState"/>
        <div class="drop-zone" v-if="uploadState === 1">
          <media-upload class="" :myUploadId="'MusicFileInput'" :dims="dims" :contentModel="contentModelMusicFile" :mediaFiles="mediaFilesMusicFile" :limit="1" :sizeLimit="2000000" :mediaTypes="'audio'" @startLoad="startLoad" @updateMedia="setByEventLogoMusicFile($event)"/>
        </div>
        <div class="drop-zone" v-if="uploadState === 2">
          <media-upload :myUploadId="'CoverImageInput'" :dims="dims" :contentModel="contentModelCoverImage" :mediaFiles="mediaFilesCoverImage" :limit="1" :sizeLimit="2000000" :mediaTypes="'image'" @startLoad="startLoad" @updateMedia="setByEventLogoCoverImage($event)"/>
        </div>
          <item-form-part1 v-if="uploadState === 3" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part2 v-if="uploadState === 4" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part3 v-if="uploadState === 5" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
      </div>
      <div class="px-4 col-md-6 col-sm-12" v-if="uploadState > 1">
        <item-summary class="upload-preview" :itemSummary="itemSummary" @upload-item="uploadItem"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ItemFormPart1 from '@/components/items/ItemFormPart1'
import ItemFormPart2 from '@/components/items/ItemFormPart2'
import ItemFormPart3 from '@/components/items/ItemFormPart3'
import ItemFormNav from '@/components/items/ItemFormNav'
import ItemSummary from '@/components/items/ItemSummary'
import MediaUpload from '@/components/utils/MediaUpload'
import utils from '@/services/utils'

export default {
  name: 'UploadItem',
  components: {
    MediaUpload,
    ItemSummary,
    ItemFormPart1,
    ItemFormPart2,
    ItemFormPart3,
    ItemFormNav
  },
  data () {
    return {
      formSubmitted: false,
      componentKey: 0,
      uploadState: 1,
      showHash: false,
      loading: true,
      itemUUID: null,
      loaded: false,
      dims: { width: 250, height: 250 },
      result: 'Saving data to your storage - back in a mo!',
      item: {
        owner: null,
        coverArtist: null,
        private: false,
        name: '',
        description: '',
        editions: null,
        keywords: '',
        coverImage: {},
        musicFile: {}
      },
      contentModelCoverImage: {
        title: 'Cover Image',
        buttonName: 'Choose File',
        iconName: 'brush',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      },
      contentModelMusicFile: {
        title: 'Music File',
        buttonName: 'Choose File',
        iconName: 'music-note-beamed',
        errorMessage: 'A mp3 file is required',
        popoverBody: 'Your music file.'
      },
      doValidate: true,
      defaultBadge: require('@/assets/img/risidio_collection_logo.svg'),
      defaultBadgeData: null
    }
  },
  mounted () {
    const assetHash = this.$route.params.assetHash
    if (!assetHash) {
      this.loaded = true
    } else {
      this.$store.dispatch('myItemStore/findItemByAssetHash', assetHash).then((item) => {
        this.uploadState++
        if (!item) {
          this.$router.push('/404')
          return
        }
        this.item = item
        if (!this.item.coverImage) {
          this.item.coverImage = {}
        }
        if (!this.item.musicFile) {
          this.item.musicFile = {}
        }
        this.setImage(item.imageUrl)
        if (item.imageUrl) this.item.imageUrl = item.imageUrl
        this.loaded = true
      })
    }
  },
  methods: {
    updateUploadState: function (data) {
      if (data.change === 'done') {
        this.$router.push('/item-preview/' + this.item.assetHash)
      } else if (data.change === 'up') {
        this.uploadState++
      } else {
        this.uploadState--
      }
    },
    startLoad: function (data) {
      if (data && data.file.type.indexOf('audio') > -1) {
        this.$store.commit('setModalMessage', 'Loading ' + data.file.name + ' a ' + data.file.type + ' type file into browser - shouldn\'t be long...')
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      }
    },
    isValid: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems.length === 0
    },
    setByEventLogoCoverImage (data) {
      if (!data.media || data.media.length === 0) return
      this.item.coverImage = data.media[data.media.length - 1]
      this.$root.$emit('bv::hide::modal', 'waiting-modal')
      if (this.item.coverImage.dataUrl) {
        this.$store.commit('setModalMessage', 'Uploading ' + this.item.coverImage.name + ' to your storage.')
        this.$store.dispatch('myItemStore/saveCoverFile', this.item).then((item) => {
          this.item = item
          this.uploadState = 3
          this.$root.$emit('bv::hide::modal', 'waiting-modal')
        })
      }
      this.uploadState = 3
    },
    setByEventLogoMusicFile (data) {
      if (!data.media || data.media.length === 0) return
      this.item.musicFile = data.media[0]
      if (this.item.musicFile.name) {
        this.item.name = utils.getFileNameNoExtension(this.item.musicFile.name)
      }
      if (this.item.musicFile.dataUrl) {
        this.$store.commit('setModalMessage', 'Uploading ' + this.item.musicFile.name + ' to your storage.')
        this.$store.dispatch('myItemStore/saveMusicFile', this.item).then((item) => {
          this.item = item
          this.uploadState = 2
          this.$root.$emit('bv::hide::modal', 'waiting-modal')
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
    fileNameCoverImage () {
      if (this.item.coverImage.name) {
        return
      }
      const filename = this.item.coverImage.name
      return filename.split(/\./)[0]
    },
    fileNameMusicFile () {
      if (this.item.musicFile && this.item.musicFile.length === 0) {
        return
      }
      const filename = this.item.musicFile.name
      return filename.split(/\./)[0]
    },
    contextTitle: function () {
      if (this.uploadState === 1) return 'Upload your music'
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
      this.$store.commit('setModalMessage', 'Uploading files - this can sometimes take a while depending on network traffic and file size. We don\'t store your data in our infrastructure - instead we are doing something new that gives you control over the data you load into applications.. <a target="_blank" href="https://radiclesociety.medium.com/radicle-peer-to-peer-marketplaces-whats-the-deal-767960da195b">read more</a>')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('myItemStore/saveItem', { item: this.item, musicFile: this.item.musicFile[0], coverImage: this.item.coverImage[0] }).then(() => {
        // this.$router.push('/my-app/' + item.itemUUID)
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Your music is now uploaded to your personal cloud.')
      }).catch((error) => {
        this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
        this.result = error
      })
    }
  },
  computed: {
    itemSummary () {
      return {
        uploadState: this.uploadState,
        displayTitle: 'Preview',
        item: this.item,
        isValid: this.isValid(),
        context: 'upload'
      }
    },
    mediaFilesCoverImage () {
      const files = []
      if (this.item.coverImage && this.item.coverImage.dataUrl) {
        files.push(this.item.coverImage)
      }
      return files
    },
    mediaFilesMusicFile () {
      const files = []
      if (this.item.musicFile && this.item.musicFile.dataUrl) {
        files.push(this.item.musicFile)
      }
      return files
    },
    contractAddressUser () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
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
