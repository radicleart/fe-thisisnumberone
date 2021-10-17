<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="bg-dark">
    <b-card-text class="m-4">
      <b-form>
        <p class="">Add Royalty</p>
        <b-form-checkbox
          size="lg"
          id="beneficiaryType"
          v-model="beneficiary.type"
          name="beneficiaryType"
          value="sale"
          unchecked-value="mint">
          <div class="pointer">Type of royalty: <span class="text-warning">{{beneficiary.type}}</span></div>
        </b-form-checkbox>

        <div class="row">
          <div class="col-md-12">
            <div class="mb-3" role="group">
              <label class="text2" for="chain-address">{{preferredNetwork}} Address</label>
              <b-form-input
                id="chain-address"
                v-model="beneficiary.chainAddress"
                :state="chainAddressState"
                aria-describedby="chain-address-help chain-address-feedback"
                placeholder="Enter wallet address"
                trim
              ></b-form-input>
            </div>

            <div class="mb-4">
              <div class="">
                <div class="">Primary Sale</div>
                <div class="">
                  <div class="mb-3" role="group">
                    <b-input-group size="lg" append="%">
                      <b-form-input
                        type="number"
                        id="royalty"
                        :state="royaltyState"
                        aria-describedby="royalty-help royalty-feedback"
                        placeholder="Enter royalty"
                        v-model.number="beneficiary.royalty">
                      </b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-4" v-if="beneficiary.type === 'sale'">
              <div class="">
                <div class="">Secondary Sale</div>
                <div class="">
                  <div class="mb-3" role="group">
                    <b-input-group size="lg" append="%">
                      <b-form-input
                        type="number"
                        id="secondaryRoyalty"
                        :state="secondaryRoyaltyState"
                        aria-describedby="secondaryRoyalty-help secondaryRoyalty-feedback"
                        placeholder="Enter secondary royalty"
                        v-model.number="beneficiary.secondaryRoyalty">
                      </b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3" role="group">
              <label class="text2" for="role">Role</label>
              <b-form-input
                id="role"
                v-model="beneficiary.role"
                aria-describedby="role-help role-feedback"
                placeholder="Enter role"
                trim
              ></b-form-input>
            </div>
          </div>
        </div>
      </b-form>
    </b-card-text>
    <b-card-text class="mx-4">
      <div class="d-flex justify-content-between">
        <b-button @click="addBeneficiary()" class="w-50 ml-2" variant="dark">save</b-button>
        <b-button @click="cancel()" class="w-50 mr-2" variant="danger">cancel</b-button>
      </div>
    </b-card-text>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'RoyaltyForm',
  components: {
  },
  props: ['royalty', 'errorMessage'],
  data () {
    return {
      formSubmitted: false,
      savedChainAddress: null,
      beneficiaryType: 'sale',
      beneficiary: {
        type: 'sale',
        royalty: 0,
        secondaryRoyalty: 0,
        chainAddress: '',
        role: '',
        username: '',
        email: ''
      }
    }
  },
  mounted () {
    if (this.royalty) {
      this.beneficiary = this.royalty
      this.beneficiaryType = this.royalty.type
      this.savedChainAddress = this.royalty.chainAddress
    }
  },
  methods: {
    toDecimals: function () {
      this.beneficiary.royalty = Math.round(this.beneficiary.royalty * 100) / 100
    },
    cancel: function () {
      this.$emit('update', { opcode: 'cancel' })
    },
    isValid: function (param) {
      if (param === 'chainAddress') {
        return this.beneficiary.chainAddress.length > 10
      } else if (param === 'royalty') {
        return typeof this.beneficiary.royalty === 'number' && this.beneficiary.royalty > 0 && this.beneficiary.royalty <= 100
      } else if (param === 'secondaryRoyalty') {
        return typeof this.beneficiary.secondaryRoyalty === 'number' && this.beneficiary.secondaryRoyalty > 0 && this.beneficiary.secondaryRoyalty <= 100
      }
    },
    addBeneficiary: function () {
      this.formSubmitted = true
      if (!this.isValid('chainAddress') | !this.isValid('royalty')) return
      this.$emit('update', { opcode: 'addBeneficiary', beneficiary: this.beneficiary })
    }
  },
  computed: {
    chainAddressState () {
      if (!this.beneficiary.chainAddress) return
      return this.isValid('chainAddress')
    },
    royaltyState () {
      if (!this.beneficiary.royalty) return
      return this.isValid('royalty')
    },
    secondaryRoyaltyState () {
      if (!this.beneficiary.secondaryRoyalty) return
      return this.isValid('secondaryRoyalty')
    },
    preferredNetwork () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration.minter.preferredNetwork
    }
  }
}
</script>
<style lang="scss" scoped>
.text2 {
  text-transform: capitalize;
}
</style>
