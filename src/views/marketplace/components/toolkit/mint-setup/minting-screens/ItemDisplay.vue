<template>
<b-card-text class="mx-4 text-center">
  <b-row>
    <b-col class="col-12">
      <h1 class="h1-modal">Mint Your NFT</h1>
      <h2 class="h2-modal">Set royalties, editions and mint</h2>
    </b-col>
    <b-col class="col-6" offset="3">
      <img width="100%" :src="item.image"/>
      <div class="py-4 bg-light text-small">
        <div class=""><h2 class="h2-modal">{{item.name}}</h2></div>
        <div>by <span class="text-success">{{item.artist}}</span></div>
      </div>
    </b-col>
  </b-row>
</b-card-text>
</template>

<script>

export default {
  name: 'ItemDisplay',
  components: {
  },
  props: ['item'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
