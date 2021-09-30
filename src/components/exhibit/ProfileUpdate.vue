<template>
<div class="text-dark">
  <div class="text-right text-small"><b-link @click="$emit('cancel')" class="pt-1 px-3 text-danger"><b-icon icon="chevron-left"/> Back</b-link></div>
  <div class="text-white"><h3>About You</h3></div>
  <div class="text-danger">
    <MediaItemGeneral v-if="userProfile.avatar" :classes="'avatar-image'" :options="options" @deleteMediaItem="deleteMediaItem" :mediaItem="userProfile.avatar"/>
    <MyAvatar v-else @updateProfile="updateProfile" :avatar="userProfile.avatar"/>
  </div>
  <b-card class="mt-1" role="group">
    <label for="name">First / Last Name<span class="text-danger">*</span></label>
    <b-form-input
      id="name"
      v-model="userProfile.name"
      :state="nameState"
      aria-describedby="name-help name-feedback"
      placeholder="Enter your name"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="name-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
    <label for="name">Tag / Moniker<span class="text-danger">*</span></label>
    <b-form-input
      id="name"
      v-model="userProfile.tag"
      :state="tagState"
      aria-describedby="tag-help tag-feedback"
      placeholder="Enter your tag"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="tag-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
    <label for="description">Bio / short description about you and your work!</label>
    <b-form-textarea
      ref="description"
      v-model="userProfile.description"
      rows="5"
      style="padding: 20px 20px;"
      ></b-form-textarea>
  </b-card>

  <div class="text-white mt-5"><h3>Social Links</h3></div>
  <b-card class="mt-1" role="group">
    <label for="email">Email<span class="text-danger">*</span></label>
    <b-form-input
      id="email"
      v-model="userProfile.email"
      :state="emailState"
      aria-describedby="email-help email-feedback"
      placeholder="Enter email"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="email-feedback">
      Email - used only to contact you in relation to exhibiting work
    </b-form-invalid-feedback>
    <label for="website">Website, portfolio or a link to your work on e.g. google drive</label>
    <b-form-input
      id="website"
      v-model="userProfile.links.website"
      :state="websiteState"
      aria-describedby="website-help website-feedback"
      placeholder="https://..."
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="website-feedback">
      website or portfolio
    </b-form-invalid-feedback>
    <label for="twitter">Twitter</label>
    <b-form-input
      id="twitter"
      v-model="userProfile.links.twitter"
      aria-describedby="twitter-help twitter-feedback"
      placeholder="https://..."
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="website-feedback">
      twitter
    </b-form-invalid-feedback>
    <label for="instagram">Instagram</label>
    <b-form-input
      id="instagram"
      v-model="userProfile.links.instagram"
      aria-describedby="instagram-help instagram-feedback"
      placeholder="https://..."
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="instagram-feedback">
      Instagram
    </b-form-invalid-feedback>
  </b-card>

  <div class="text-white mt-5"><h3>Agreements</h3></div>
  <b-card role="group">
    <div class="mb-4"><PrismicItems :prismicItems="content.termsofuse"/></div>
    <b-form-checkbox
      size="lg"
      id="termsofuse"
      v-model="userProfile.termsofuse"
      name="termsofuse"
      value="accepted"
      unchecked-value="unaccepted"
    >
    <div class="pointer"><b>Agree Terms</b><span class="text-danger">*</span></div>
    </b-form-checkbox>
  </b-card>

  <div class="my-4 text-left"><b-button class="" variant="danger" @click="$emit('updateProfile', { opcode: 'update' })">Save</b-button></div>
</div>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'
import MediaItemGeneral from '@/components/upload/MediaItemGeneral'
import MyAvatar from '@/components/exhibit/MyAvatar'

export default {
  name: 'ProfileUpdate',
  components: {
    PrismicItems,
    MediaItemGeneral,
    MyAvatar
  },
  props: ['content', 'userProfile', 'redirect'],
  data: function () {
    return {
      systemKeywords: null,
      displayKeywords: '',
      keywords: null
    }
  },
  watch: {
  },
  methods: {
    deleteMediaItem: function () {
      this.userProfile.avatar = null
      this.$store.commit('setModalMessage', 'Saving your data to your gaia hub.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('rpayMyItemStore/saveUserProfile', this.userProfile).then((rootFile) => {
        this.userProfile = rootFile.userProfile
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$notify({ type: 'warning', title: 'Profile', text: 'Removed avatar image!' })
        this.stage = 0
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error occurred updating profile.')
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
        this.$store.commit('setModalMessage', 'Error occurred saving profile.')
      })
    },
    isValid: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  },
  computed: {
    options () {
      return {
        deleteAllowed: true,
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
    },
    nameState () {
      if (!this.formSubmitted && !this.userProfile.name) return null
      return (this.userProfile.name && this.userProfile.name.length > 2)
    },
    tagState () {
      if (!this.formSubmitted && !this.userProfile.tag) return null
      return (this.userProfile.tag && this.userProfile.tag.length > 2)
    },
    termsofuseState () {
      if (!this.formSubmitted && !this.userProfile.termsofuse) return null
      return (this.userProfile.termsofuse && this.userProfile.termsofuse.length > 2)
    },
    emailState () {
      if (!this.formSubmitted && !this.userProfile.email) return null
      return (this.isValid(this.userProfile.email))
    },
    websiteState () {
      if (!this.formSubmitted && !this.userProfile.links.website) return null
      return (this.userProfile.links.website.length > 0)
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
