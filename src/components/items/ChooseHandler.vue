<template>
<div>
  <p>We need the following to make the NFT..
    <ul>
      <li>The Artwork File - max size ??</li>
      <li>The Artwork Clip - max size 1M</li>
    </ul>
  </p>
  <p>We support the following methods for handling your artwork - please choose!
    <ul>
      <li><a href="#" @click.prevent="$emit('setHandler', { handler: 1 })">Decentralised file storage</a> - we upload to <i>your</i> storage linked to your decentralised login.
        the maximum file size limit for this is 20M</li>
      <li><a href="#" @click.prevent="$emit('setHandler', { handler: 2 })">You host it somewhere</a> - just provide us a download link (not a streaming link!)</li>
      <!--<li><a href="#" @click.prevent="setHandler(3)">Conventional file storage</a> we will upload to conventional storage - using the Cloudinary file storage service</li>-->
    </ul>
  </p>
</div>
</template>

<script>
export default {
  name: 'ChooseHandler',
  data: function () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
