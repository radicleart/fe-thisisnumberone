<template>
<b-card-text class="mt-2">
  <b-row>
    <b-col cols="4"><img @contextmenu="handler($event)" style="" width="100%" :src="getCollectionImageUrl(loopRun)"/></b-col>
    <b-col cols="8">
      <p class="mt-4 mb-5"><LoopRun :parent="'minting'" :currentLoopRun="loopRun"/></p>
      <p class="text-bold" v-if="item">{{item.name}}</p>
      <div class="text-center mt-5">
        <div>{{profile.stxAddress.substring(0, 6)}}...{{profile.stxAddress.substring(profile.stxAddress.length - 6)}}</div>
      </div>
      <!-- <div class="mt-5 pt-4 border-top text-right"><img width="100px" :src="hashone" /></div> -->
    </b-col>
  </b-row>
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
  props: ['item', 'loopRun'],
  data () {
    return {
      hashone: require('@/assets/img/phase2/No1_outline.png')
    }
  },
  methods: {
    getCollectionImageUrl (item) {
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](item)
    },
    handler: function (e) {
      e.preventDefault()
    }
  },
  computed: {
    profile () {
      return this.$store.getters['rpayAuthStore/getMyProfile']
    },
    image () {
      if (!this.item) {
        return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL]({})
      }
      return this.$store.getters[APP_CONSTANTS.KEY_ASSET_IMAGE_URL](this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
