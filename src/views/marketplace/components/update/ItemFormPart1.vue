<template>
<div>
  <!--
  <div class="text-left">
    <b-form-checkbox size="lg" @change="togglePrivacy" v-model="publicAvailable" name="check-button" switch class="text-warning">
      <h2 v-if="!publicAvailable" class="text-danger"><b>Private</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Not visible in search and not displayed in the Marketplace'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></h2>
      <h2 v-else class="text-success"><b>Public</b> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'Visible in search and displayed in the Marketplace'" class="ml-2" variant="outline-success"><b-icon icon="question-circle"/></b-link></h2>
    </b-form-checkbox>
  </div>
  -->
  <div class="mb-3" role="group">
    <label for="item-name">Title :</label>
    <b-form-input
      id="item-name"
      v-model="item.name"
      :state="itemNameState"
      aria-describedby="item-name-help item-name-feedback"
      placeholder="Enter name of NFT"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-name-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
  </div>
  <div class="mb-3" role="group">
    <label for="item-name">Artist / Maker / Creator</label>
    <b-form-input
      id="artist-name"
      v-model="item.artist"
      :state="itemArtistState"
      aria-describedby="item-artist-help item-artist-feedback"
      placeholder="Enter artist name"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-artist-feedback">
      Enter the name of the artist
    </b-form-invalid-feedback>
  </div>
  <div class="mb-4" role="group">
    <label for="item-name">Description :</label>
    <b-form-textarea
      ref="description"
      v-model="item.description"
      rows="5"
      style="padding: 20px 20px;"
      ></b-form-textarea>
  </div>
  <CategoryChoice :item="item" />
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import CategoryChoice from '@/views/marketplace/components/update/CategoryChoice'

export default {
  name: 'ItemFormPart1',
  components: {
    CategoryChoice
  },
  props: ['upload', 'item', 'formSubmitted'],
  data: function () {
    return {
      publicAvailable: true
    }
  },
  mounted () {
    if (!this.item.privacy) {
      this.item.privacy = 'public'
    }
    this.publicAvailable = this.item.privacy === 'public'
  },
  methods: {
    togglePrivacy: function () {
      if (this.publicAvailable) {
        this.item.privacy = 'public'
      } else {
        this.item.privacy = 'private'
      }
    }
  },
  computed: {
    categories () {
      const categories = this.$store.getters[APP_CONSTANTS.KEY_CATEGORIES]
      if (categories) return categories
      return []
    },
    itemNameState () {
      if (!this.formSubmitted && !this.item.name) return null
      return (this.item.name && this.item.name.length > 2)
    },
    itemArtistState () {
      if (!this.formSubmitted && !this.item.artist) return null
      return (this.item.artist && this.item.artist.length > 2)
    }
  }
}
</script>

<style scoped>
</style>
