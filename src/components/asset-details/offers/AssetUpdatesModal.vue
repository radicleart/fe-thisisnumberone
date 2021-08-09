<template>
<div>
  <h1 class="mb-5">Keep an eye on this Artwork</h1>
  <b-form-text class="mb-3" style="font-size: 1.2rem;" id="email-help">Please enter an email address to receive updates</b-form-text>
  <b-form-input
    id="email"
    v-model="email"
    :state="validEmail"
    aria-describedby="email-help email-feedback"
    placeholder=""
    trim
  ></b-form-input>
  <b-form-invalid-feedback id="email-feedback">
    Enter email
  </b-form-invalid-feedback>
  <ActionRow :buttonLabel="'Submit'" @clickButton="registerForUpdates"/>
</div>
</template>

<script>
import ActionRow from '@/components/utils/ActionRow'

export default {
  name: 'UpdatesModal',
  components: {
    ActionRow
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
