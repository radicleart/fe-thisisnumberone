<template>
  <div>

    <div class="title">
      <h1>{{ content.title[0].text }}</h1>
    </div>

    <div class="row">
      <div class="col">
        <div v-for="(item,index) of content.column_about" :key="index">
          <div><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.column__1" :key="index">
          <div><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.news_column" :key="index">
          <div><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
        </div>
      </div>

      <div class="col">
        <div v-for="(item,index) of content.partners_column" :key="index">
          <div><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
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
      content: {}
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('mainfooter')
        .then((document) => {
          this.content = document.data
          console.log(this.content)
        })
    }
  },
  created () {
    this.getContent()
  }
}
</script>

<style>
body {
  background-color: white;
}
</style>
