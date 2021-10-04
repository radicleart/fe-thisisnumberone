<template>
<div class="">
  <div>
    <div id="sq-ccbox">
      <!--
        You should replace the action attribute of the form with the path of
        the URL you want to POST the nonce to (for example, "/process-card")
      -->
    </div>
  </div>
  <div class="pt-2 w-100 cp-totals" v-show="showSpinner">
    <div class="pb-b"><b-icon class="text-info" icon="arrow-clockwise" animation="spin" font-scale="4"></b-icon></div>
  </div>
  <div class="pt-5 mx-auto cp-totals" v-show="!showSpinner">
    <form id="payment-form">
      <div id="card-container"></div>
      <b-button class="button-credit-card" style="width: 40%;" variant="warning" @click="handlePay">Pay <span class="" v-html="fiatSymbol"></span> {{formattedFiat}}</b-button>
    </form>
  </div>
  <b-card-text v-if="testMode">
    <div class="mt-2 d-flex justify-content-around mt-5">
      <div><a href="#" class="rpay-text-secondary" @click.prevent="showTestPayments = !showTestPayments">Test Numbers</a></div>
    </div>
  </b-card-text>
  <TestPayments class="text-small" v-if="showTestPayments" />
</div>
</template>

<script>
import TestPayments from './components/TestPayments'
// import Square from 'square'

export default {
  name: 'CardPaymentScreen',
  components: {
    TestPayments
  },
  props: ['id', 'configuration', 'showPaymentForm'],
  data () {
    return {
      errors: [],
      showSpinner: true,
      showTestPayments: false,
      applePay: false,
      masterpass: false,
      submitUrl: '/mesh/v2/stacksmate/square/charge',
      internalId: null,
      card: null
    }
  },
  watch: {
    showPaymentForm: function () {
      if (!this.showPaymentForm) {
        return 1
      }
      this.paymentForm.build()
    }
  },
  mounted: function () {
    const configuration = this.configuration
    const locationId = configuration.payment.squarePay.locationId
    const applicationId = configuration.payment.squarePay.applicationId // 'sq0idp-gbQhcOCpmb2X4W1588Ky7A'
    // eslint-disable-next-line no-undef
    const payments = Square.payments(applicationId, locationId)
    payments.card({
      postalCode: '12345',
      style: {
        input: {
          color: 'red'
        },
        '@media screen and (max-width: 600px)': {
          input: {
            fontSize: '12px'
          }
        }
      }
    }).then((card) => {
      this.card = card
      card.attach('#card-container').then(() => {
        this.showSpinner = false
      })
    })
  },
  methods: {
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    paymentNotGood: function (errors) {
      if (errors) {
        errors.forEach(function (error) {
          this.errors.push(error.message)
        })
      } else {
        this.errors.push('Error during payment.')
      }
    },
    paymentGood: function (nonce) {
      const configuration = this.configuration
      const amountFiat = configuration.payment.amountFiat * configuration.payment.creditAttributes.start * 100
      fetch(configuration.risidioBaseApi + this.submitUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nonce: nonce,
          idempotencyKey: this.uuidv4(),
          currency: configuration.payment.currency,
          amountFiat: amountFiat, // amounts are in smallest denomination (cents, pence, etc)
          locationId: configuration.payment.squarePay.locationId
        })
      }).catch(err => {
        alert('Network error: ' + err)
      }).then(response => {
        if (!response.ok) {
          return response.json().then(
            errorInfo => Promise.reject(errorInfo))
        }
        return response.json()
      }).then(data => {
        // console.log(data)
        data.opcode = 'fiat-payment-success'
        data.numbCredits = configuration.payment.creditAttributes.start
        data.status = 'paid'
        this.$store.commit('rpayStore/setInvoice', data)
        this.$emit('rpayEvent', data)
      }).catch(err => {
        // console.error(err)
        const data = {
          opcode: 'fiat-payment-error',
          reason: err
        }
        this.$emit('rpayEvent', data)
      })
    },
    handlePay: function () {
      try {
        this.card.tokenize().then((tokenResult) => {
          if (tokenResult.status === 'OK') {
            this.paymentGood(tokenResult.token)
          } else {
            this.paymentNotGood(tokenResult)
          }
        })
      } catch (e) {
        this.paymentNotGood()
      }
    }
  },
  computed: {
    formattedFiat () {
      const configuration = this.configuration
      // const amountFiat = (configuration.payment) ? configuration.payment.amountFiat : '0'
      const amountFiat = configuration.payment.amountFiat * configuration.payment.creditAttributes.start
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      })
      const ffiat = formatter.formatToParts(amountFiat) /* $2,500.00 */
      return ffiat[1].value + '.' + ffiat[3].value
    },
    fiatSymbol () {
      const configuration = this.configuration
      const fc = (configuration.payment) ? configuration.payment.currency : '???'
      if (fc === 'EUR') {
        return '&euro;'
      } else if (fc === 'GBP') {
        return '&pound;'
      } else {
        return '&dollar;'
      }
    },
    testMode () {
      const configuration = this.configuration
      return configuration.payment.squarePay.applicationId.indexOf('sandbox') > -1
    }
  },
  created () {
  }
}
</script>

<style lang="scss">
.cp-totals {
  min-width: 450px;
  background: #000 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  padding: 5px 20px;
  margin-bottom: 50px;
  text-align: center;
}

.error {
  padding: 7px 10px;
  font-size: 0.7rem;
}
.loading-container {
  position: relative;
}
.loading {
  position: absolute;
  height: 82%;
  width: 90%;
  display: flex;
  background-color: #ffffff;
}
.loading svg {
  font-size: 40px;
  margin: auto;
  color: #0277bd;
}
.loaded {
  display: none;
}
#form-container {
  position: relative;
  width: 380px;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
}

.third {
  float: left;
  width: calc((100% - 32px) / 3);
  padding: 0;
  margin: 0 16px 16px 0;
}

.third:last-of-type {
  margin-right: 0;
}

/* Define how SqPaymentForm iframes should look */
.sq-input {
  height: 56px;
  padding: 17px 10px;
  box-sizing: border-box;
  border: 1px solid #E0E2E3;
  background-color: white;
  border-radius: 6px;
  display: inline-block;
  -webkit-transition: border-color .2s ease-in-out;
     -moz-transition: border-color .2s ease-in-out;
      -ms-transition: border-color .2s ease-in-out;
          transition: border-color .2s ease-in-out;
}

/* Define how SqPaymentForm iframes should look when they have focus */
.sq-input--focus {
  border: 1px solid #4A90E2;
}

/* Define how SqPaymentForm iframes should look when they contain invalid values */
.sq-input--error {
  border: 1px solid #E02F2F;
}

#sq-card-number {
  margin-bottom: 16px;
}

/* Customize the "Pay with Credit Card" button */
.button-credit-card {
  position: relative;
  bottom: -20px;
  width: 100%;
  height: 36px;
  margin-top: 10px;
  background: #4A90E2;
  border-radius: 6px;
  cursor: pointer;
  display: block;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  letter-spacing: 0;
  text-align: center;
  -webkit-transition: background .2s ease-in-out;
     -moz-transition: background .2s ease-in-out;
      -ms-transition: background .2s ease-in-out;
          transition: background .2s ease-in-out;
}

.button-credit-card:hover {
  background-color: #4281CB;
}

</style>
