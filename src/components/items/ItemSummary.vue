<template>
<div class="row">
  <div class="col-6">
    <div class="mb-4" v-if="itemSummary.item.name"><h6 class="text-bold">{{itemSummary.item.name}}</h6></div>
    <h6 class="mb-4" v-else>{{itemSummary.displayTitle}}</h6>
    <div class="upload-preview mb-2">
      <div v-if="hasFile('music')">
        <div class="mb-4">
          <h6><b-icon icon="film"/> Artwork File</h6>
          <b-icon  v-if="itemSummary.loadingState === 1" icon="cylon-vertical"/>
          <a class="text-success" href="#" @click.prevent="showHash = !showHash"> {{ itemSummary.item.nftMedia.musicFile.name }}</a>
          <div v-if="showHash">{{ itemSummary.item.assetHash }}</div>
        </div>
      </div>
      <div v-if="hasFile('cover')" class="mb-4">
        <div class="">
          <h6><b-icon icon="film"/> Artwork Clip File</h6>
          <span class="text-success">{{ itemSummary.item.nftMedia.coverImage.name }}</span>
        </div>
        <div class="mb-2" v-if="itemSummary.item.nftMedia.coverArtist">Cover Art: <span class="text-success">{{ itemSummary.item.nftMedia.coverArtist }}</span></div>
      </div>
    </div>
    <div class="mb-2" v-if="itemSummary.item.description"><span class="text-small">{{itemSummary.item.description}}</span></div>
    <div class="mb-2 text-small" v-if="itemSummary.item.keywords"><span  class="mr-1" :class="(itemSummary.item.keywords) ? 'text-success' : ''" v-for="(kw, index) in itemSummary.item.keywords" :key="index">#{{kw.name}}</span></div>
    <div class="mb-2 text-small" v-if="hasEditions()"><span :class="(hasEditions()) ? 'text-success' : 'text-success'">Editions: {{itemSummary.item.editions}}</span></div>
    <div class="my-4 text-small" v-if="itemSummary.isValid"><b-button class="w-100" variant="success" @click.prevent="$emit('upload-item')">Upload</b-button></div>
  </div>
  <div class="col-6">
    <div :style="bannerImage" class="text-right">
      <a @click.prevent="deleteMediaItem()" href="#" class="p-3 text-danger"><b-icon icon="x-circle"/></a>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemSummary',
  props: ['itemSummary'],
  data: function () {
    return {
      showHash: false
    }
  },
  methods: {
    deleteMediaItem: function () {
      this.$store.dispatch('myItemStore/deleteMediaItem', { item: this.itemSummary.item, mediaId: 'coverImage' }).then(() => {
        this.$emit('delete-cover')
      })
    },
    hasEditions: function () {
      if (this.itemSummary.item.editions) {
        const numbE = parseInt(this.itemSummary.item.editions)
        return numbE > 0
      }
      return false
    },
    hasFile: function (type) {
      if (type === 'music') {
        return (this.itemSummary.item.nftMedia.musicFile) ? this.itemSummary.item.nftMedia.musicFile.name : null
      }
      return (this.itemSummary.item.nftMedia.coverImage) ? this.itemSummary.item.nftMedia.coverImage.name : null
    }
  },
  computed: {
    bannerImage () {
      let imageUrl = this.itemSummary.item.nftMedia.imageUrl
      if (this.itemSummary.item.nftMedia.coverImage && this.itemSummary.item.nftMedia.coverImage.dataUrl) {
        imageUrl = this.itemSummary.item.nftMedia.coverImage.dataUrl
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](imageUrl)
    }
  }
}
</script>

<style scoped>
</style>
