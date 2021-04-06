<template>
<div id="upload-item" v-if="loaded">
  <div class="container" :key="componentKey">
    <div class="row mt-4">
      <div class="col-12">
        <h4>{{contextTitle()}}</h4>
      </div>
      <div class="col-md-12">
        <media-handler :uploadState="uploadState" :nftMedia="item.nftMedia" @updateMedia="updateMedia"/>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-6 offset-md-3 col-sm-12">
        <div>
          <item-form-nav :item="item" @upload-state="updateUploadState" :uploadState="uploadState"/>
          <item-form-part1 v-if="uploadState === 3" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part2 v-if="uploadState === 4" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
          <item-form-part3 v-if="uploadState === 5" @upload-state="updateUploadState" :item="item" :upload="true" :formSubmitted="formSubmitted"/>
        </div>
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
import MediaHandler from '@/components/items/MediaHandler'
import utils from '@/services/utils'

export default {
  name: 'UploadItem',
  components: {
    ItemSummary,
    ItemFormPart1,
    ItemFormPart2,
    ItemFormPart3,
    ItemFormNav,
    MediaHandler
  },
  data () {
    return {
      formSubmitted: false,
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
        nftMedia: {}
      },
      result: 'Saving data to your storage - back in a mo!',
      doValidate: true,
      defaultBadge: require('@/assets/img/risidio_collection_logo.svg'),
      defaultBadgeData: null
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
        this.$store.dispatch('myItemStore/saveNftMediaObject', { assetHash: data.media.dataHash, nftMedia: data.media }).then((nftMedia) => {
          const localItem = {
            assetHash: data.media.dataHash,
            nftMedia: {}
          }
          localItem.nftMedia[nftMedia.id] = data.media
          $self.$store.dispatch('myItemStore/saveItem', localItem).then(() => {
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
      if (this.uploadState === 0) return 'Choose how to upload'
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
      this.$store.dispatch('myItemStore/saveItem', { item: this.item, musicFile: this.item.nftMedia.musicFile[0], coverImage: this.item.nftMedia.coverImage[0] }).then(() => {
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
