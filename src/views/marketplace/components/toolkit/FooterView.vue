<template>
<div class="">
  <b-form-input class="text-warning" disabled id="range-2" :value="displayCard" type="range" min="100" max="104" step="2"></b-form-input>
  <div class="d-flex justify-content-between" style="font-size: 0.7rem;">
    <div :class="(displayCard === 100) ? 'text-danger' : 'text-info'" @click="skipAhead(0)">Select Credits</div>
    <div :class="(displayCard === 102) ? 'text-danger' : 'text-info'" @click="skipAhead(1)">Choose Currency</div>
    <div :class="(displayCard === 104) ? 'text-danger' : 'text-info'" @click="skipAhead(2)">Make Payment</div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'FooterView',
  components: {
  },
  props: ['paymentStage'],
  data () {
    return {
    }
  },
  methods: {
    skipAhead (screen) {
      let disp = 100
      if (screen === 1) disp = 102
      else if (screen === 2) disp = 104
      this.$emit('rangeEvent', disp)
    },
    isSelected () {
      if (this.paymentStage === 0) return true
      else if (this.paymentStage === 1) return true
      else if (this.paymentStage === 2) return true
      return false
    }
  },
  computed: {
    displayCard () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      return displayCard
    },
    rangeValue () {
      const displayCard = this.displayCard
      if (displayCard === 100) return 0
      else if (displayCard === 102) return 1
      else return 2
    }
  }
}
</script>
<style >

input[type=range] {
  width: 100%;
  margin: 13.8px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 100%;
  height: 1.4px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -8px;
  width: 15px;
  height: 15px;
  background: #dfffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #000;
}
input[type=range]::-moz-range-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 100%;
  height: 3.4px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 8px;
  height: 8px;
  background: #dfffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 14.8px 0;
  color: transparent;
  width: 100%;
  height: 8.4px;
  cursor: pointer;
}
input[type=range]::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type=range]::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type=range]::-ms-thumb {
  width: 8px !important;
  height: 16px !important;
  background: #dfffff;
  border: 1px solid #000000;
  border-radius: 50% !important;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type=range]:focus::-ms-fill-lower {
  background: #3071a9;
}
input[type=range]:focus::-ms-fill-upper {
  background: #367ebd;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align:auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type=range] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}
</style>
