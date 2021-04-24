<template>
  <b-modal size="lg" id="asset-updates-modal">
    <div class="mb-5" role="group">
      <h4 class="mb-5" style="font-size: 30px;">Keep an eye on this Artwork</h4>
      <b-form-text style="font-size: 16px;" id="email-help">Please enter an email address to receive updates</b-form-text>
      <b-form-input
        id="email"
        v-model="email"
        :state="validEmail"
        aria-describedby="email-help email-feedback"
        placeholder="Enter email address"
        trim
      ></b-form-input>
      <b-form-invalid-feedback id="email-feedback">
        Enter email
      </b-form-invalid-feedback>
    </div>
    <template #modal-header>
    </template>
    <template #modal-footer>
      <div class="w-100 d-flex justify-content-start">
        <div class="mr-3 w-75 border-top" style="max-width: 68%;"></div>
        <div class="w-25" style="position: relative; top: -20px;"><square-button :theme="'dark'" @clickButton="registerForUpdates()" :label1="'SUBMIT'" :svgImage="mail" :usePixelBg="true"/></div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import SquareButton from '@/components/utils/SquareButton'

export default {
  name: 'UpdatesModal',
  components: {
    SquareButton
  },
  data () {
    return {
      mail: require('@/assets/img/mailIcon.svg'),
      email: null
    }
  },
  methods: {
    isValid: function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },
    registerForUpdates: function () {
      if (!this.isValid()) return
      this.$emit('registerForUpdates', this.email)
    }
  },
  computed: {
    validEmail () {
      return this.email && this.isValid()
    },
    updateMessage () {
      return ''
    }
  }
}
</script>
<style lang="scss">
.form-control {
  padding: 20px !important;
  font-size: 1.5rem !important;
}
</style>
