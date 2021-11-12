<template>
<div>
  <b-container>
  <div class="my-5 text-center">
    <p>Note: If the contract is deployed ignore the above - you just need to refresh the cache!</p>
    <b-button class="mb-4 w-50 btn-action mr-3" variant="warning" @click="buildCache">Build Cache</b-button>
  </div>
    <b-form>
        <div>
          <div v-if="!uploadable">
            <b-container class="p-5 ">
              <MediaUpload class="text-center" :hideLinkPaste="true" :myUploadId="'coverImage'" :dims="dims" :contentModel="contentModel" :mediaFiles="mediaFilesImage()" :limit="1" :sizeLimit="3" :mediaTypes="'code/clar'" @updateMedia="updateMedia($event)"/>
            </b-container>
          </div>
          <div v-else>
            <div class="mb-3" role="group">
              <label for="contractId"><span class="text-danger">*</span> contract id</label>
              <b-form-input
                id="contractId"
                v-model="contractId"
                placeholder="contract id"
                trim
                required
              ></b-form-input>
            </div>
            <div>
              <div class="mb-3">
                <b-textarea
                  ref="contractCode"
                  :value="decodedString"
                  class="text-small py-4 my-3 source-code"
                  rows="10"
                  placeholder="Contract Code"
                ></b-textarea>
              </div>
              <div class="mt-3 d-flex justify-content-start">
                <b-button variant="info" class="mr-3 text-white" @click="deployContract()">Deploy</b-button>
                <b-button variant="outline-dark" class="text-dark " @click="cancelUpload()">Cancel</b-button>
              </div>
            </div>
          </div>
        </div>
    </b-form>
    <pre v-if="result" class="source-code my-4" v-html="result"></pre>
  </b-container>
  <b-modal id="modal-err" title="Contract Not Deployed">
    <div class="row">
      <div class="col-12 my-1">
        <div class="mb-3">Error: {{result}}</div>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
// import MediaFilesUpload from '@/components/utils/MediaFilesUpload'
import MediaUpload from '@/views/marketplace/components/update/MediaUpload'

const NETWORK = process.env.VUE_APP_NETWORK
const REGISTRY_CONTRACT_ADDRESS = process.env.VUE_APP_REGISTRY_CONTRACT_ADDRESS
const REGISTRY_CONTRACT_NAME = process.env.VUE_APP_REGISTRY_CONTRACT_NAME

export default {
  name: 'DeployContractFromFile',
  components: {
    MediaUpload
  },
  watch: {
  },
  data () {
    return {
      feeAmount: 3000,
      project: {
        contractId: REGISTRY_CONTRACT_ADDRESS + '.' + REGISTRY_CONTRACT_NAME
      },
      contractId: null,
      txData: null,
      nonce: 0,
      loading: true,
      parentalError: null,
      result: null,
      dims: { width: 'auto', height: 300 },
      contentModel: {
        title: 'Browse computer for contract to deploy',
        errorMessage: 'A file is required.',
        popoverBody: 'Your clarity  file.',
        buttonName: 'Choose Clarity File'
      },
      uploadable: false,
      files: []
    }
  },
  mounted () {
    this.contractId = this.project.contractId
    this.loading = false
  },
  methods: {
    buildCache: function () {
      this.$store.dispatch('rpayManageCacheStore/buildCache').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    mediaFilesImage () {
      if (!this.avatar) return
      const files = []
      return files
    },
    updateMedia (data) {
      if (data.media && data.media.dataUrl) {
        this.files = [data.media]
        this.uploadable = true
      }
    },
    plainFile () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    cancelUpload () {
      this.files = []
    },
    deployContract: function () {
      if (!this.validate(this.plainFile())) {
        return
      }
      // contractName = this.this.files[0].name.split(/\./)[1]
      this.project.contractId = this.contractId
      this.project.network = NETWORK
      this.project.codeBody = this.plainFile()
      this.$store.dispatch('rpayStacksStore/deployProjectContract', this.project).then(() => {
        this.$store.commit('setModalMessage', 'Contract has been deployed to Stacks blockchain.')
        this.$root.$emit('bv::show::modal', 'success-modal')
      }).catch((error) => {
        this.result = error
        this.$bvModal.show('modal-err')
      })
    },
    validate: function (file) {
      let result = true
      if (!file) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'Load the contract source code to continue.' })
        result = false
      }
      return result
    }
  },
  computed: {
    fileName () {
      if (this.files.length === 0) {
        return
      }
      const filename = this.files[0].name
      return filename.split(/\./)[0]
    },
    mediaFiles1 () {
      let files = []
      if (this.files.length > 0) {
        files = this.files
      }
      return files
    },
    decodedString () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    }
  }
}
</script>
<style lang="scss" scoped>
.create-container {
  width: 200px;
  height: 200px;
  margin: auto auto;
}
.my-input {
  background: #fff 0% 0% no-repeat padding-box;
  border-radius: 0px;
  border: none;
  padding: 50px 20px;
  color: #000;
}
.source-code {
  background: #c3dee0;
  border: 2pt solid #342343;
  padding: 25px;
}

</style>
