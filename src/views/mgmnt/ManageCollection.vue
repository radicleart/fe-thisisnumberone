<template>

<b-container class="text-white" v-if="loaded">
  <div>
    <h1 class="text-white">Manage NFT Collection</h1>
    <b-form class="needs-validation form-transparent" novalidate @submit="checkForm" id="contact-form">

    <div class="w-100 mb-3" role="group">
      <label for="status-name"><span class="text-danger">*</span> Contract</label>
      <b-form-select id="status-name" v-model="loopRun.contractId" :options="contractIds"></b-form-select>
    </div>

    <div class="w-100 mb-3" role="group">
      <label for="status-name"><span class="text-danger">*</span> Collection State</label>
      <b-form-select id="status-name" v-model="loopRun.status" :options="statusEnum"></b-form-select>
      <b-form-text class="text-warning" id="status-help">Collection status is active/inactive depending on whether the limit has been reached. They can also be disabled.</b-form-text>
    </div>

    <div class="w-100 mb-3" role="group">
      <label for="status-name"><span class="text-danger">*</span> Collection Type</label>
      <b-form-select id="status-name" v-model="loopRun.type" :options="typeEnum"></b-form-select>
      <b-form-text class="text-warning" id="status-help">Indicates how NFT minting is to work 'punks' implies we follow the crypto punk model and traditional is the super rare model.</b-form-text>
    </div>

    <div class="mb-3" role="group">
      <label for="domains"><span class="text-danger">*</span>Domains</label>
      <b-form-input
        id="domains"
        v-model="loopRun.domains"
        :state="domainsState"
        aria-describedby="domains-help domains-feedback"
        trim
        required
      ></b-form-input>
      <b-form-text id="domains-help">Comma separated list of domains where this collection can be managed/shown.</b-form-text>
      <b-form-invalid-feedback id="domains-feedback">
        The domains must include {{defaultDomain}}
      </b-form-invalid-feedback>
    </div>

    <div class="mb-3" role="group">
      <label for="currentRun-name"><span class="text-danger">*</span> Collection Name (max 40 chars)</label>
      <b-form-input
        maxlength="40"
        @keyup="setRunKey()"
        id="currentRun-name"
        v-model="loopRun.currentRun"
        :state="currentRunState"
        aria-describedby="currentRun-help currentRun-feedback"
        placeholder="Collection Name"
        trim
        required
      ></b-form-input>
      <b-form-invalid-feedback id="currentRun-feedback">
        Collection Name
      </b-form-invalid-feedback>
    </div>

    <div class="mb-3" role="group">
      <label for="currentRunKey-name"><span class="text-danger">*</span> Collection URL Key</label>
      <b-form-input
        id="currentRunKey-name"
        v-model="loopRun.currentRunKey"
        aria-describedby="currentRunKey-help currentRunKey-feedback"
        placeholder="Collection Key"
        required
      ></b-form-input>
      <b-form-invalid-feedback id="currentRunKey-feedback">
        collection key is required
      </b-form-invalid-feedback>
    </div>

    <div class="mb-3" role="group">
      <label for="makerName-name"><span class="text-danger">*</span> Maker Name (max 30 chars)</label>
      <b-form-input
        maxlength="30"
        @keyup="setMakerName()"
        id="makerName-name"
        v-model="loopRun.makerName"
        :state="makerNameState"
        aria-describedby="makerName-help makerName-feedback"
        placeholder="Maker Name"
        trim
        required
      ></b-form-input>
      <b-form-invalid-feedback id="makerName-feedback">
        maker name is required
      </b-form-invalid-feedback>
    </div>

    <div class="mb-3" role="group">
      <label for="makerUrlKey-name"><span class="text-danger">*</span> Maker URL Key</label>
      <b-form-input
        maxlength="30"
        id="makerUrlKey-name"
        v-model="loopRun.makerUrlKey"
        aria-describedby="makerUrlKey-help makerUrlKey-feedback"
        placeholder="Maker URL Key"
        required
      ></b-form-input>
      <b-form-invalid-feedback id="makerUrlKey-feedback">
        maker url key is required
      </b-form-invalid-feedback>
    </div>

    <div class="w-50 mb-3" role="group">
      <label for="versionLimit"><span class="text-danger">*</span> Number of NFTs Allowed for this Collection</label>
      <b-form-input
        id="versionLimit"
        v-model="loopRun.versionLimit"
        :state="versionLimitState"
        aria-describedby="versionLimit-feedback"
        placeholder="NFTs Allowed for this Collection"
        required
      ></b-form-input>
      <b-form-invalid-feedback id="versionLimit-feedback">
        wrong limit for collection
      </b-form-invalid-feedback>
    </div>

    <div class="w-50 mb-3" role="group">
      <label for="punkImageBaseUrl"><span class="text-danger">*</span> Base Image URL (e.g. https://imageserver.com/prod/artists/artist1/sets/set1/)</label>
      <b-form-input
        id="punkImageBaseUrl"
        v-model="loopRun.punkImageBaseUrl"
        aria-describedby="punkImageBaseUrl-feedback"
        placeholder="Base URL to where the images are stored"
        required
      ></b-form-input>
    </div>

    <div class="w-50 mb-3" role="group">
      <label for="punkImageType"><span class="text-danger">*</span> Base Image Type (.jpg, .png etc)</label>
      <b-form-input
        id="punkImageType"
        v-model="loopRun.punkImageType"
        aria-describedby="punkImageType-feedback"
        placeholder="Base image type (include the dot)"
        required
      ></b-form-input>
    </div>

    <div class="mb-3">
      <label for="description">Short Bio for Collection</label>
      <b-textarea
        ref="description"
        v-model="loopRun.description"
        rows="5"
        placeholder="Short Bio for Collection"
      ></b-textarea>
    </div>

    <div class="mb-3" role="group">
      <label for="image">Image or Logo for this Collection</label>
      <b-form-input
        id="image"
        v-model="loopRun.image"
        aria-describedby="image-feedback"
        placeholder="Image for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="mb-3" role="group">
      <label for="image">Video for this Collection</label>
      <b-form-input
        id="video"
        v-model="loopRun.video"
        aria-describedby="video-feedback"
        placeholder="video for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="mb-3" role="group">
      <label for="mintImage1">Minting Image 1 for this Collection</label>
      <b-form-input
        id="mintImage1"
        v-model="loopRun.mintImage1"
        aria-describedby="mintImage1-feedback"
        placeholder="Mint Image 1 for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="mb-3" role="group">
      <label for="mintImage2">Minting Image 2 for this Collection</label>
      <b-form-input
        id="mintImage2"
        v-model="loopRun.mintImage2"
        aria-describedby="mintImage2-feedback"
        placeholder="Mint Image 2 for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="mb-3" role="group">
      <label for="mintImage3">Minting Image 3 for this Collection</label>
      <b-form-input
        id="mintImage3"
        v-model="loopRun.mintImage3"
        aria-describedby="mintImage3-feedback"
        placeholder="Mint Image 3 for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="mb-3" role="group">
      <label for="externalUrl">External URL for this Collection</label>
      <b-form-input
        id="externalUrl"
        v-model="loopRun.externalUrl"
        aria-describedby="externalUrl-feedback"
        placeholder="External Url for this Collection"
        required
      ></b-form-input>
    </div>

    <div class="w-50 mb-3" role="group">
      <label for="spinsPerDay"><span class="text-danger">*</span> Spins Allowed Per Day (only for generative collections)</label>
      <b-form-input
        id="spinsPerDay"
        v-model="loopRun.spinsPerDay"
        aria-describedby="spinsPerDay-help spinsPerDay-feedback"
        placeholder="Spins Allowed Per Day"
        required
      ></b-form-input>
      <b-form-invalid-feedback id="spinsPerDay-feedback">
        Valid spinsPerDay
      </b-form-invalid-feedback>
    </div>

    <b-form-checkbox
      size="lg"
      id="batchMode"
      v-model="loopRun.batchMode"
      name="batchMode"
      value="true"
      unchecked-value="false"
      >
      <div class="text-white pointer"><b>Batch Mode</b></div>
      </b-form-checkbox>

    <div class="w-100 mb-3" role="group">
      <label for="status-name">Batch Size</label>
      <b-form-select id="status-name" v-model="loopRun.batchSize" :options="batchSizeEnum"></b-form-select>
      <b-form-text class="text-warning" id="status-help">Batch Size - the number of collectibles to mint in one contract call</b-form-text>
    </div>
    <div class="w-50 mb-3" role="group">
      <label for="batchPointer">Batch Pointer</label>
      <b-form-input
        id="batchPointer"
        v-model="loopRun.batchPointer"
        aria-describedby="batchPointer-help batchPointer-feedback"
        placeholder="Batch Pointer"
        required
      ></b-form-input>
      <b-form-invalid-feedback id="batchPointer-feedback">
        Valid batchPointer
      </b-form-invalid-feedback>
    </div>

    <div class="my-4 text-right">
      <b-button variant="outline-warning" @click.prevent="checkForm()">Save</b-button>
    </div>
  </b-form>
  </div>
</b-container>
<b-container v-else>
  <LoopbombSpinner />
</b-container>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ManageCollection',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      allocations: false,
      editMode: null,
      currentRunKey: null,
      contractIds: [],
      formSubmitted: false,
      statusEnum: [{ text: 'Active', value: 'active' }, { text: 'Minting Phase', value: 'unrevealed' }, { text: 'Inactive', value: 'inactive' }, { text: 'Disabled', value: 'disabled' }],
      typeEnum: [{ text: 'Traditional', value: 'traditional' }, { text: 'Crypto Punks', value: 'punks' }],
      batchSizeEnum: [1, 5, 10, 15, 20],
      loaded: false,
      defaultDomain: location.hostname,
      loopRun: {
        status: 'active',
        contractId: null,
        image: null,
        mintImage1: null,
        mintImage2: null,
        mintImage3: null,
        video: null,
        makerName: null,
        batchPointer: 0,
        makerUrlKey: null,
        description: null,
        batchMode: true,
        batchSize: 1,
        spinsPerDay: 0,
        currentRunKey: null,
        currentRun: null,
        versionLimit: 100,
        domains: location.hostname
      }
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.currentRunKey
    this.$store.dispatch('rpayStacksContractStore/fetchFullRegistry').then((registry) => {
      this.contractIds = registry.applications.map((o) => o.contractId)
    })
    if (this.currentRunKey) {
      this.editMode = true
      this.$store.dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: this.currentRunKey, stxAddress: this.profile.stxAddress }).then((loopRun) => {
        if (!loopRun) {
          this.$notify({ type: 'error', title: 'Collection', text: 'Unknown key: ' + this.currentRunKey })
          this.editMode = false
          this.currentRunKey = null
        } else {
          this.loopRun = loopRun
        }
        this.loaded = true
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Collection', text: 'Unable to load collection details from key ' + this.currentRunKey })
        this.loaded = false
      })
    } else {
      this.loaded = true
    }
  },
  methods: {
    setRunKey: function () {
      this.loopRun.currentRunKey = this.replaceSpecials(this.loopRun.currentRun, 'runKey')
    },
    setMakerName: function () {
      this.loopRun.makerUrlKey = this.replaceSpecials(this.loopRun.makerName, 'maker')
    },
    replaceSpecials: function (sourceString, field) {
      if (this.editMode) {
        if (field === 'runKey') return this.loopRun.currentRunKey
        else return this.loopRun.makerUrlKey
      }
      const str1 = sourceString.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[]\\\/]/gi, '')
      return str1.replaceAll(' ', '_').toLowerCase()
    },
    checkForm () {
      this.formSubmitted = true
      if (this.makerNameState && this.spinsPerDayState && this.versionLimitState && this.currentRunState) {
        this.save()
      } else {
        this.$notify({ type: 'error', title: 'Info Neeed', text: 'Please enter a value for the field marked as required' })
      }
    },
    save: function () {
      if (!this.loopRun.type) {
        this.$notify({ type: 'error', title: 'Collection', text: 'Please select type!' })
        return
      }
      if (!this.loopRun.contractId) {
        this.$notify({ type: 'error', title: 'Collection', text: 'Collection must belong to a contract!' })
        return
      }
      if (!this.loopRun.currentRun || !this.loopRun.makerName) {
        this.$notify({ type: 'error', title: 'Collection', text: 'Please specify name and maker!' })
        return
      }
      let methos = 'rpayCategoryStore/newLoopRun'
      if (this.editMode) {
        methos = 'rpayCategoryStore/updateLoopRun'
      }
      this.$store.dispatch(methos, this.loopRun).then((loopRun) => {
        this.$notify({ type: 'success', title: 'Collection', text: 'Collection saved!' })
        this.loopRun = loopRun
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Collection', text: 'Collection error!' })
      })
    },
    fetchUserAuthorisation: function () {
      if (!this.stxAddress) return
      this.$store.dispatch('rpayPrivilegeStore/fetchUserAuthorisation', { stxAddress: this.stxAddress }).then((result) => {
        this.currentAuth = result
        if (this.currentAuth.domains) {
          const index = this.currentAuth.domains.findIndex((o) => o.host === this.domain)
          if (index > -1) {
            this.privileges = this.currentAuth.domains[index].privileges.join(' ')
          }
        }
      })
    }
  },
  computed: {
    nftsRemaining () {
      return parseInt(this.loopRun.versionLimit) - this.mintCounter
    },
    spinCounter () {
      if (this.profile.loggedIn) {
        return this.loopRun.spinsPerDay - this.loopRun.spinsToday
      } else {
        return this.loopRun.spinsPerDay
      }
    },
    mintCounter () {
      return Math.min(this.loopRun.versionLimit, this.application.tokenContract.mintCounter)
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application
    },
    versionLimitState () {
      if (!this.formSubmitted && !this.loopRun.versionLimit) return null
      return (this.loopRun.versionLimit >= 1)
    },
    makerNameState () {
      if (!this.formSubmitted) return null
      return (this.loopRun.makerName && this.loopRun.makerName.length > 0)
    },
    spinsPerDayState () {
      if (!this.formSubmitted && !this.loopRun.spinsPerDay) return null
      return (this.loopRun.spinsPerDay >= 0)
    },
    currentRunState () {
      if (!this.formSubmitted && !this.loopRun.currentRun) return null
      return (this.loopRun.currentRun && this.loopRun.currentRun.length > 0)
    },
    domainsState () {
      if (!this.formSubmitted && !this.loopRun.domains) return null
      return (this.loopRun.domains.length > 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.text-muted {
  color: #ffd54f !important;
}
</style>
