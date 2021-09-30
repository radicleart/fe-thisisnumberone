<template>
<div class="container">
  <div class="row">
    <div class="col-sm-6 offset-sm-3">
      <b-card-group deck class="mb-5 text-light">
        <b-card class="mb-5 bg-dark" header-tag="header" footer-tag="footer">
          <loop-header/>
          <b-card-text>
            <div class="mt-5 d-flex justify-content-center align-items-center" style="height: 20vh; top:50px;">
              <h4>Loopbomb Library</h4>
            </div>
            <div class="mt-5 d-flex justify-content-center align-items-center">
              No items!
            </div>
          </b-card-text>
          <b-card-text style="height: 20vh; top:50px;">
            <div class="mt-5 d-flex justify-content-around">
              <router-link to="/" class="btn btn-warning btn-lg bg-warning">Home</router-link>
            </div>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</div>
</template>

<script>
import LoopHeader from '@/components/loops/LoopHeader'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'NoItemsFoundView',
  components: {
    LoopHeader
  },
  props: ['errorMessage'],
  data() {
    return {
    }
  },
  computed: {},
  methods: {
  }
}
</script>

<style scoped>
</style>
