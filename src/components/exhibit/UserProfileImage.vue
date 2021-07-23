<template>
<div>
  <div class="bg-black text-white" style="width:100%;">
    <MediaItemGeneral :classes="'avatar-image'" :options="options" v-if="avatar" :hideLinkPaste="true" :mediaItem="avatar" :targetItem="'avatar'" @deleteMediaItem="deleteMediaItem"/>
    <MediaUpload v-else class="text-center" :myUploadId="'coverImage'" :dims="dims" :contentModel="contentModel" :mediaFiles="mediaFilesImage()" :limit="1" :sizeLimit="2" :mediaTypes="'image'" @updateMedia="updateMedia($event)"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import MediaUpload from '@/components/upload/MediaUpload'

export default {
  name: 'UserProfileImage',
  components: {
    MediaItemGeneral,
    MediaUpload
  },
  props: ['avatar', 'referer'],
  data: function () {
    return {
      dims: { width: 'auto', height: 300 },
      contentModel: {
        id: 'coverImage',
        title: '<h2>Upload a Profile Image</h2><br/><span class="text-small">Up to 2M</span>',
        buttonName: 'Choose Image',
        iconName: 'file-image',
        errorMessage: 'A image file is required.',
        popoverBody: 'Your cover image.'
      }
    }
  },
  methods: {
    updateMedia: function (data) {
      if (data.startLoad) {
        this.$store.commit('setModalMessage', data.startLoad)
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      } else if (data.errorMessage) {
        this.$store.commit('setModalMessage', data.errorMessage)
      } else if (data.media) {
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('rpayMyItemStore/saveAttributesObject', { assetHash: 'userAvatar', attributes: data.media }).then((mediaItem) => {
          this.$emit('updateProfile', { mediaItem: mediaItem })
        })
      }
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
      if (!this.avatar) return
      const files = []
      if (this.avatar.coverImage && this.avatar.coverImage.dataUrl) {
        files.push(this.avatar.attributes.coverImage)
      }
      return files
    },
    deleteMediaItem: function () {
      this.$store.dispatch('rpayMyItemStore/deleteMediaItemSimple', this.avatar).then(() => {
        this.$emit('updateProfile', { deleteMedia: true })
      })
    }
  },
  computed: {
    options () {
      return {
        emitOnHover: false,
        playOnHover: false,
        assetHash: 'userAvatar',
        bigPlayer: false,
        autoplay: false,
        muted: true,
        controls: true,
        showMeta: true,
        aspectRatio: '1:1',
        poster: (this.avatar) ? this.avatar.fileUrl : null,
        sources: [],
        fluid: false
      }
    }
  }
}
</script>

<style scoped>
</style>
