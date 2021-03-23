<template>
<div class="container hundred-vh">
<div class="mt-3" v-if="!item">
  {{message}}
</div>
<div class="mt-3" v-else>
  <div class="row">
    <div class="col-md-6 col-sm-12">
      <div id="result-item" class="mb-4">
        <div :style="bannerImage">
          <audio controls :src="musicData" v-if="musicData">
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </div>
      </div>
      <div>
        <div class="mb-2 d-flex justify-content-between">
          <div class="">{{item.name}}</div>
          <div class=""><router-link :to="'/edit-item/' + item.assetHash"><b-icon icon="pencil"/></router-link></div>
        </div>
        <div class="text-small">Uploaded by : {{item.uploader}}</div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <div class="mb-2 text-bold">Editions {{item.editions}}</div>
      <span class="text-small mr-1" v-for="(kw, index) in item.keywords" :key="index">#{{kw.name}}</span>
      <div class="text-small">{{item.description}}</div>
      <item-mint-info :item="item" />
    </div>
  </div>
</div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'
import ItemMintInfo from '@/components/items/ItemMintInfo'

export default {
  name: 'ItemPreview',
  components: {
    ItemMintInfo
  },
  data: function () {
    return {
      musicData: null,
      showHash: false,
      assetHash: null,
      message: 'No item available...'
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    const $self = this
    this.$store.dispatch('myItemStore/findItemByAssetHash', this.assetHash).then((item) => {
      if (!item) {
        this.$router.push('/404')
      } else {
        utils.audioToBase64(item.musicFileUrl).then((data) => {
          $self.musicData = data
        })
      }
    })
  },
  methods: {
  },
  computed: {
    item () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return item
    },
    keywords () {
      return this.$store.getters['myItemStore/myItem'](this.assetHash)
    },
    bannerImage () {
      const item = this.$store.getters['myItemStore/myItem'](this.assetHash)
      return this.$store.getters[APP_CONSTANTS.KEY_WAITING_IMAGE](item.imageUrl)
    }
  }
}
</script>

<style scoped>
</style>
