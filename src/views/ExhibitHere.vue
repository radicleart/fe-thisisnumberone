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
        <div v-else-if="profile.loggedIn">
          <b-row class="my-5">
            <b-col>
              <h1>Tell us about yourself</h1>
              <p>Fill in the form below - you'll hear back from us within 2 working days!</p>
            </b-col>
          </b-row>
          <b-row class="my-5">
            <b-col sm="12">
              <UserProfileForm :referer="'exhibit-here'"/>
            </b-col>
          </b-row>
        </div>
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
import UserProfileForm from '@/components/exhibit/UserProfileForm'

export default {
  name: 'ExhibitHere',
  components: {
    UserProfileForm
  },
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      showForm: false,
      loaded: false
    }
  },
  mounted () {
    this.loaded = true
    if (!this.profile.loggedIn) {
      this.$router.push('/login?referer=exhibit-here')
    }
  },
  methods: {
    openModal: function () {
      this.showRpay = 2
      this.$bvModal.show('exhibit-here-modal', { assetHash: this.assetHash })
    }
  },
  computed: {
    avatar () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        if (profile.avatarUrl) {
          return (
            '<img style="width: 150px; height: 150px; border-radius: 50%;" src="' +
            profile.avatarUrl +
            '"/>'
          )
        }
      }
      return null
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    canUpload () {
      const hasUploadPriv = this.$store.getters[APP_CONSTANTS.KEY_HAS_PRIVILEGE]('can-upload')
      return hasUploadPriv
    }
  }
}
</script>

<style>
.avatar {
  border: 1pt solid #ccc;
  padding: 15px;
  border-radius: 50%;
}
</style>
