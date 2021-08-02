<template>
<b-container>
  <b-row class="my-5">
    <b-col>
      <h1>Tell us about yourself</h1>
      <p>Fill in the form below - you'll hear back from us within 2 working days!</p>
    </b-col>
  </b-row>
  <b-row class="my-5">
    <b-col md="8" sm="12">
      <ExhibitApplicationForm :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" />
    </b-col>
    <b-col md="4" sm="12" class="text-center">
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
        email: null,
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
    registerExhibitRequest: function () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        status: 1,
        domain: location.hostname,
        name: this.userProfile.name,
        stxAddress: profile.stxAddress,
        email: this.userProfile.email
      }
      this.$store.dispatch('rpayMyItemStore/registerExhibitRequest', data).then((result) => {
        this.$store.commit('setModalMessage', 'Thanks for registering to exhibit your artwork - we will get back to you very soon.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
        this.message = result
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error - we will keep you updated.')
        this.showRpay = 0
        this.$bvModal.hide('asset-offer-modal')
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
        this.registerExhibitRequest()
        this.$notify({ type: 'warning', title: 'Profile', text: 'Profile has been saved!' })
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error occurred processing file upload.')
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
