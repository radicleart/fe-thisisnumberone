<template>
  <b-modal id="success-modal">
    <b-container class="text-white" fluid>
    <div class="row">
      <div class="col-12 my-1">
      </div>
    </div>
    </b-container>
      <template #modal-header style="display: none">
        <div class="w-100 text-center mt-5">
          <img width="113px" height="113px" :src="vote"/>
        </div>
      </template>
      <template #modal-footer class="text-white text-center">
        <div class="w-100">
          <p class="footer-text text-white" v-html="modalMessage"></p>
        </div>
      </template>
  </b-modal>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SuccessModal',
  components: {
  },
  data () {
    return {
      vote: require('@/assets/img/positive-vote.svg')
    }
  },
  methods: {
  },
  computed: {
    modalMessage () {
      return this.$store.getters[APP_CONSTANTS.KEY_MODAL_MESSAGE]
    }
  }
}
</script>
<style lang="scss" >
</style>
