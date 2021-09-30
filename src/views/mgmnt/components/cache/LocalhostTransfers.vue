<template>
<div>
    <label class="mt-2 d-flex justify-content-between" for="item-name">
      <span>Send STX to:</span>
    </label>
    <b-form-input
      id="item-name"
      v-model="recipient"
      aria-describedby="item-name-help item-name-feedback"
      placeholder="Recipient address - where to send the STX tokens for the swap"
      trim></b-form-input>
    <p class="mt-3 text-left"><b-button variant="warning" @click="transfer">Send STX</b-button></p>
</div>
</template>

<script>

export default {
  name: 'LocalhostTransfers',
  components: {
  },
  data () {
    return {
      recipient: null,
      amountStx: 100
    }
  },
  methods: {
    transfer () {
      if (process.env.VUE_APP_NETWORK === 'local') {
        this.$store.dispatch('rpayStacksStore/makeTransferRisidio', { amountStx: this.amountStx, recipient: this.recipient }).then((result) => {
          this.$notify({ type: 'success', title: 'Transfer', text: 'Transfer on route. ' + result })
        }).catch(() => {
          this.$notify({ type: 'danger', title: 'Transfer', text: 'Transfer was not recieved due to an unexpected error.' })
        })
      } else {
        this.$store.dispatch('rpayStacksStore/makeTransferBlockstack', { amountStx: this.amountStx, recipient: this.recipient }).then((result) => {
          this.$notify({ type: 'success', title: 'Transfer', text: 'Transfer on route. ' + result })
        })
      }
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
