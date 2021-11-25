<template>
<div>
  <div class="mb-3" role="group">
    <div class="mb-3" :key="componentKey" v-if="showCats">
      <label for="categories">Main category :</label>
      <br/>
      <b-badge id="categories" @click="setCategory(kw)" class="pointer mr-3 mb-3 py-2 pt-3 px-5" v-for="(kw, index) in categories" :key="index" pill :variant="(item.attributes.category && item.attributes.category.name === kw.name) ? 'secondary' : 'warning'">{{kw.displayName}}</b-badge>
    </div>
    <label for="item-keywords">Keywords (comma separated) :</label>
    <b-form-input
      id="item-keywords"
      @blur="changeKeywords"
      v-model="keywords"
      :state="itemKeywordsState"
      aria-describedby="item-keywords-help item-keywords-feedback"
      placeholder="Enter keywords"
      trim
    ></b-form-input>
    <b-form-invalid-feedback id="item-keywords-feedback">
      A top level category is required
    </b-form-invalid-feedback>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CategoryChoice',
  props: ['item'],
  data: function () {
    return {
      keywords: '',
      showCats: true,
      componentKey: 0
    }
  },
  watch: {
  },
  mounted () {
    if (this.item.attributes.keywords && Array.isArray(this.item.attributes.keywords)) {
      const myKeywords = this.item.attributes.keywords.map(function (o) {
        return o.name
      }).join(',')
      this.keywords = myKeywords
    } else {
      this.keywords = this.item.attributes.keywords
    }
    this.$store.dispatch('publicItemsStore/fetchKeywords').then((keywords) => {
      this.systemKeywords = keywords
    })
  },
  methods: {
    isCategory: function (category) {
      return (this.item.attributes.category && this.item.attributes.category.name === category.name)
    },
    setCategory: function (category) {
      this.item.attributes.category = category
      this.componentKey++
    },
    changeKeywords: function () {
      if (!this.keywords) {
        this.keywords = ''
      }
      this.item.attributes.keywords = this.keywords
      /**
      this.keywords.split(',').forEach(keyword => {
        keyword = keyword.trim()
        if (keyword && keyword.length > 1) {
          this.item.attributes.keywords.push({ name: keyword.trim(), displayName: keyword.trim() })
        }
      })
      **/
    }
  },
  computed: {
    itemKeywordsState () {
      if (!this.formSubmitted && !this.item.attributes.keywords) return null
      return (this.item.attributes.keywords && this.item.attributes.keywords.length > 0)
    },
    categories () {
      const categories = this.$store.getters[APP_CONSTANTS.KEY_CATEGORIES]
      if (categories) return categories
      return []
    }
  }
}
</script>

<style scoped>
</style>
