<template>
<div class="text-center">
  <div @drop.prevent="loadMediaObjects" @dragover.prevent class="p-4 drop-zone text-danger d-flex flex-column align-items-center">
      <div class="mt-5"><b-icon scale="3" :icon="contentModel.iconName"/></div>
      <div class="mt-4 mb-5" v-html="contentModel.title"></div>
      <div class="text-center mx-auto" style="position: relative; top: 10px;">
        <div>
          <input style="width: 80%;" class="input-file" type="file" :ref="getUploadId()" @change.prevent="loadMediaObjects"/>
        </div>
        <div>
          <b-button style="width: 80%;" variant="light" v-html="contentModel.buttonName" @click="chooseFiles()"></b-button>
        </div>
        <div style="width: 100%;" class="text-left mt-4 mb-3" role="group">
          <label for="item-name">or paste a link</label>
          <b-form-input
            id="item-name"
            v-model="directUrl"
            @keyup="startDownload()"
            aria-describedby="item-name-help item-name-feedback"
            placeholder="Enter URL"
            trim
          ></b-form-input>
        </div>
      </div>
    <div class="invalid-feedback d-block" v-if="showError">
      {{contentModel.errorMessage}}
    </div>
    <div class="invalid-feedback d-block" v-if="internalError">
      {{internalError}}
    </div>
  </div>
</div>
<!--/droppable area 1 -->
</template>

<script>
import _ from 'lodash'
import utils from '@/services/utils'

export default {
  name: 'MediaUpload',
  components: {
    // BFormFile
  },
  props: {
    showError: {
      type: Boolean,
      default: () => (false),
      required: false
    },
    myUploadId: {
      type: String,
      default: () => ('file-input'),
      required: true
    },
    imageUrl: {
      type: String,
      default: () => (''),
      required: false
    },
    sizeLimit: {
      type: Number,
      default: () => (450),
      required: true
    },
    mediaTypes: {
      type: String,
      default: () => ('image'),
      required: false
    },
    limit: {
      type: Number,
      default: () => (2),
      required: true
    },
    contentModel: {
      type: Object,
      default: () => ({}),
      required: true
    },
    dims: {
      type: Object,
      default: () => ({ width: 250, height: 250 }),
      required: true
    },
    mediaFiles: {
      type: Array,
      default: () => ([]),
      required: false
    }
  },
  data () {
    return {
      mediaItem: null,
      directUrl: null,
      loaded: false,
      mediaObjects: [],
      internalError: null,
      missing: '/img/pdf-holding.png'
    }
  },
  mounted () {
    if (this.mediaFiles && this.mediaFiles.length > 0) {
      Object.assign(this.mediaObjects, this.mediaFiles)
      this.loaded = true
    }
  },
  computed: {
    checkQuantity: function () {
      return this.mediaObjects.length < Number(this.limit)
    },
    columns  () {
      return 'col-' + this.size
    }
  },
  methods: {
    getUploadId: function () {
      return this.myUploadId
    },
    startDownload: function () {
      this.load()
    },
    chooseFiles: function () {
      // document.getElementById(this.uploadId).click()
      this.$refs[this.myUploadId].click()
    },
    clearFiles () {
      this.$refs[this.myUploadId].reset()
    },
    clearMediaObject: function (fsize) {
      const index = _.findIndex(this.mediaObjects, function (mo) {
        return mo.size === fsize
      })
      this.mediaObjects.splice(index, 1)
      this.$emit('updateMedia', { clear: true })
    },
    clearMediaObjects: function () {
      this.mediaObjects = []
      this.$emit('updateMedia', { clear: true })
    },
    fileSizeM: function (fsize) {
      return fsize / 1000000
    },
    fileType: function (ftype) {
      if (ftype && ftype.startsWith('image')) {
        return ftype.substring(6)
      }
      return ftype
    },
    cover: function () {
      const vid = document.querySelector('#video1')
      const cvs = document.querySelector('#canvas1')
      cvs.width = vid.clientWidth
      cvs.height = vid.clientHeight
      const cvsCtx = cvs.getContext('2d')
      vid.currentTime = 0
      document.querySelector('#video1').addEventListener('timeupdate', function () {
        // You are now ready to grab the thumbnail from the <canvas> element
        cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        const coverImage = {
          dataUrl: cvs.toDataURL(),
          type: 'image/cover'
        }
        // $self.$emit('updateMedia', { media: $self.mediaObjects, coverImage: coverImage })
        return coverImage
      })
      // cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height)
    },
    ispdf (file) {
      try {
        return file.type.indexOf('pdf') > -1
      } catch (err) {
        return false
      }
    },
    isPlain (file) {
      try {
        const plain = file.type.indexOf('plain') > -1 || file.type.length === 0
        return plain
      } catch (err) {
        return false
      }
    },
    isImage (file) {
      try {
        const image = file.type.indexOf('img') > -1 ||
              file.type.indexOf('image') > -1 ||
              file.type.indexOf('png') > -1 ||
              file.type.indexOf('jpeg') > -1 ||
              file.type.indexOf('jpg') > -1 ||
              file.type.indexOf('gif') > -1
        return image
      } catch (err) {
        return false
      }
    },
    isVideo (file) {
      try {
        const video = file.type.indexOf('video') > -1
        return video
      } catch (err) {
        return false
      }
    },
    isAudio (file) {
      try {
        const audio = file.type.indexOf('audio/mpeg') > -1 ||
              file.type.indexOf('wav') > -1
        return audio
      } catch (err) {
        return false
      }
    },
    isMusic (file) {
      try {
        const music = file.type.indexOf('mp3') > -1 ||
              file.type.indexOf('wma')
        return music
      } catch (err) {
        return false
      }
    },
    getFileType (fileObject) {
      let type = fileObject.type
      if (!fileObject.type || fileObject.type.length === 0) {
        if (fileObject.name) {
          type = utils.getFileExtension(fileObject.name)
        }
        if (type.indexOf('gltf') > -1 || type.indexOf('glb') > -1 || type.indexOf('obj') > -1) {
          type = 'threed'
        }
      }
      return type
    },
    isTooBig (fileObject) {
      let ksize = fileObject.size / 1000000
      ksize = Math.round(ksize * 100) / 100
      if (ksize > Number(this.sizeLimit)) {
        this.internalError = 'This file (' + ksize + ' M) exceeds the size limit of ' + this.sizeLimit + ' M - try dropping in a of a file url - we can create the NFT from this and serve the content from the URL'
        this.$emit('updateMedia', { errorMessage: this.internalError })
        return false
      }
    },
    isForbidden (type) {
      let allowed = false
      const types = this.mediaTypes.split(',').find((o) => type.indexOf(o.trim() > -1))
      for (let i = 0; i < types.length; i++) {
        if (type.indexOf(types[i]) > -1) {
          allowed = true
        }
      }
      if (!allowed) {
        this.$emit('updateMedia', { errorMessage: 'Files of type ' + type + ' are not allowed here.' })
        this.internalError = 'Files of type ' + type + ' are not allowed here.'
      }
      return !allowed
    },
    isValidUrl (url1) {
      try {
        return new URL(url1)
      } catch (e) {
        return false
      }
    },
    loadMediaObjects: function (e) {
      this.load(e, this.mediaObjects, 1)
    },
    load: function (e, arrayToLoad, limit) {
      this.clearMediaObjects()
      const $self = this
      this.internalError = null
      let userFiles
      if (this.directUrl || (e && e.dataTransfer && e.dataTransfer.getData)) {
        let data = this.directUrl
        if (!data) data = e.dataTransfer.getData('Text')
        if (this.isValidUrl(data)) {
          this.$emit('updateMedia', { startLoad: 'Fetching file from ' + data })
          userFiles = data
          utils.readFileFromUrlToDataURL(data).then((fileObject) => {
            const type = $self.getFileType(fileObject)
            if ($self.isForbidden(type)) return
            fileObject.id = $self.contentModel.id
            fileObject.type = type
            fileObject.storage = 'external'
            fileObject.fileUrl = data
            fileObject.dataHash = utils.buildHash(fileObject.dataUrl)
            fileObject.dataUrl = null
            $self.$emit('updateMedia', { media: fileObject })
          }).catch((error) => {
            $self.$store.commit('setModalMessage', 'Error occurred processing transaction.')
            $self.result = error
          })
          return
        } else {
          return
        }
      }
      if (e.dataTransfer) {
        userFiles = e.dataTransfer.files
      } else {
        userFiles = e.target.files
      }
      let fileObject = null
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break
        }
        fileObject = userFiles[i]
        const type = $self.getFileType(fileObject)
        if ($self.isTooBig(fileObject)) return
        if ($self.isForbidden(type)) return
        const thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          type: type,
          size: fileObject.size
        }
        this.$emit('updateMedia', { startLoad: 'Loading from file system ' + thisFile.name + ' size is ' + Math.round(thisFile.size * 100) / 100 + ' bytes' })
        const reader = new FileReader()
        reader.onload = function (e) {
          thisFile.dataUrl = e.target.result
          thisFile.id = $self.contentModel.id
          thisFile.storage = 'gaia'
          thisFile.dataHash = utils.buildHash(thisFile.dataUrl)
          arrayToLoad.push(thisFile)
          if ($self.isImage(thisFile)) {
            const img = new Image()
            img.onload = function () {
              if (this.width !== $self.dims.width || this.height !== $self.dims.height) {
                if (this.width !== this.height) {
                  const msg = 'Your image must be a square and not ' + this.width + 'x' + this.height
                  $self.$notify({ type: 'error', title: 'Logo Upload', text: msg })
                  // $self.$emit('updateMedia', { media: thisFile })
                } else {
                  this.width = '250px'
                  this.height = '250px'
                  $self.$emit('updateMedia', { media: thisFile })
                }
              } else {
                $self.$emit('updateMedia', { media: thisFile })
              }
            }
            img.src = thisFile.dataUrl
          } else {
            $self.$emit('updateMedia', { media: thisFile })
          }
          if ($self.isVideo(thisFile)) {
            // On selecting a video file
            // document.querySelector('#video-element source').setAttribute('src', URL.createObjectURL(document.querySelector('#file-input').thisFile))
          }
        }
        reader.readAsDataURL(fileObject)
      }
    }
  }
}
</script>
<style scoped>
.input-file {
  opacity: 0;
  position: relative;
  top: -40px;
}
.drop-area {
  width: 100%;
  border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-zone {
  border-radius: 20px;
  border: 1pt dashed #fff;
}
.drop-label {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 0;
}
select {
  padding: 0px 10px;
}
</style>
