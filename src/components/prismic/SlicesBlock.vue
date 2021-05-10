<template>
<section class="row">
<section :class="myClasses(index)" v-for="(slice, index) in slices" :key="'sb-slice-' + index" :id="rootId + index">
  <div>
    <template v-if="slice.slice_type === 'text'">
      <text-slice :slice="slice"></text-slice>
    </template>
    <template v-else-if="slice.slice_type === 'quote'">
      <quote-slice :slice="slice"></quote-slice>
    </template>
    <template v-else-if="slice.slice_type === 'image_with_caption'">
      <image-caption-slice :slice="slice"></image-caption-slice>
    </template>
  </div>
</section>
</section>
</template>

<script>
const QuoteSlice = () => import('@/components/prismic/QuoteSlice.vue')
const TextSlice = () => import('@/components/prismic/TextSlice.vue')
const ImageCaptionSlice = () => import('@/components/prismic/ImageCaptionSlice.vue')

export default {
  name: 'SlicesBlock',
  components: {
    QuoteSlice,
    TextSlice,
    ImageCaptionSlice
  },
  props: ['rootId', 'slices', 'columns'],
  methods: {
    myClasses: function (index) {
      if (!this.columns || !this.columns[index]) {
        return 'col-12'
      } else if (this.columns[index] === 2) {
        return 'col-md-6 col-sm-12'
      } else if (this.columns[index] === -1) {
        return 'container'
      } else {
        return 'col-12'
      }
    }
  }
}
</script>
