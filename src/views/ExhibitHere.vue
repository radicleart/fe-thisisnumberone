<template>
<section class="text-white my-5" id="homeSection" style="min-height: 85vh;">
  <b-container fluid v-if="loaded && content">
    <ExhibitRequestPending :content="content" v-if="exhibitRequest.status === 1"/>
    <ExhibitRequestAllSet   :content="content" v-else-if="exhibitRequest.status === 2"/>
    <ExhibitRequestSuspended :content="content" v-else-if="exhibitRequest.status === 3"/>
    <UserProfile @updateExhibitRequest="updateExhibitRequest" :showExhibitRequest="true" :exhibitRequest="exhibitRequest" :content="content" v-else-if="profile.loggedIn"/>
    <PrismicItems v-else :prismicItems="content.general" class="child-information"/>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import UserProfile from '@/components/exhibit/UserProfile'
import ExhibitRequestPending from '@/components/exhibit/ExhibitRequestPending'
import ExhibitRequestSuspended from '@/components/exhibit/ExhibitRequestSuspended'
import ExhibitRequestAllSet from '@/components/exhibit/ExhibitRequestAllSet'
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'ExhibitHere',
  components: {
    UserProfile,
    ExhibitRequestPending,
    ExhibitRequestSuspended,
    ExhibitRequestAllSet,
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
    },
    updateExhibitRequest: function (exhibitRequest) {
      this.exhibitRequest = exhibitRequest
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
