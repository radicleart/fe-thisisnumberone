<template>
<section id="adminSection">
  <div class="text-white container">
    <div class="row">
      <div class="col-md-2">Contract Address</div>
      <div class="col-md-10">{{contractAddress}}</div>
      <div class="col-md-2">Contract Name</div>
      <div class="col-md-10">{{contractName}}</div>
      <div class="col-md-2">Risidio API</div>
      <div class="col-md-10">{{risidioAPI}}</div>
    </div>
  </div>
</section>
</template>

<script>

export default {
  name: 'Admin',
  components: {
  },
  data () {
    return {
      loading: true,
      contractAddress: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS,
      contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME,
      risidioAPI: process.env.VUE_APP_API_MESH
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
</style>
