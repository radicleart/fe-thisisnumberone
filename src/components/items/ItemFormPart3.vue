<template>
<div>
  <div class="mb-3" role="group">
    <label for="item-creator">Cover artist <a class="text-danger" href="#" @click.prevent="useMyAddress('cover')">(use my username)</a></label>
    <b-form-input
      id="item-cover-artist"
      v-model="item.coverArtist"
      :state="itemCoverArtistState"
      aria-describedby="item-cover-artist-help item-cover-artist-feedback"
      placeholder="Enter item maker"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-cover-artist-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
    <b-form-text id="item-creator-help">The cover artist or maker of the artwork</b-form-text>
  </div>
  <div v-if="upload" class="my-4 text-right"><b-button class="" variant="danger" @click.prevent="$emit('upload-state', { change: 'done' })">Continue</b-button></div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
export default {
  name: 'ItemFormPart1',
  props: ['upload', 'item', 'formSubmitted'],
  data: function () {
    return {
      systemKeywords: null
    }
  },
  mounted () {
    this.$store.dispatch('publicItemsStore/fetchKeywords').then((keywords) => {
      this.systemKeywords = keywords
    })
  },
  methods: {
    useMyAddress: function (type) {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (type === 'cover') {
        this.item.coverArtist = profile.username
      }
    }
  },
  computed: {
    itemCoverArtistState () {
      if (!this.formSubmitted && !this.item.coverArtist) return null
      return (this.item.coverArtist && this.item.coverArtist.length > 1)
    }
  }
}
</script>

<style scoped>
</style>
