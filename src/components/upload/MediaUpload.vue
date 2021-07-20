<template>
<div class="">
  <div @drop.prevent="loadMediaObjects" @dragover.prevent class="p-4 drop-zone d-flex flex-column align-items-center">
    <div class="mt-4 mb-5" v-html="contentModel.title"></div>
    <div class="mx-5 px-5 " style="border: 1pt dashed #000;">
      <div class="mt-5" v-html="contentModel.message"></div>
      <div v-if="contentModel.iconName" class="mt-5"><b-icon class="text-warning" scale="3" :icon="contentModel.iconName"/></div>
      <div>
        <input style="width: 80%;" class="input-file" type="file" :ref="getUploadId()" @change="loadMediaObjects"/>
      </div>
      <div class="mx-auto" style="position:relative; top: 20px;">
        <b-button variant="light" v-html="contentModel.buttonName" @click="chooseFiles()"></b-button>
      </div>
    </div>
    <div class="mt-5 pt-5 text-small">for files > 20M paste a link! <br/>Need hosting? E.g. see <a href="https://docs.stacks.co/build-apps/references/gaia" target="_blank">Gaia</a>, <a href="https://ipfs.io/" target="_blanK">IPFS</a> or <a href="https://cloudinary.com/" target="_blanK">Cloudinary</a></div>
    <div class="mt-3 text-left mt-4 mb-3" style="font-size: 1.2rem; width: 80%;">
      <b-form-input
        id="item-name"
        v-model="directUrl"
        @keyup="startDownload()"
        aria-describedby="item-name-help item-name-feedback"
        placeholder="Paste link"
        trim
      ></b-form-input>
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
      myContentModel: {
        title: 'NFT File<br/>drop a url - up to 200M',
        buttonName: 'Choose NFT File',
        iconName: 'film',
        errorMessage: 'A mp4 file is required',
        popoverBody: 'The main NFT file.'
      },
      mediaItem: null,
      directUrl: null,
      loaded: false,
      mediaObjects: [],
      internalError: null,
      missing: '/img/pdf-holding.png'
    }
  },
  mounted () {
    if (this.contentModel) {
      // Object.assign(this.myContentModel, this.contentModel)
      // this.myContentModel = this.contentModel
    }
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
      const index = this.mediaObjects.findIndex((mo) => mo.size === fsize)
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
    getFileType (fileObject) {
      let type = fileObject.type
      if (!fileObject.type || fileObject.type.length === 0) {
        let exten = ''
        if (fileObject.fileUrl) {
          exten = utils.getFileExtension(fileObject.fileUrl)
        } else if (fileObject.name) {
          exten = utils.getFileExtension(fileObject.name)
        }
        if (exten === 'jpg' ||
            exten === 'jpeg' ||
            exten === 'png' ||
            exten === 'tiff' ||
            exten === 'gif') {
          type = 'image/' + exten
        } else if (exten === '3ga' ||
            exten === 'mp3' ||
            exten === 'wav' ||
            exten === 'bwf' ||
            exten === 'gif') {
          type = 'audio/' + exten
        } else if (exten === 'mp4' ||
            exten === 'mov' ||
            exten === 'wmv' ||
            exten === 'avchd') {
          type = 'video/' + exten
        } else if (exten === 'glb' ||
            exten === 'obj' ||
            exten === 'gltf' ||
            exten === 'glb' ||
            exten === 'stl') {
          type = 'threed/' + exten
        } else if (exten === 'pdf' ||
            exten === 'doc' ||
            exten === 'docx' ||
            exten === 'xls' ||
            exten === 'ppt' ||
            exten === 'pptx' ||
            exten === 'txt' ||
            exten === 'rtf' ||
            exten === 'odt' ||
            exten === 'html' ||
            exten === 'htm') {
          type = 'document/' + exten
        } else if (exten === 'pdf' ||
            exten === 'js' ||
            exten === 'java' ||
            exten === 'clar' ||
            exten === 'c' ||
            exten === 'net') {
          type = 'code/' + exten
        }
      }
      return type
    },
    isTooBig (fileObject) {
      let ksize = fileObject.size / 1000000
      ksize = Math.round(ksize * 100) / 100
      if (ksize > Number(this.sizeLimit)) {
        this.internalError = 'This file (' + ksize + ' M) exceeds the size limit of ' + this.sizeLimit + ' M - try entering a URL to a file we can download'
        this.$emit('updateMedia', { errorMessage: this.internalError })
        return true
      }
    },
    isForbidden (type) {
      let compareTo = type
      if (type.indexOf('/') > -1) {
        compareTo = type.split('/')[0]
      }
      let forbidden = false
      if (compareTo !== 'application') {
        forbidden = this.mediaTypes.indexOf(compareTo) === -1
      } else {
        forbidden = this.mediaTypes.indexOf(type.split('/')[1]) === -1
      }
      if (forbidden) {
        this.$emit('updateMedia', { errorMessage: 'Files of type ' + type + ' are not allowed here.' })
        this.internalError = 'Files of type ' + type + ' are not allowed here.'
      }
      return forbidden
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
          let remoteServer = 'remote server'
          if (data && data.lastIndexOf('/') > 0) {
            const parts = data.split('/')
            if (parts.length > 1) remoteServer = parts[0] + '//' + parts[2]
          }
          this.$emit('updateMedia', { startLoad: 'Fetching file from ' + remoteServer })
          userFiles = data
          utils.readFileChunks(data).then((fileObject) => {
            const type = $self.getFileType(fileObject)
            if ($self.isForbidden(type)) return
            fileObject.id = $self.contentModel.id
            fileObject.type = type
            fileObject.storage = 'external'
            fileObject.fileUrl = data
            // fileObject.dataHash = utils.buildHash(fileObject.dataUrl)
            fileObject.dataUrl = null
            $self.$emit('updateMedia', { media: fileObject })
          }).catch((error) => {
            $self.$store.commit('setModalMessage', 'Error occurred processing transaction.')
            $self.result = error
          })
          return
        }
      }
      if (!e) return
      if (e.dataTransfer) {
        userFiles = e.dataTransfer.files
      } else if (e.target) {
        userFiles = e.target.files
      } else {
        return
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
                  const msg = 'Square images are good - this one is like ' + this.width + 'x' + this.height
                  $self.$notify({ type: 'error', title: 'Logo Upload', text: msg })
                  $self.$emit('updateMedia', { media: thisFile })
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
        }
        reader.readAsDataURL(fileObject)
        // const chunkSize = 64 * 1024 // bytes
        // const offset = 0
        // const blob = fileObject.slice(offset, chunkSize + offset)
        // reader.readAsDataURL(blob)
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
