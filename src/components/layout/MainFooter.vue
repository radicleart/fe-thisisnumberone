<template>
  <div v-if="content">

    <div class="title">
      <h1>{{ content.title[0].text }}</h1>
    </div>

    <div class="row">
      <div class="col">
        <div v-for="(item,index) of content.column_about" :key="index">
          <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
          <div v-else-if="item.title_of_the_link[0].type === 'image'">
            <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
          </div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.column__1" :key="index">
          <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
          <div v-else-if="item.title_of_the_link[0].type === 'image'">
            <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
          </div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.news_column" :key="index">
          <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
          <div v-else-if="item.title_of_the_link[0].type === 'image'">
            <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
          </div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.partners_column" :key="index">
          <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
          <div v-else-if="item.title_of_the_link[0].type === 'image'">
            <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="left corner">
        {{ content.left_bottom_corner[0].text }}
      </div>

      <div class="right corner">
        {{ content.right_bottom_corner[0].text }}
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'MainFooter',
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    content () {
      const content = this.$store.getters['contentStore/getMainFooter']
      return content
    }
  }
}
</script>

<style>
body {
  background-color: white;
}
</style>
