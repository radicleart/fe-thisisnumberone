<template>
<div class="">
  <div v-for="(item, index) of prismicItems" :key="index">
    <div v-if="item.type === 'paragraph'" class="col-12"><p class="mb-3" v-if="item.type === 'paragraph'" v-html="item.text"></p></div>
    <h1 class="my-2" v-else-if="item.type === 'heading1'" v-html="item.text"></h1>
    <h2 class="my-2" v-else-if="item.type === 'heading2'" v-html="item.text"></h2>
    <h3 class="my-2" v-else-if="item.type === 'heading3'" v-html="item.text"></h3>
    <h4 class="my-2" v-else-if="item.type === 'heading4'" v-html="item.text"></h4>
    <h4 class="my-2" v-else-if="item.type === 'heading5'" v-html="item.text"></h4>
    <div v-else-if="item.type === 'image'" class="col-4"><img class="img-responsive" style="max-width: 250px;" :src="item.url"/></div>
    <div class="ml-2" v-else-if="item.type === 'o-list-item'"><b class="pb-2">-</b> {{item.text}}</div>
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
