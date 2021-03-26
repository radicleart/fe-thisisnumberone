<template>
  <b-modal size="lg" id="waiting-modal">
    <b-container class="text-white" fluid>
    <div class="row">
      <div class="col-12 my-1" v-html="modalMessage">
      </div>
    </div>
    </b-container>
      <template #modal-header>
      </template>
      <template #modal-footer class="text-center">
        <div class="w-100">
          <p class="footer-text text-white"></p>
        </div>
      </template>
  </b-modal>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WaitingModal',
  components: {
  },
  data () {
    return {
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
