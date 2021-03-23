<template>
<section id="homeSection">
  <div class="container home-content">
    <div class="row">
      <div class="col-md-6 col-sm-12">
        <p>Profile page coming soon...</p>
        <p><b-button variant="light">{{buttonLabel}}</b-button></p>
      </div>
    </div>
  </div>
</section>
</template>

<script>

export default {
  name: 'Profile',
  components: {
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
.home-content {
  position: relative;
  top: 140px;
}
#homeSection h2 {
  margin-bottom: 10px;
  font-size: 3.4rem;
}
#homeSection h3 {
  margin-bottom: 50px;
}
#homeSection p {
  margin-bottom: 20px;
}
</style>
