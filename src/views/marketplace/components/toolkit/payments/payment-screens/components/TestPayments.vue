<template>
<div class="">
  <b-card-text>
    <div>
      <table id="ember707" class="ember-view"><thead id="ember709" class="ember-view"><tr id="ember711" class="ember-view"><th id="ember713" class="ember-view">Brand</th><th id="ember718" class="ember-view">Number</th><th id="ember723" class="ember-view">CVV</th><th id="ember728" class="ember-view">Verification Code</th></tr></thead><tbody id="ember733" class="ember-view"><tr id="ember735" class="ember-view"><td id="ember737" class="ember-view">Visa</td><td id="ember742" class="ember-view">4111 1111 1111 1111</td><td id="ember747" class="ember-view">111</td><td id="ember752" class="ember-view">❌</td></tr><tr id="ember765" class="ember-view"><td id="ember767" class="ember-view">Visa EU</td><td id="ember772" class="ember-view">4310 0000 0020 1019</td><td id="ember777" class="ember-view">111</td><td id="ember782" class="ember-view">123456</td></tr><tr id="ember787" class="ember-view"><td id="ember789" class="ember-view">MasterCard</td><td id="ember794" class="ember-view">5105 1051 0510 5100</td><td id="ember799" class="ember-view">111</td><td id="ember804" class="ember-view">❌</td></tr><tr id="ember817" class="ember-view"><td id="ember819" class="ember-view">MasterCard EU</td><td id="ember824" class="ember-view">5500 0000 0020 1016</td><td id="ember829" class="ember-view">111</td><td id="ember834" class="ember-view">123456</td></tr><tr id="ember839" class="ember-view"><td id="ember841" class="ember-view">Discover</td><td id="ember846" class="ember-view">6011 0000 0000 0004</td><td id="ember851" class="ember-view">111</td><td id="ember856" class="ember-view">❌</td></tr><tr id="ember869" class="ember-view"><td id="ember871" class="ember-view">Discover EU</td><td id="ember876" class="ember-view">6011 0000 0020 1016</td><td id="ember881" class="ember-view">111</td><td id="ember886" class="ember-view">123456</td></tr><tr id="ember891" class="ember-view"><td id="ember893" class="ember-view">Diners Club</td><td id="ember898" class="ember-view">3000 000000 0004</td><td id="ember903" class="ember-view">111</td><td id="ember908" class="ember-view">❌</td></tr><tr id="ember921" class="ember-view"><td id="ember923" class="ember-view">JCB</td><td id="ember928" class="ember-view">3569 9900 1009 5841</td><td id="ember933" class="ember-view">111</td><td id="ember938" class="ember-view">❌</td></tr><tr id="ember951" class="ember-view"><td id="ember953" class="ember-view">American Express</td><td id="ember958" class="ember-view">3400 000000 00009</td><td id="ember963" class="ember-view">1111</td><td id="ember968" class="ember-view">❌</td></tr><tr id="ember981" class="ember-view"><td id="ember983" class="ember-view">American Express EU</td><td id="ember988" class="ember-view">3700 000002 01014</td><td id="ember993" class="ember-view">1111</td><td id="ember998" class="ember-view">123456</td></tr><tr id="ember1003" class="ember-view"><td id="ember1005" class="ember-view">China UnionPay</td><td id="ember1010" class="ember-view">6222 9888 1234 0000</td><td id="ember1015" class="ember-view">123</td><td id="ember1020" class="ember-view">❌</td></tr><tr id="ember1033" class="ember-view"><td id="ember1035" class="ember-view">Square Gift Card</td><td id="ember1040" class="ember-view">7783 3200 0000 0000</td><td id="ember1045" class="ember-view">❌</td><td id="ember1058" class="ember-view">❌</td></tr></tbody></table>
    </div>
  </b-card-text>
  <b-card-text>
    <div>
      <table id="ember707" class="ember-view">
      <tbody id="ember733" class="ember-view">
        <tr id="ember735" class="ember-view">
          <th id="ember713" class="ember-view">FIAT</th>
          <td id="ember737" class="ember-view">fiat-payment-success</td>
        </tr>
        <tr id="ember735" class="ember-view">
          <th id="ember713" class="ember-view">BTC/L-BTC</th>
          <td id="ember737" class="ember-view">btc-crypto-payment-success</td>
        </tr>
        <tr id="ember735" class="ember-view">
          <th id="ember718" class="ember-view">STX</th>
          <td id="ember737" class="ember-view">stx-crypto-payment-success</td>
        </tr>
        <tr id="ember735" class="ember-view">
          <th id="ember718" class="ember-view">ETH</th>
          <td id="ember737" class="ember-view">eth-crypto-payment-success</td>
        </tr>
        <tr id="ember735" class="ember-view">
          <th id="ember718" class="ember-view">Restart</th>
          <td id="ember737" class="ember-view">payment-restart</td>
        </tr>
        <tr id="ember735" class="ember-view">
          <th id="ember718" class="ember-view">Expired</th>
          <td id="ember737" class="ember-view">crypto-payment-expired</td>
        </tr>
      </tbody>
    </table>
    </div>
  </b-card-text>
</div>
</template>

<script>

export default {
  name: 'TestPayments',
  components: {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.ember-view {
  font-size: 0.8rem;
}
</style>
