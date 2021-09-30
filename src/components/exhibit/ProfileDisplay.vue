<template>
<div class="upload-preview bg-white text-dark">
  <h1 class="mb-4 text-black d-flex justify-content-between">
    <span>Your Profile</span> <span class="pointer" style="font-size: 1.4rem;" @click="$emit('openEdit')"><b-icon icon="pencil"/></span>
  </h1>
  <h2 class="mb-4">{{userProfile.name}}</h2>
  <p class="mb-4 text-bio">{{userProfile.description}}</p>
  <p v-if="userProfile.email">Email:<br/><a class="pointer text-bold text-dark" :href="'mailto:' + userProfile.email" target="_blank">{{userProfile.email}}</a></p>
  <p v-else>Email:<br/><a class="text-bold text-dark">None</a></p>
  <p v-if="userProfile.links.website">Website:<br/><a class="text-bold text-dark" :href="userProfile.links.website" target="_blank">{{userProfile.links.website}}</a></p>
  <p v-else>Website:<br/><a class="text-bold text-dark">None</a></p>
  <p v-if="userProfile.links.twitter">Twitter:<br/><a class="text-bold text-dark" :href="userProfile.links.twitter" target="_blank">{{userProfile.links.twitter}}</a></p>
  <p v-else>Twitter:<br/><a class="text-bold text-dark">None</a></p>
  <p v-if="userProfile.links.instagram">Instagram:<br/><a class="text-bold text-dark" :href="userProfile.links.instagram" target="_blank">{{userProfile.links.instagram}}</a></p>
  <p v-else>Instagram:<br/><a class="text-bold text-dark">None</a></p>
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
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
