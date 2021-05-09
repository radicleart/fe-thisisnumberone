<template>
<div>
  <b-row>
    <b-col cols="12">
      <h1 class="mb-4">{{sendOfferDialog[0].text}}</h1>
      <!-- <h4 class="mb-5">{{sendOfferDialog[1].text}} <b>{{offerData.fbet}}</b></h4> -->
    </b-col>
  </b-row>
  <b-row class="row mt-5">
    <b-col align-v="stretch" md="4" sm="12">
      <h4>{{sendOfferDialog[2].text}}</h4>
      <p v-if="sendOfferDialog[3]">{{sendOfferDialog[3].text}}</p>
      <p v-if="sendOfferDialog[4]">{{sendOfferDialog[4].text}}</p>
      <p v-if="sendOfferDialog[5]">{{sendOfferDialog[5].text}}</p>
      <div class="mt-5"><a href="#" @click.prevent="back()"><b-icon icon="chevron-left"/> Back</a></div>
    </b-col>
    <b-col cols="8">
      <b-row align-v="stretch" class="row mt-5" style="height: 70%;">
        <b-col align-self="start" cols="12">
          <div class="text-small d-flex justify-content-between">
            <div>Confirm Your Interest</div>
            <div>Your Offer <span class="ml-5 text-dark">{{offerData.offerAmount}} STX</span></div>
          </div>
          <div class="mb-3" role="group">
            <b-form-input
              id="email"
              v-model="email"
              :state="validEmail"
              aria-describedby="email-help email-feedback"
              placeholder="Enter email address"
              trim
            ></b-form-input>
            <p class="text-small text-danger" v-html="errorMessage"></p>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
  <action-row :buttonLabel="'SUBMIT'" @clickButton="makeOffer()"/>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ActionRow from '@/components/utils/ActionRow'

export default {
  name: 'PurchaseOfferEmail',
  components: {
    ActionRow
  },
  props: ['offerData'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg'),
      email: null,
      errorMessage: null
    }
  },
  methods: {
    isValid: function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },
    back: function () {
      this.$emit('backStep')
    },
    makeOffer: function () {
      this.errorMessage = null
      if (!this.isValid()) {
        this.errorMessage = 'Please enter an email where we can reach with news about your offer.'
        return
      }
      this.$emit('setEmail', { email: this.email })
    }
  },
  computed: {
    sendOfferDialog () {
      const dialog = this.$store.getters[APP_CONSTANTS.KEY_DIALOG_CONTENT]('send-offer')
      return dialog
    },
    validEmail () {
      return this.email && this.isValid()
    },
    updateMessage () {
      return ''
    }
  }
}
</script>
<style lang="scss" >
</style>
