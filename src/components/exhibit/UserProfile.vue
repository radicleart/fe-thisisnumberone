<template>
<section v-if="content" class="text-info text-danger">
  <b-container class="center-section py-5">
    <b-row align-h="center">
      <b-col v-if="stage === 0" align-self="start" md="6" sm="10" xs="8" class="mb-4 d-flex justify-content-end">
        <MediaItemGeneral v-if="userProfile.avatar" :classes="'avatar-image'" :options="options" :mediaItem="userProfile.avatar"/>
        <b-avatar v-else square variant="light" size="600px"></b-avatar>
      </b-col>
      <b-col v-if="stage === 0" md="6" sm="10" xs="8" align-self="start" class="text-left text-white pr-5" style="position: relative; top: 5px;">
        <b-row>
          <b-col>
            <ProfileDisplay class="p-5" :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" @openEdit="stage = 1" />
            <div v-if="this.showExhibitRequest==true" class="my-4 text-left">
              <b-button v-b-tooltip.hover :title="incompleteProfileMessage" :disabled="!profileComplete" variant="danger" v-on:click="this.registerExhibitRequest">Apply Now</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="8" sm="12" class="p-5" v-else>
        <ProfileUpdate :content="content" :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" @cancel="stage = 0"/>
      </b-col>
    </b-row>
  </b-container>
</section>
<section class="bg-black" v-else>
<b-container class="my-5" v-if="loaded">
  <b-row align-h="center" style="min-height: 80vh;">
    <b-col class="px-4" md="6" sm="12" align-self="end" v-if="stage === -10">
      <PrismicItems :prismicItems="content.start"/>
    </b-col>
    <b-col :md="(stage === 0) ? 10 : 12" sm="12" class="mt-4 bg-warning p-5" v-if="stage === 0">
      <b-row align-h="center">
        <b-col md="6" sm="12" align-self="start">
          <ProfileDisplay :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" @openEdit="stage = 1" />
          <div v-if="this.showExhibitRequest==true" class="my-4 text-left">
            <b-button v-b-tooltip.hover :title="incompleteProfileMessage" :disabled="!profileComplete" variant="danger" v-on:click="this.registerExhibitRequest">Apply Now</b-button>
          </div>
        </b-col>
        <b-col md="6" sm="12" align-self="start">
          <MediaItemGeneral v-if="userProfile.avatar" :classes="'avatar-image'" :options="options" :mediaItem="userProfile.avatar"/>
          <b-avatar v-else square variant="light" size="600px"></b-avatar>
        </b-col>
      </b-row>
    </b-col>
    <b-col md="8" sm="12" class="bg-warning p-5" v-else>
      <ProfileUpdate :content="content" :referer="referer" :userProfile="userProfile" @updateProfile="updateProfile" @cancel="stage = 0"/>
    </b-col>
  </b-row>
</b-container>
</section>

</template>

<script>
import ProfileDisplay from '@/components/exhibit/ProfileDisplay'
import ProfileUpdate from '@/components/exhibit/ProfileUpdate'
import { APP_CONSTANTS } from '@/app-constants'
import PrismicItems from '@/components/prismic/PrismicItems'
import MediaItemGeneral from '@/views/marketplace/components/media/MediaItemGeneral'

export default {
  name: 'UserProfile',
  components: {
    ProfileUpdate,
    PrismicItems,
    ProfileDisplay,
    MediaItemGeneral
  },
  props: ['exhibitRequest', 'showExhibitRequest', 'referer', 'content'],
  data: function () {
    return {
      stage: 0,
      loaded: false,
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
      this.loaded = true
    })
  },
  methods: {
    emailText () {
      const emailText = this.$store.getters[APP_CONSTANTS.KEY_EMAIL_TEXT]('registeremail')
      const answer = (emailText) ? emailText[0].text : 'Interest Registered'
      return answer
    },
    registerExhibitRequest: function () {
      this.$store.commit('setModalMessage', 'Letting everyone know you\'d like to exhibit your artwork here.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        status: 1,
        domain: location.hostname,
        name: this.userProfile.name,
        stxAddress: profile.stxAddress,
        email: this.userProfile.email
      }
      this.$store.dispatch('rpayMyItemStore/registerExhibitRequest', data).then((result) => {
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$notify({ type: 'warning', title: 'Apply to Exhibit', text: 'Thanks for registering to exhibit your artwork - we will get back to you very soon.' })
        this.stage = 0
        this.$emit('updateExhibitRequest', result)
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error - we will keep you updated.')
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
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$notify({ type: 'warning', title: 'Profile', text: 'Profile has been saved!' })
        this.stage = 0
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
    },
    profileComplete () {
      if (this.userProfile.name && this.userProfile.email && this.userProfile.avatar) return true
      return false
    },
    incompleteProfileMessage () {
      const missingFieldsList = []

      if (this.userProfile.name === null || this.userProfile.name === '') missingFieldsList.push('your name')
      if (this.userProfile.email === null || this.userProfile.email === '') missingFieldsList.push('an email address')
      if (this.userProfile.avatar === null) missingFieldsList.push('a profile image')

      if (missingFieldsList.length === 0) return ''

      let missingFields = missingFieldsList.join(', ')

      if (missingFieldsList.length > 1) {
        missingFields = missingFields.substring(0, missingFields.lastIndexOf(', ')) + ' and ' + missingFields.substring(missingFields.lastIndexOf(', ') + 1)
      }

      return 'Edit your profile and add ' + missingFields + ' to apply!'
    },
    options () {
      return {
        deleteAllowed: false,
        emitOnHover: false,
        playOnHover: false,
        assetHash: 'userAvatar',
        bigPlayer: false,
        autoplay: false,
        muted: true,
        controls: true,
        showMeta: true,
        aspectRatio: '1:1',
        poster: (this.avatar) ? this.avatar.fileUrl : null,
        sources: [],
        fluid: false
      }
    }
  }
}
</script>

<style scoped>
</style>
