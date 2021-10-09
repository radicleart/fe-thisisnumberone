<template>
<div v-if="items && items.length > 0" class="text-center">
  <b-card bg-variant="dark" class="p-4 mx-auto text-white" style="width: 400px;">
    <div class="px-2">
      <div class="text-left">
        <h3>{{itemName}}</h3>
        <div class=" d-flex justify-content-between">
          <div class="text-right">{{loopRun.currentRun}}</div>
          <div class="text-right">{{created()}}</div>
        </div>
      </div>
    </div>
    <b-card-text class="">
      <div @contextmenu="handler($event)" class="d-flex justify-content-center p-2">
        <img width="250px" :src="mintImage" />
      </div>
      <div class="text-small text-center">
        <div class="text-warning"><b-link :to="'/nft-marketplace/' + loopRun.makerUrlKey + '/' + loopRun.currentRunKey">{{loopRun.tokenCount}} / {{loopRun.versionLimit}}</b-link></div>
      </div>
    </b-card-text>
    <b-card-text>
      <div class="text-center my-4" v-if="uiState === 'ready'">
        <MintingTools class="w-100" :mintAllocations="mintAllocations" :items="items" :loopRun="loopRun" @update="update"/>
      </div>
      <b-row v-else class="my-5 text-center">
        <b-col cols="12">
          <b-icon class="mb-0 mr-3" animation="throb" icon="circle"/> Lockin' and loading - prevents duplicate mint tx flood!
        </b-col>
      </b-row>
    </b-card-text>
  </b-card>
</div>
</template>

<script>
import { DateTime } from 'luxon'
import MintingTools from '@/views/marketplace/components/toolkit/MintingTools'

export default {
  name: 'MaybeMintable',
  components: {
    MintingTools
  },
  props: ['items', 'loopRun', 'uiState', 'mintAllocations'],
  data () {
    return {
      mintImage: 'https://images.prismic.io/dbid/e58726cc-3ab9-4578-9d93-95854a745f96_No1_v2_600_1.gif?auto=compress,format',
      loaded: false,
      image: null,
      newHeight: null
    }
  },
  mounted () {
    const $self = this
    const $ele = this.$refs.itemImage
    this.$nextTick(() => {
      if (!$ele) {
        return
      }
      $self.newHeight = $ele.clientWidth * 1 // 1024 / 716
      $ele.style.height = (Math.floor($self.newHeight)).toString() + 'px'
    })
    this.loaded = true
  },
  methods: {
    update () {
      return DateTime.fromMillis(this.items[0].updated).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    created () {
      return DateTime.fromMillis(this.items[0].updated).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    handler: function (e) {
      e.preventDefault()
    },
    imageError () {
      this.items[0].image = this.getImageUrl
    }
  },
  computed: {
    looperDimsWidth () {
      const dims = this.$store.getters['loopStore/getLooperDimsWidth']
      return dims + 'px'
    },
    looperDimsHeight () {
      const dims = this.$store.getters['loopStore/getLooperDimsHeight']
      return dims + 'px'
    },
    profile () {
      const profile = this.$store.getters['rpayAuthStore/getMyProfile']
      return profile
    },
    itemName () {
      let itemName = ''
      this.items.forEach(function (item) {
        itemName += item.name + ' '
      })
      return itemName
    },
    iAmOwner () {
      return this.contractAsset && this.contractAsset.owner === this.profile.stxAddress
    }
  }
}
</script>
<style scoped>
.card {
  background-color: #212529;
  padding: 0;
  margin: 15px 5px;
  border: none;
}
.card-text img {
  border-radius: 0px;
  min-width: 10rem;
  max-width: 40rem;
}
.card-header {
    padding: 1rem 1.5rem 0 1.5rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    font-size: 2.50rem;
}
.card-body {
    padding: 0 0.5rem;
}
.card-text-body {
    padding: 0 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    border-bottom: 0px solid rgba(0, 0, 0, 0.125);
}
</style>
