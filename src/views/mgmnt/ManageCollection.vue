<template>
<b-container class="text-white" v-if="loaded">
  <h1 class="text-white">Manage NFT Collection</h1>
  <div class="d-flex justify-content-end">
    <b-link class="text-info mt-3" to="/mgmnt/manage-collections"><b-icon icon="chevron-left"/> Back</b-link>
  </div>
  <b-form class="needs-validation form-transparent" novalidate @submit="checkForm" id="contact-form">
  <div class="mb-3" role="group">
    <label for="currentRun-name"><span class="text-danger">*</span> Collection Name (max 30 chars)</label>
    <b-form-input
      maxlength="30"
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
      readonly
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
      readonly
      v-model="loopRun.makerUrlKey"
      aria-describedby="makerUrlKey-help makerUrlKey-feedback"
      placeholder="Maker URL Key"
      required
    ></b-form-input>
    <b-form-invalid-feedback id="makerUrlKey-feedback">
      maker url key is required
    </b-form-invalid-feedback>
  </div>

  <div class="w-100 mb-3" role="group">
    <label for="status-name"><span class="text-danger">*</span> Collection State</label>
    <b-form-select id="status-name" v-model="loopRun.status" :options="statusEnum"></b-form-select>
    <b-form-text class="text-warning" id="status-help">Collection status is active/inactive depending on whether the limit has been reached. They can also be disabled.</b-form-text>
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

  <div class="mb-3" role="group">
    <label for="contractId-name">Contract</label>
    <b-form-input
      id="contractId-name"
      v-model="loopRun.contractId"
      aria-describedby="contractId-help contractId-feedback"
      placeholder="Contract Name"
      required
    ></b-form-input>
    <b-form-invalid-feedback id="contractId-feedback">
      contract id is required
    </b-form-invalid-feedback>
  </div>

  <div class="my-4 text-right">
    <b-button variant="outline-warning" @click.prevent="checkForm()">Save</b-button>
  </div>
</b-form>

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
      editMode: null,
      currentRunKey: null,
      formSubmitted: false,
      statusEnum: ['active', 'inactive', 'disabled'],
      loaded: false,
      loopRun: {
        status: 'active',
        contractId: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME,
        makerName: null,
        makerUrlKey: null,
        spinsPerDay: 0,
        currentRunKey: null,
        currentRun: null,
        versionLimit: 100
      }
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.currentRunKey
    if (this.currentRunKey) {
      this.editMode = true
      this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.currentRunKey).then((loopRun) => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.text-muted {
  color: #ffd54f !important;
}
</style>
