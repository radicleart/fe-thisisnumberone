<template>
  <section class="container home-content" v-if="slices">
    <div class="row">
      <div class="col-12">
        <h1 class="home-content text-white">{{title}}</h1>
        <slices-block :rootId="'slice-'" :slices="slices" :columns="columns" class="container-fluid"/>
      </div>
    </div>
  </section>
</template>

<script>
import SlicesBlock from '@/components/prismic/SlicesBlock.vue'

export default {
  name: 'HowItWorks',
  components: {
    SlicesBlock
  },
  data () {
    return {
      columns: [2, 2, -1, 1, 1]
    }
  },
  computed: {
    slices () {
      const content = this.$store.getters['contentStore/getHowItWorks']
      return (content) ? content.body : null
    },
    title () {
      const content = this.$store.getters['contentStore/getHowItWorks']
      return (content) ? content.title[0].text : null
    }
  }
}
</script>
<style lang="scss">
//@import "@/assets/scss/custom.scss";
.my-header {
  position: absolute;
  top: 15vh;
  left: 10vw;
}
.home-content {
  position: relative;
  top: 40px;
}

#slice-0 {
  margin-top: 100vh;
  background-color: #fff;
  padding: 60px 40px;
}
#slice-0 h1 {
  margin-bottom: 60px;
  font-size: 2.3rem;
}
#slice-0 h2 {
  margin-left: 45px;
  font-size: 1.8rem;
  margin-bottom: 20px;
}
#slice-0 p {
  margin-left: 30px;
}

#slice-1 {
  position: relative;
  top: 200px;
  left: 100px;
  background-color: #fff;
  padding: 60px 40px;
  max-width: 40%
}
#slice-1 h1 {
  margin-bottom: 30px;
  font-size: 3rem;
}

#slice-2 {
  background-color: #dc3545;
  color: #fff;
  padding: 50px;
  z-index: 2;
  margin: 50px 0px;
  text-align: center;
}
#slice-2 h1 {
  margin-bottom: 30px;
  font-size: 3rem;
}

#slice-3 {
  margin: 50px 0;
}
#slice-3 {
  text-align: center;
}
#slice-4 {
  text-align: center;
  background-color: #dc3545;
  color: #fff;
  padding: 50px;
  z-index: 2;
  margin: 50px 0px;
}
#slice-5 {
  text-align: center;
  padding: 50px 300px;
  width: 60%;
  margin: 50px 0px;
}
#slice-5 p {
  padding: 50px;
}

.container-fluid {
  margin: 0;
}
</style>
