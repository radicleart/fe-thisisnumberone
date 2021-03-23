<template>
<div class="text-center">
  <div class="text-danger d-flex flex-column align-items-center">
      <div class="mt-5"><b-icon scale="3" :icon="contentModel.iconName"/></div>
      <div class="mt-4 mb-5 text-center">{{contentModel.title}}</div>
      <div class="mt-auto" style="position: relative; top: 90px;">
        <div>
          <b-button variant="light" v-html="contentModel.buttonName" @click="chooseFiles()"></b-button>
        </div>
        <div>
          <input class="input-file" type="file" :ref="getUploadId()" @change.prevent="loadMediaObjects"/>
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
// import { BFormFile } from 'bootstrap-vue'

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
    },
    hasMedia () {
      return this.mediaFiles && this.mediaFiles.length > 0
    }
  },
  methods: {
    getUploadId: function () {
      return this.myUploadId
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
      this.$emit('updateMedia', { media: this.mediaObjects })
    },
    clearMediaObjects: function () {
      this.mediaObjects = []
      this.$emit('updateMedia', { media: this.mediaObjects })
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
    cover: function (switcher) {
      if (!switcher) {
        return
      }
      const vid = document.querySelector('#video1')
      const cvs = document.querySelector('#canvas1')
      cvs.width = vid.clientWidth
      cvs.height = vid.clientHeight
      const cvsCtx = cvs.getContext('2d')
      vid.currentTime = 0
      const $self = this
      document.querySelector('#video1').addEventListener('timeupdate', function () {
        // You are now ready to grab the thumbnail from the <canvas> element
        cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        const coverImage = {
          dataUrl: cvs.toDataURL(),
          type: 'image/cover'
        }
        $self.$emit('updateMedia', { media: $self.mediaObjects, coverImage: coverImage })
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
    loadMediaObjects: function (e) {
      this.load(e, this.mediaObjects, 1)
    },
    load: function (e, arrayToLoad, limit) {
      this.clearMediaObjects()
      const $self = this
      this.internalError = null
      let userFiles
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
        const thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        }
        this.$emit('startLoad', { file: thisFile })
        const ksize = fileObject.size / 1000
        if (ksize > Number($self.sizeLimit)) {
          $self.internalError = 'This file (' + ksize + ' Kb) exceeds the size limit of ' + this.sizeLimit + ' Kb'
          return
        }
        let allowed = false
        if ($self.mediaTypes.indexOf('image') > -1) {
          allowed = $self.isImage(fileObject)
        }
        if ($self.mediaTypes.indexOf('plain') > -1) {
          allowed = allowed || $self.isPlain(fileObject)
        }
        if ($self.mediaTypes.indexOf('video') > -1) {
          allowed = allowed || $self.isVideo(fileObject)
        }
        if ($self.mediaTypes.indexOf('audio') > -1) {
          allowed = allowed || $self.isAudio(fileObject)
        }
        if ($self.mediaTypes.indexOf('doc') > -1) {
          allowed = allowed || $self.ispdf(fileObject)
        }
        if ($self.mediaTypes.indexOf('mp3') > -1 || $self.mediaTypes.indexOf('music') > -1) {
          allowed = allowed || $self.isMusic(fileObject)
        }
        if (!allowed) {
          $self.internalError = 'Files of type ' + fileObject.type + ' are not allowed here.'
          return
        }
        const reader = new FileReader()
        reader.onload = function (e) {
          thisFile.dataUrl = e.target.result
          arrayToLoad.push(thisFile)
          if ($self.isImage(thisFile)) {
            const img = new Image()
            img.onload = function () {
              if (this.width !== $self.dims.width || this.height !== $self.dims.height) {
                if (this.width !== this.height) {
                  const msg = 'Your image must be a square and not ' + this.width + 'x' + this.height
                  $self.$notify({ type: 'error', title: 'Logo Upload', text: msg })
                  $self.$emit('updateMedia', { media: arrayToLoad })
                } else {
                  this.width = '250px'
                  this.height = '250px'
                  $self.$emit('updateMedia', { media: arrayToLoad })
                }
              } else {
                $self.$emit('updateMedia', { media: arrayToLoad })
              }
            }
            img.src = thisFile.dataUrl
          } else {
            $self.$emit('updateMedia', { media: arrayToLoad })
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
  min-width: 300px;
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
.drop-label {
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  margin-bottom: 0;
}
select {
  padding: 0px 10px;
}
</style>
