  <template>
<section class="bg-white text-black" id="section1">
  <b-container class="">
    <b-row style="text-align: center; height: 92vh" class="text-center">
      <b-col class="mx-md-5 mx-sm-3" cols-md="6" cols-sm="6" align-self="center">
        <h1 class="mb-4 text-info">{{content.section6rtf1[0].text}}</h1>
        <div class="mx-md-5 mx-sm-3 px-md-5 px-sm-3 text-center">{{content.section6rtf1[1].text}}</div>
        <div class="mt-3">
          <b-button-group>
            <b-button class="button-plus bg-info"><b-icon icon="broadcast"/></b-button>
            <b-button class="button-info text-dark">Get in touch</b-button>
          </b-button-group>
        </div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
export default {
  name: 'AboutSection6',
  props: ['content'],
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<style scoped>
.link-panel {
  background-color: #fff !important;
  border: 1pt solid #000;
}
</style>
