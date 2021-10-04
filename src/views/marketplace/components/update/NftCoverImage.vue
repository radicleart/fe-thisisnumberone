<template>
<div>
  <div class="bg-black text-white" style="width:100%;" v-if="displayHeader">
    <h1>NFT File Saved</h1>
    <p class="text-small"><a class="text-secondary pointer" style="font-size: 1.2rem;" @click="useNftFileAsCover">click here to use the NFT file as the cover image!</a> ...or</p>
  </div>
  <div class="bg-black text-white" style="width:100%;">
    <!-- <MediaItem v-if="hasFile()" :videoOptions="videoOptions" :attributes="item.attributes" :targetItem="'coverImage'" v-on="$listeners"/> -->
    <MediaItemGeneral v-if="hasFile()" :classes="'item-image-preview'" :options="videoOptions" :mediaItem="getMediaItem().coverImage" v-on="$listeners"/>
    <MediaUpload v-else class="text-center" :myUploadId="'coverImage'" :dims="dims" :contentModel="contentModel" :mediaFiles="mediaFilesImage()" :limit="1" :sizeLimit="2" :mediaTypes="'image'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/views/marketplace/components/media/MediaItemGeneral'
import MediaUpload from '@/views/marketplace/components/update/MediaUpload'

export default {
  name: 'NftCoverImage',
  components: {
    MediaItemGeneral,
    MediaUpload
  },
  props: ['item', 'displayHeader'],
  data: function () {
    return {
      dims: { width: 'auto', height: 300 },
      contentModel: {
        id: 'coverImage',
        title: '<h2>Upload a Cover Image</h2><br/><span class="text-small">Up to 1M</span>',
        buttonName: 'Drop Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      }
    }
  },
  methods: {
    getMediaItem () {
      const attributes = this.$store.getters[APP_CONSTANTS.KEY_MEDIA_ATTRIBUTES](this.item)
      return attributes
    },
    updateMedia: function (data) {
      if (data.startLoad) {
        this.$store.commit('setModalMessage', data.startLoad)
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      } else if (data.errorMessage) {
        this.$store.commit('setModalMessage', data.errorMessage)
      } else if (data.media) {
        const $self = this
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: this.item.assetHash, attributes: data.media }).then((attributes) => {
          const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
          myAsset.attributes[attributes.id] = attributes
          $self.$store.dispatch('rpayMyItemStore/saveItem', myAsset).then((item) => {
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
    useNftFileAsCover () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      if (!item) return
      item.attributes.coverImage = item.attributes.artworkFile
      item.attributes.coverImage.id = 'coverImage'
      this.updateMedia({ media: item.attributes.coverImage })
    },
    getContentModal () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      if (!item) return
      if (item.attributes.artworkFile.type.indexOf('image') > -1) {
        return this.contentModel
      }
      this.contentModel.title = 'The cover image for your NFT file.'
      return this.contentModel
    },
    mediaFilesImage () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      if (!item) return
      const files = []
      if (item.attributes.coverImage && item.attributes.coverImage.dataUrl) {
        files.push(item.attributes.coverImage)
      }
      return files
    },
    hasFile () {
      return this.item.attributes && this.item.attributes.coverImage && this.item.attributes.coverImage.fileUrl
    },
    downable: function () {
      return this.uploadState > 2
    }
  },
  computed: {
    videoOptions () {
      const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.item.assetHash)
      const videoOptions = {
        emitOnHover: true,
        playOnHover: true,
        bigPlayer: false,
        showMeta: true,
        assetHash: this.item.assetHash,
        autoplay: false,
        muted: true,
        controls: true,
        poster: (myAsset && myAsset.attributes.coverImage) ? myAsset.attributes.coverImage.fileUrl : null,
        fluid: true
      }
      if (!myAsset.attributes.artworkFile && myAsset.attributes.coverImage) {
        myAsset.attributes.artworkFile = myAsset.attributes.coverImage
      }
      if (myAsset && myAsset.attributes) {
        videoOptions.poster = (myAsset.attributes.coverImage) ? myAsset.attributes.coverImage.fileUrl : null
        videoOptions.sources = [
          { src: myAsset.attributes.artworkFile.fileUrl, type: myAsset.attributes.artworkFile.type }
        ]
      }
      return videoOptions
    }
  }
}
</script>

<style scoped>
</style>
