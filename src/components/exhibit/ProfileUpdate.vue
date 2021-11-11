<template>
<div class="text-dark">
  <div class="text-right text-small"><b-link @click="$emit('cancel')" class="pt-1 px-3 text-danger"><b-icon icon="chevron-left"/> Back</b-link></div>
  <div class="text-white"><h3>About You</h3></div>
  <div class="text-danger">
    <MediaItemGeneral v-if="userProfile.image" :classes="'avatar-image'" :options="options" @deleteMediaItem="deleteMediaItem" :mediaItem="{ fileUrl: userProfile.image }"/>
    <MyAvatar v-else @updateProfile="updateProfile" :avatar="userProfile.image"/>
  </div>
  <b-card class="mt-1" role="group">
    <label for="name">First / Last Name<span class="text-danger">*</span></label>
    <b-form-input
      id="name"
      v-model="userProfile.name"
      :state="nameState"
      aria-describedby="name-feedback"
      placeholder="Enter your name"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="name-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
    <label for="tag">Tag / Moniker<span class="text-danger">*</span></label>
    <b-form-input
      id="tag"
      v-model="userProfile.tag"
      :state="tagState"
      aria-describedby="tag-feedback"
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
      aria-describedby="email-feedback"
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
      placeholder="https://..."
      trim
    ></b-form-input>
    <label for="twitter">Twitter</label>
    <b-form-input
      id="twitter"
      v-model="userProfile.links.twitter"
      placeholder="https://..."
      trim
    ></b-form-input>
    <label for="instagram">Instagram</label>
    <b-form-input
      id="instagram"
      v-model="userProfile.links.instagram"
      placeholder="https://..."
      trim
    ></b-form-input>
  </b-card>

  <div class="text-white mt-5"><h3>Agreements</h3></div>
  <b-card role="group">
    <div class="mb-4"><PrismicItems :prismicItems="content.termsofuse"/></div>
    <b-form-checkbox
      size="lg"
      id="termsofuse"
      v-model="userProfile.termsOfUse"
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
import MediaItemGeneral from '@/views/marketplace/components/media/MediaItemGeneral'
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
      this.userProfile.image = null
      this.$store.commit('setModalMessage', 'Saving your data to your gaia hub.')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('rpayProfileStore/saveProfile', this.userProfile).then(() => {
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$notify({ type: 'warning', title: 'Profile', text: 'Removed profile image!' })
        this.stage = 0
      }).catch(() => {
        this.$store.commit('setModalMessage', 'Error occurred updating profile.')
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
        showMeta: false,
        aspectRatio: '1:1',
        poster: this.image,
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
    emailState () {
      if (!this.formSubmitted && !this.userProfile.email) return null
      return (this.isValid(this.userProfile.email))
    }
  }
}
</script>

<style scoped>
</style>
