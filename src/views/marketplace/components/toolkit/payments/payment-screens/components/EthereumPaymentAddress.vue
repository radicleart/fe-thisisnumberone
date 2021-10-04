<template>
<div class="mt-4 d-flex flex-column align-items-center">
  <div class="text-center" v-if="desktopWalletSupported">
    <canvas ref="lndQrcode"></canvas>
  </div>
  <div class="mt-5 mb-3 text-center">
    <b-button v-if="!loading" class="cp-btn-order" variant="warning" @click.prevent="sendPayment()">Connect via Meta Mask</b-button>
    <span v-else class="text-message text-info" v-html="waitingMessage"></span>
  </div>
  <div class="text-center">
    <span><a class="text-message text-warning" target="_blank" href="https://metamask.io/download.html">Install Meta Mask</a></span>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'EthereumPaymentAddress',
  components: {
  },
  props: ['desktopWalletSupported', 'configuration'],
  data () {
    return {
      loading: false,
      fullPage: true,
      errorMessage: null,
      waitingMessage: 'Follow transaction in your Meta Mask wallet'
    }
  },
  watch: {
  },
  mounted () {
    this.addQrCode()
  },
  computed: {
  },
  methods: {
    paymentUri () {
      return this.configuration.payment.ethPaymentAddress
    },
    addQrCode () {
      const element = this.$refs.lndQrcode
      const paymentUri = this.paymentUri()
      QRCode.toCanvas(
        element, paymentUri, { errorCorrectionLevel: 'H' },
        function () {})
    },
    sendPayment () {
      const configuration = this.configuration
      this.loading = true
      this.$store.dispatch('rpayEthereumStore/transact', { opcode: 'send-payment', ethNetworkId: configuration.payment.ethNetworkId, ethPaymentAddress: configuration.payment.ethPaymentAddress, amount: configuration.payment.amountEth }).then((result) => {
        const data = {
          status: 10,
          numbCredits: configuration.payment.creditAttributes.start,
          opcode: 'eth-crypto-payment-success',
          txId: result.txId
        }
        this.waitingMessage = 'Processed Payment'
        this.loading = false
        // this.$emit('rpayEvent', data)
        this.$emit('rpayEvent', data)
      }).catch((e) => {
        this.loading = false
        this.$emit('rpayEvent', { opcode: 'eth-crypto-payment-cancelled' })
      })
    },
    onCancel () {
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-content {
  padding-top: 0px;
}
</style>
