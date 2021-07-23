<template>
<div>
  <div class="mb-2" role="group">
    <label for="name">Name / Moniker</label>
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
    <b-form-text id="name-help">A name is needed to upload this item</b-form-text>
  </div>
  <div class="mb-2" role="group">
    <label for="website">Website</label>
    <b-form-input
      id="website"
      v-model="userProfile.links.website"
      :state="websiteState"
      aria-describedby="website-help website-feedback"
      placeholder="Enter website"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="website-feedback">
      website
    </b-form-invalid-feedback>
    <b-form-text id="item-name-help">The artists website is needed to upload this item</b-form-text>
  </div>
  <div class="mb-2" role="group">
    <label for="website">Instagram</label>
    <b-form-input
      id="instagram"
      v-model="userProfile.links.instagram"
      :state="instagramState"
      aria-describedby="instagram-help instagram-feedback"
      placeholder="Enter instagram"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="instagram-feedback">
      Instagram
    </b-form-invalid-feedback>
    <b-form-text id="instagram-help">The artists instagram is needed to upload this item</b-form-text>
  </div>
  <div class="mb-2" role="group">
    <label for="description">Bio / short description about you and your work!</label>
    <b-form-textarea
      ref="description"
      v-model="userProfile.description"
      rows="5"
      style="padding: 20px 20px;"
      ></b-form-textarea>
  </div>
  <div class="my-4 text-right"><b-button class="" variant="warning" @click="$emit('updateProfile', { opcode: 'update' })">{{buttonLabel()}}</b-button></div>
</div>
</template>

<script>
export default {
  name: 'ExhibitApplicationForm',
  props: ['userProfile', 'referer'],
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
    buttonLabel: function () {
      if (this.referer === 'exhibit-here') {
        return 'Apply Now'
      }
      return 'Save'
    }
  },
  computed: {
    nameState () {
      if (!this.formSubmitted && !this.userProfile.name) return null
      return (this.userProfile.name && this.userProfile.name.length > 2)
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
