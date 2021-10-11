<template>
<b-card-text class="mt-2">
  <div class="row">
    <div class="col-3"><img @contextmenu="handler($event)" style="border-radius: 18px;" width="100%" :src="image"/></div>
    <div class="col-8">
      <h4 class="text-bold">{{item.name}}</h4>
      <div class="row mt-3">
        <div class="col-12">
          <div v-if="profile.username !== profile.stxAddress">{{profile.username}}</div>
          <div>{{profile.stxAddress.substring(0, 6)}}...{{profile.stxAddress.substring(profile.stxAddress.length - 6)}}</div>
          <div class="mt-5"><LoopRun :parent="'minting'"/></div>
        </div>
      </div>
    </div>
  </div>
</b-card-text>
</template>

<script>
import LoopRun from '@/views/marketplace/components/gallery/LoopRun'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ItemDisplay',
  components: {
    LoopRun
  },
  props: ['item'],
  data () {
    return {
    }
  },
  methods: {
    handler: function (e) {
      e.preventDefault()
    }
  },
  computed: {
    profile () {
      return this.$store.getters['rpayAuthStore/getMyProfile']
    },
    image () {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
