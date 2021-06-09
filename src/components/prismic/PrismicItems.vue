<template>
<div class="prismic-items">
  <div v-for="(item, index) of prismicItems" :key="index">
    <div v-if="item.type === 'paragraph'"><p v-if="item.type === 'paragraph'" v-html="item.text"></p></div>
    <div v-if="item.type === 'pre'"><div v-if="item.type === 'paragraph'" v-html="item.text"></div></div>
    <div v-else-if="item.type === 'heading1'"><h1 v-html="item.text"></h1></div>
    <div v-else-if="item.type === 'heading2'"><h2 v-html="item.text"></h2></div>
    <div v-else-if="item.type === 'heading3'"><h3 v-html="item.text"></h3></div>
    <div v-else-if="item.type === 'heading4'"><h4 v-html="item.text"></h4></div>
    <div v-else-if="item.type === 'heading5'"><h5 v-html="item.text"></h5></div>
    <div v-else-if="item.type === 'heading6'"><h6 v-html="item.text"></h6></div>
    <span class="my-2" v-else-if="item.type === 'preformatted'" v-html="item.text"></span>
    <div v-else-if="item.type === 'image'"><img class="img-responsive" style="max-width: 250px;" :src="item.url"/></div>
    <div class="ml-2 " v-else-if="item.type === 'o-list-item'"> <p><b class="mx-2 pb-0">-</b> {{item.text}}</p></div>
  </div>
</div>
</template>

<script>

export default {
  components: {
  },
  props: ['prismicItems'],
  name: 'PrismicItems',
  data () {
    return {
    }
  }
}
</script>
<style >
/* General style */
</style>
