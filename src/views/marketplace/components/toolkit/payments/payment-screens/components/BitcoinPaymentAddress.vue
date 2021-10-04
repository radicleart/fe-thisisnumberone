<template>
<div class="d-flex flex-column align-items-center">
  <div class="rpay-countdown mb-3 d-flex justify-content-center">
    <span class="text-message mr-1">valid for</span>
    <CryptoCountdown :configuration="configuration" class="text-danger" v-on="$listeners" />
  </div>
  <div class="mb-3 mx-auto">
    <canvas ref="lndQrcode"></canvas>
  </div>
  <!--
  <div class="rd-text mb-3 d-flex justify-content-center">
    <span><small>Send the indicated amount to the address below</small></span>
  </div>
  -->

  <div class="d-flex justify-content-center">
    <input class="fake-input" id="copy-amount" readonly v-model="paymentAmount"/>
    <a href="#" class="pointer" @click.prevent="copyAmount()"><b-icon class="text-white ml-2"  icon="file-earmark"/></a>
  </div>
  <div class="d-flex justify-content-center">
    <input class="fake-input" id="copy-address" readonly v-model="paymentAddress"/>
    <a href="#" class="pointer" @click.prevent="copyAddress()"><b-icon class="text-white ml-2"  icon="file-earmark"/></a>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode'
import { APP_CONSTANTS } from '@/app-constants'
import CryptoCountdown from './CryptoCountdown'

export default {
  name: 'BitcoinPaymentAddress',
  components: {
    CryptoCountdown
  },
  props: ['configuration'],
  data () {
    return {
      paymentAmount: 0,
      paymentAddress: null
    }
  },
  watch: {
    'paymentAmount' () {
      // this.addQrCode()
    }
  },
  mounted () {
    const invoice = this.$store.getters[APP_CONSTANTS.KEY_INVOICE]
    this.paymentAmount = invoice.data.amount / 100000000
    this.paymentAddress = invoice.data.address
    this.addQrCode()
  },
  computed: {
  },

  methods: {
    paymentUri () {
      const invoice = this.$store.getters[APP_CONSTANTS.KEY_INVOICE]
      let uri = 'bitcoin:' + invoice.address
      uri += '?amount=' + invoice.amount
      uri += '&label=' + invoice.description
      return uri
    },
    addQrCode () {
      const element = this.$refs.lndQrcode
      const paymentUri = this.paymentUri()
      QRCode.toCanvas(
        element, paymentUri, { errorCorrectionLevel: 'H' },
        function () {})
    },
    copyAmount () {
      const copyText = document.querySelector('#copy-amount')
      copyText.select()
      document.execCommand('copy')
      this.doFlash()
      this.$notify({ type: 'success', title: 'Copied to Clipboard', text: 'Copied the amount to clipboard: ' + copyText.value })
    },
    copyAddress (value) {
      const copyText = document.querySelector('#copy-address')
      copyText.select()
      document.execCommand('copy')
      this.doFlash()
      this.$notify({ type: 'success', title: 'Copied to Clipboard', text: 'Copied the address to clipboard: ' + copyText.value })
    },
    doFlash () {
      const flasher = this.$refs.lndQrcode
      flasher.classList.add('flasher')
      setTimeout(function () {
        flasher.classList.remove('flasher')
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-content {
  padding-top: 0px;
}
.fake-input {
  border: none;
  font-size: 0.6rem;
  width: 200px;
  color: #fff;
  background: #212121;
  text-align: center;
}
</style>
