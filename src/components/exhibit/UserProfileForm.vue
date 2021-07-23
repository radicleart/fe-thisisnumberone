<template>
<b-container>
  <b-row class="my-5">
    <b-col md="6" sm="12">
      <ExhibitApplicationForm :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" />
    </b-col>
    <b-col md="6" sm="12" class="w-100 text-center">
      <UserProfileImage :referer="referer" @updateProfile="updateProfile" :avatar="userProfile.avatar" class="mt-5"/>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import ExhibitApplicationForm from '@/components/exhibit/ExhibitApplicationForm'
import UserProfileImage from '@/components/exhibit/UserProfileImage'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'UserProfileForm',
  components: {
    ExhibitApplicationForm,
    UserProfileImage
  },
  props: ['referer'],
  data: function () {
    return {
      userProfile: {
        avatar: null,
        name: null,
        description: null,
        links: {
          website: null,
          instagram: null,
          facebook: null,
          twitter: null
        }
      }
    }
  },
  watch: {
  },
  mounted () {
    this.$store.dispatch('rpayMyItemStore/initSchema', false).then((rootFile) => {
      if (rootFile.userProfile) {
        this.userProfile = rootFile.userProfile
      }
    })
  },
  methods: {
    emailText () {
      const emailText = this.$store.getters[APP_CONSTANTS.KEY_EMAIL_TEXT]('registeremail')
      const answer = (emailText) ? emailText[0].text : 'Interest Registered'
      return answer
    },
    registerForUpdates: function () {
      const data = {
        emailContent: this.emailText(),
        status: 1,
        domain: location.host,
        assetHash: this.assetHash,
        email: 'mike@risidio.com'
      }
      this.$store.dispatch('rpayPurchaseStore/registerForUpdates', data).then((result) => {
        this.$store.commit('setModalMessage', 'Thanks for registering to exhibit artwork here - we will get back to you within the next day or two.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.message = result
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Thanks for re-registering an interest - we will keep you updated.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
      })
    },
    updateProfile: function (data) {
      if (data.mediaItem) {
        this.userProfile.avatar = data.mediaItem
        this.userProfile.avatar.dataUrl = null // the image should be stored in gaia by this point
      } else if (data.deleteMedia) {
        this.userProfile.avatar = null
      }
      this.$store.commit('setModalMessage', 'Saving your data to your gaia hub.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('rpayMyItemStore/saveUserProfile', this.userProfile).then((rootFile) => {
        this.userProfile = rootFile.userProfile
        this.$store.commit('setModalMessage', 'Letting everyone know you\'d like to exhibit your artwork here.')
        this.registerForUpdates()
        this.$notify({ type: 'warning', title: 'Profile', text: 'Profile has been saved!' })
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error occurred processing file upload.')
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      })
    }
  },
  computed: {
    nameState () {
      if (!this.formSubmitted && !this.userProfile.name) return null
      return (this.userProfile.name && this.userProfile.name.length > 2)
    },
    websiteState () {
      if (!this.formSubmitted && !this.userProfile.links.website) return null
      return (this.userProfile.links.website)
    },
    instagramState () {
      if (!this.formSubmitted && !this.userProfile.links.instagram) return null
      return (this.userProfile.links.instagram)
    }
  }
}
</script>

<style scoped>
</style>
