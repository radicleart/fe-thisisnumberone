<template>
<div class="upload-preview bg-white text-dark">
  <h1 class="mb-4 text-black d-flex justify-content-between">
    <span>Your Profile</span> <span class="pointer" style="font-size: 1.4rem;" @click="$emit('openEdit')"><b-icon icon="pencil"/></span>
  </h1>
  <h2 class="mb-4">{{userProfile.name}}</h2>
  <p class="mb-4 text-bio">{{userProfile.description}}</p>
  <p v-if="userProfile.email">Email:<br/><a class="pointer text-bold text-dark" :href="'mailto:' + userProfile.email" target="_blank">{{userProfile.email}}</a></p>
  <p v-if="userProfile.links.website">Website:<br/><a class="text-bold text-dark" :href="userProfile.links.website" target="_blank">{{userProfile.links.website}}</a></p>
  <p v-if="userProfile.links.instagram">Instagram:<br/><a class="text-bold text-dark" :href="userProfile.links.instagram" target="_blank">{{userProfile.links.instagram}}</a></p>
  <p v-if="userProfile.links.twitter">Twitter:<br/><a class="text-bold text-dark" :href="userProfile.links.twitter" target="_blank">{{userProfile.links.twitter}}</a></p>
</div>
</template>

<script>
export default {
  name: 'ProfileDisplay',
  props: ['userProfile', 'redirect'],
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
    isValid: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    buttonLabel: function () {
      if (this.redirect === 'exhibit-here') {
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
