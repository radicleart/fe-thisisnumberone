  <template>
<section class="" id="section1">
  <b-container class="">
    <b-row style="height: 92vh" class="text-center">
      <b-col cols="12" align-self="end"><div class="text-white"><b-icon style="width: 60px; height: 60px;" icon="film"/></div></b-col>
      <b-col class="mx-md-5 mx-sm-3" cols-md="6" cols-sm="6" align-self="center">
        <h1 class="mb-4 text-white">{{content.section1rtf1[0].text}}</h1>
        <div class="mx-md-5 mx-sm-3 px-md-5 px-sm-3 text-white text-center">{{content.section1rtf1[1].text}}</div>
      </b-col>
    </b-row>
  </b-container>
  <div class="link-panel bg-white pt-4 text-center d-flex justify-content-center">
    <div class="w-50 d-flex justify-content-around text-black">
      <p><b-link router-tag="span" to="#thisisone">This is #1</b-link></p>
      <p><b-link router-tag="span" to="#chemicalx">Chemical X</b-link></p>
      <p><b-link router-tag="span" to="#charity">Charity</b-link></p>
      <p><b-link router-tag="span" to="#environment">Environment</b-link></p>
      <p><b-link router-tag="span" to="#collaborate">Collaborate</b-link></p>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: 'AboutSection1',
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
