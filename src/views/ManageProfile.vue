<template>
<section class="bg-black text-white py-5" style="min-height: 100vh;">
  <b-container fluid v-if="loaded && content">
    <UserProfile :exhibitRequest="exhibitRequest" :content="content" v-if="profile.loggedIn"/>
    <PrismicItems v-else :prismicItems="content.general" class="child-information"/>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import UserProfile from '@/components/exhibit/UserProfile'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'ManageProfile',
  components: {
    UserProfile,
    PrismicItems
  },
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      showForm: false,
      loaded: false,
      exhibitRequest: {}
    }
  },
  mounted () {
    if (!this.profile.loggedIn) {
      this.$router.push('/login?redirect=exhibit-here')
    } else {
      this.$store.dispatch('rpayMyItemStore/fetchExhibitRequest', this.profile.stxAddress).then((exhibitRequest) => {
        this.exhibitRequest = exhibitRequest
        this.loaded = true
      })
    }
  },
  methods: {
    openModal: function () {
      this.showRpay = 2
      this.$bvModal.show('exhibit-here-modal', { assetHash: this.assetHash })
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_COLLABORATION]
      return content
    },
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
