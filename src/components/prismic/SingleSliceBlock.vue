<template>
    <section>
        <!-- Slice section template -->
        <section>
            <!-- Text slice template -->
            <template v-if="singleSlice.slice_type === 'text'">
                <!-- Here :slice="slice" passes the data to the component -->
                <text-slice :slice="singleSlice"></text-slice>
            </template>
            <!-- Quote slice template -->
            <template v-else-if="singleSlice.slice_type === 'quote'">
                <quote-slice :slice="singleSlice"></quote-slice>
            </template>
            <!-- Image with caption slice template -->
            <template v-else-if="singleSlice.slice_type === 'image_with_caption'">
                <image-caption-slice :slice="singleSlice"></image-caption-slice>
            </template>
        </section>
    </section>
</template>

<script>
// Imports for all slices
const QuoteSlice = () => import('@/components/prismic/QuoteSlice.vue')
const TextSlice = () => import('@/components/prismic/TextSlice.vue')
const ImageCaptionSlice = () => import('@/components/prismic/ImageCaptionSlice.vue')

export default {
  props: ['singleSlice'],
  name: 'SingleSliceBlock',
  components: {
    QuoteSlice,
    TextSlice,
    ImageCaptionSlice
  }
}
</script>
