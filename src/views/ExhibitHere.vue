<template>
<section id="homeSection" style="min-height: 85vh;">
  <div class="container text-left home-content">
    <div class="row">
      <div class="col-12 text-white">
        <b-row class="my-5" v-if="canUpload">
          <b-col>
            <h1>You are all set to exhibit art on the #1 platform</h1>
            <ul>
              <li><b-link to="/create">Upload Artwork</b-link></li>
              <li><b-link to="/my-nfts">Your NFT library</b-link></li>
              <li><b-link to="/my-items">Manage you NFTs</b-link></li>
            </ul>
          </b-col>
        </b-row>
        <b-row class="my-5" v-else>
          <b-col>
            <h1>Exhibiting Art on the #1 platform</h1>
            <ul>
              <li>You'll need a Stacks Wallet - we recommend the Hiro Wallet.</li>
              <li>Send us your Stacks Address.</li>
              <li>Send us some information about you and examples of your work.</li>
            </ul>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ExhibitHere',
  components: {
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.loaded = true
  },
  methods: {
  },
  computed: {
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
    }
  }
}
</script>

<style>
</style>
