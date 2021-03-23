<template>
<div>
  <div class='post-part single' v-if="embeds(slice.primary.text)">
    <div v-html="slice.primary.text[0].text"></div>
  </div>
  <div v-else class='post-part single'>
    <prismic-rich-text class="textslice" :field="slice.primary.text"/>
  </div>
  <div v-if="slice.items" class='post-part single'>
    <section v-for="(item, index) in slice.items" :key="'slice-item-' + index">
        <template v-if="item.rtf1">
          <prismic-items :prismicItems="item.rtf1"></prismic-items>
        </template>
    </section>
  </div>
</div>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'TextSlice',
  components: {
    PrismicItems
  },
  props: ['slice'],
  mounted () {
    console.log(this.slice)
  },
  methods: {
    embeds: function (sample) {
      if (sample && Array.isArray(sample)) {
        if (sample.length === 1 && sample[0].text.indexOf('<div') > -1) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>
    .post-part {
      max-width: 70rem;
      margin: auto;
    }
</style>
