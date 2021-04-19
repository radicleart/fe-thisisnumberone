<template>
<div id="update-item" class="text-white" v-if="loaded && myAsset">
  <div class="container" :key="componentKey">
    <div class="row mt-4">
      <div class="col-12">
        <h4>{{contextTitle()}}</h4>
      </div>
    </div>
    <media-handler :videoOptions="videoOptions()" :uploadState="uploadState" :nftMedia="item.nftMedia" @updateMedia="updateMedia" @deleteMediaItem="deleteMediaItem"/>
    <div class="row mt-4">
      <div class="col-md-6 offset-md-3 col-sm-12">
        <h2>NFT Info</h2>
        <p>Information displayed in the context of this artwork and to help people find it</p>
        <div class="my-4 bg-danger p-3" v-if="invalidItems.length > 0 && showErrors">
          <div>Required fields:</div>
          <div class="mr-1 text-white" v-for="(field, index) in invalidItems" :key="index">{{field}}</div>
        </div>
        <div>
          <item-form-part1 v-if="uploadState > 2" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part2 v-if="uploadState > 3" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part3 v-if="uploadState > 4" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
        </div>
        <div class="my-4 bg-danger p-3" v-if="invalidItems.length > 0 && showErrors">
          <div>Required fields:</div>
          <div class="mr-1 text-white" v-for="(field, index) in invalidItems" :key="index">{{field}}</div>
        </div>
        <div class="my-4 text-right"><b-button class="" variant="danger" @click.prevent="uploadItem()">Continue</b-button></div>
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
import MediaHandler from '@/components/items/MediaHandler'
import utils from '@/services/utils'

export default {
  name: 'UpdateItem',
  components: {
    MediaHandler,
    ItemFormPart1,
    ItemFormPart2,
    ItemFormPart3
  },
  data () {
    return {
      formSubmitted: false,
      showErrors: false,
      componentKey: 0,
      uploadState: 10,
      loaded: false,
      result: 'Saving data to your storage - back in a mo!',
      assetHash: null,
      item: {
        owner: null,
        coverArtist: null,
        private: false,
        name: '',
        description: '',
        editions: null,
        keywords: '',
        nftMedia: {
          coverImage: {},
          musicFile: {}
        }
      },
      doValidate: true,
      defaultBadge: require('@/assets/img/risidio_white.png')
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      // this.uploadState++
      if (!item) {
        this.$router.push('/404')
        return
      }
      this.item = item
      /**
      if (!this.item.nftMedia.coverImage) {
        this.item.nftMedia.coverImage = {}
      }
      if (!this.item.nftMedia.musicFile) {
        this.item.nftMedia.musicFile = {}
      }
      this.setImage(item.nftMedia.imageUrl)
      if (item.nftMedia.imageUrl) this.item.nftMedia.imageUrl = item.nftMedia.imageUrl
      **/
      this.loaded = true
    })
  },
  methods: {
    videoOptions () {
      const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
      const videoOptions = {
        assetHash: this.assetHash,
        autoplay: false,
        controls: true,
        poster: (myAsset.nftMedia.coverImage) ? myAsset.nftMedia.coverImage.fileUrl : null,
        sources: [
          { src: myAsset.nftMedia.artworkFile.fileUrl, type: myAsset.nftMedia.artworkFile.type }
        ],
        fluid: true
      }
      return videoOptions
    },
    deleteMediaItem: function (mediaId) {
      this.$store.dispatch('myItemStore/deleteMediaItem', { item: this.item, id: mediaId }).then(() => {
        this.$emit('delete-cover')
      })
    },
    updateUploadState: function (data) {
      this.$store.dispatch('myItemStore/saveItem', this.item).then(() => {
        if (data.change === 'done') {
          this.$router.push('/item-preview/' + this.assetHash)
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
      }
      if (data.media && data.media.dataHash) {
        const $self = this
        this.$store.commit('setModalMessage', 'Fetched. Saving file info to library.')
        this.$store.dispatch('myItemStore/saveNftMediaObject', { assetHash: this.assetHash, nftMedia: data.media }).then((nftMedia) => {
          const myAsset = this.$store.getters[APP_CONSTANTS.KEY_MY_ITEM](this.assetHash)
          myAsset.nftMedia[nftMedia.id] = nftMedia
          $self.$store.dispatch('myItemStore/saveItem', myAsset).then((item) => {
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
      if (this.item.editions) this.item.editions = parseInt(this.item.editions)
      if (this.doValidate && invalidItems.length > 0) {
        this.showErrors = true
        this.$notify({ type: 'error', title: 'Upload Error', text: 'Please enter missing data' })
        return
      }
      this.showWaitingModal = true
      this.$store.commit('setModalMessage', 'Uploading... once its saved you\'ll be able to mint this artwork - registering your ownership on the blockchain. Once registered you\'ll be able to prove you own it and be able to benefit from sales and from secondary sales.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('myItemStore/saveItem', this.item).then(() => {
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::hide::modal', 'success-modal')
        this.$store.commit('setModalMessage', '')
        this.$router.push('/item-preview/' + this.item.assetHash)
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
