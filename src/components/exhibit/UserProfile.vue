<template>
<section v-if="content" class="text-info text-danger">
  <b-container class="center-section py-5">
    <b-row align-h="center">
      <b-col v-if="stage === 0" align-self="center" md="6" sm="10" xs="8" class="mb-4 d-flex justify-content-center align-items-center">
        <MediaItemGeneral v-if="userProfile.image" :classes="'avatar-image'" :options="options" :mediaItem="{ fileUrl: userProfile.image }"/>
        <b-avatar v-else variant="light" size="4em" v-b-tooltip.hover title="Edit your profile to upload an avatar image"></b-avatar>
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
          <MediaItemGeneral v-if="userProfile.image" :classes="'avatar-image'" :options="options" :mediaItem="{ fileUrl: userProfile.image }"/>
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
        image: null,
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
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    this.$store.dispatch('rpayProfileStore/fetchProfile', profile.stxAddress).then((userProfile) => {
      if (userProfile) {
        this.userProfile = userProfile
      } else {
        this.userProfile.stxAddress = profile.stxAddress

        this.$store.dispatch('rpayMyItemStore/initSchema', false).then((rootFile) => {
          if (rootFile.userProfile) {
            if (rootFile.userProfile.avatar) this.userProfile.image = rootFile.userProfile.avatar.fileUrl
            this.userProfile.name = rootFile.userProfile.name
            this.userProfile.email = rootFile.userProfile.email
            this.userProfile.tag = rootFile.userProfile.tag
            this.userProfile.termsOfUse = rootFile.userProfile.termsofuse
            this.userProfile.description = rootFile.userProfile.description
            if (rootFile.userProfile.links) {
              this.userProfile.links.website = rootFile.userProfile.links.website
              this.userProfile.links.instagram = rootFile.userProfile.links.instagram
              this.userProfile.links.facebook = rootFile.userProfile.links.facebook
              this.userProfile.links.twitter = rootFile.userProfile.links.twitter
            }
            this.$store.dispatch('rpayProfileStore/saveProfile', this.userProfile).then(() => {
              this.$store.dispatch('rpayMyItemStore/deleteUserProfile', false).then(() => {
                console.log('Successfully migrated profile')
              }).catch((exception) => {
                this.$store.commit('setModalMessage', 'Error occurred deleting user profile from Gaia: ' + exception)
              })
            }).catch((exception) => {
              this.$store.commit('setModalMessage', 'Error occurred saving profile to the db: ' + exception)
            })
          }
        })
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
        this.userProfile.image = data.mediaItem.fileUrl
      } else if (data.deleteMedia) {
        this.userProfile.image = null
      }
      this.$store.commit('setModalMessage', 'Saving your data to your gaia hub.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('rpayProfileStore/saveProfile', this.userProfile).then(() => {
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
      if (this.userProfile.email && this.userProfile.image && this.userProfile.termsOfUse === 'accepted') return true
      return false
    },
    incompleteProfileMessage () {
      const missingFieldsList = []

      if (this.userProfile.email === null || this.userProfile.email === '') missingFieldsList.push('add an email address')
      if (this.userProfile.image === null) missingFieldsList.push('add a profile image')
      if (this.userProfile.termsOfUse !== 'accepted') missingFieldsList.push('accept the T\'s and C\'s')

      if (missingFieldsList.length === 0) return ''

      return 'Edit your profile and ' + missingFieldsList.join(' and ') + ' to apply!'
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
        showMeta: false,
        aspectRatio: '1:1',
        poster: this.image,
        sources: [],
        fluid: false
      }
    }
  }
}
</script>

<style scoped>
</style>
