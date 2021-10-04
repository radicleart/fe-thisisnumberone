<template>
    <div v-if="expired" class="">
      <b-link class="text-danger" @click.prevent="$emit('rpayEvent', { opcode: 'crypto-payment-expired' })">Expired - start over</b-link>
    </div>
    <div v-else>
      <div class="text-message">
        {{currentCountdown}}
      </div>
      <div v-if="showExpires">Expires {{expires()}}</div>
    </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import { Duration } from 'luxon'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CryptoCountdown',
  components: {
  },
  props: ['configuration'],
  data () {
    return {
      countdown: null,
      showExpires: false,
      expired: false,
      timeout: this.$store.getters[APP_CONSTANTS.KEY_INVOICE_EXPIRY] // { hours: 0, minutes: 1, seconds: 0 }
    }
  },
  mounted () {
    this.timeout = this.$store.getters[APP_CONSTANTS.KEY_INVOICE_DURATION]
    this.expired = this.$store.getters[APP_CONSTANTS.KEY_INVOICE_EXPIRED]
    if (this.expired) {
      this.$emit('rpayEvent', { opcode: 'crypto-payment-expired' })
    }
    this.startCountdown()
  },
  methods: {
    expires () {
      return this.$store.getters[APP_CONSTANTS.KEY_INVOICE_EXPIRES]
    },
    evPaymentExpired () {
      this.$emit('rpayEvent', { opcode: 'crypto-payment-expired' })
    },
    clockReset () {
      this.expired = true
      this.$emit('rpayEvent', { opcode: 'crypto-payment-expired' })
    },
    startCountdown () {
      let duration = Duration.fromMillis(this.timeout)
      const interval = 1
      const $self = this
      const timer = setInterval(function () {
        duration = Duration.fromMillis(durat.seconds - interval)
        let min = duration.minutes
        let sec = duration.seconds
        sec -= 1
        if (min < 0) return clearInterval(timer)
        if (min < 10 && min.length !== 2) min = '0' + min
        if (sec < 0 && min !== 0) {
          min -= 1
          sec = 59
        } else if (sec < 10 && sec.length !== 2) {
          sec = '0' + sec
        }
        $self.countdown = min + ':' + sec
        if (min <= 0 && sec <= 0) {
          $self.clockReset()
          // $self.timeout.seconds += 2
          duration = Duration.fromMillis($self.timeout)
        }
      }, 1000)
    }
  },
  computed: {
    currentCountdown () {
      if (!this.countdown && this.timeout) {
        let hrs = this.timeout.hours
        let min = this.timeout.minutes
        let sec = this.timeout.seconds
        if (hrs < 10 && hrs.length !== 2) hrs = '0' + hrs
        if (min < 10 && min.length !== 2) min = '0' + min
        if (sec < 10 && sec.length !== 2) sec = '0' + sec
        if (this.timeout.hours > 0) {
          return hrs + ':' + min + ':' + sec
        } else {
          return min + ':' + sec
        }
      } else {
        return this.countdown
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-content {
  padding-top: 0px;
}
</style>
