<template>
<div>
  <div class="mb-3" role="group">
    <label for="item-name">Name of Item</label>
    <b-form-input
      id="item-name"
      v-model="item.name"
      :state="itemNameState"
      aria-describedby="item-name-help item-name-feedback"
      placeholder="Enter item name"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-name-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>
    <b-form-text id="item-name-help">A name is needed to upload this item</b-form-text>
  </div>

  <div class="text-right mb-4">
    <b-form-checkbox class="" id="item-private" size="sm" v-model="item.private" name="check-button" switch>
      <label for="item-private"><span :class="(!item.private) ? 'text-success' : ''">public</span> / <span :class="(item.private) ? 'text-danger' : ''">private</span></label>
      <b-icon class="ml-2" v-b-tooltip.hover :title="'Private to encrypt the file'" icon="question-circle"/>
    </b-form-checkbox>

  </div>

  <div class="mb-4" role="group">
    <label for="item-name">Enter a short description - good for search results!</label>
    <b-form-textarea
      ref="description"
      v-model="item.description"
      rows="5"
      style="padding: 20px 20px;"
      ></b-form-textarea>
  </div>

  <div class="mb-3" role="group">
    <label for="item-keywords">Select or Enter Keywords</label>
    <div class="mb-3"><b-badge @click="addKeyword(kw)" class="mx-2" v-for="(kw, index) in systemKeywords" :key="index" pill variant="danger">{{kw}}</b-badge></div>
    <b-form-input
      id="item-keywords"
      v-model="displayKeywords"
      :state="itemKeywordsState"
      @change="changeKeywords"
      aria-describedby="item-keywords-help item-keywords-feedback"
      placeholder="Enter keywords"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-keywords-feedback">
      Keywords maybe be required
    </b-form-invalid-feedback>
    <b-form-text id="item-keywords-help">The keywords needed to identify this music</b-form-text>
    <div v-if="upload" class="my-4 text-right"><b-button class="" variant="danger" @click.prevent="$emit('upload-state', { change: 'up' })">Next</b-button></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ItemFormPart1',
  props: ['upload', 'item', 'formSubmitted'],
  data: function () {
    return {
      systemKeywords: null,
      displayKeywords: ''
    }
  },
  watch: {
    'displayKeywords' () {
      this.changeKeywords()
    }
  },
  mounted () {
    this.$store.dispatch('publicItemsStore/fetchKeywords').then((keywords) => {
      this.systemKeywords = keywords
    })
  },
  methods: {
    addKeyword: function (keyword) {
      if (!this.item.keywords) {
        this.item.keywords = []
      }
      const atIndex = this.item.keywords.find(k => k.name === keyword)
      if (!atIndex) {
        this.item.keywords.push({
          name: keyword.trim()
        })
      }
      this.displayKeywords = ''
      this.item.keywords.forEach((keyword) => {
        this.displayKeywords += keyword.name + ' '
      })
    },
    changeKeywords: function () {
      if (!this.item.keywords) {
        this.item.keywords = []
      }
      if (!this.displayKeywords) {
        this.displayKeywords = ''
      }
      const dkw = this.displayKeywords.split(' ')
      this.item.keywords = []
      dkw.forEach(keyword => {
        if (keyword && keyword.trim().length > 1) {
          this.item.keywords.push({ name: keyword.trim() })
        }
      })
    }
  },
  computed: {
    itemNameState () {
      if (!this.formSubmitted && !this.item.name) return null
      return (this.item.name && this.item.name.length > 2)
    },
    itemKeywordsState () {
      if (!this.formSubmitted && !this.item.keywords) return null
      return (this.item.keywords && this.item.keywords.length > 0)
    }
  }
}
</script>

<style scoped>
</style>
