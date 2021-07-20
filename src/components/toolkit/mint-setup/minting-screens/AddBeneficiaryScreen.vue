<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="">
    <b-card-text class="m-4">
      <b-form>
        <p class="">Add Contributer</p>
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
              <b-form-invalid-feedback id="chain-address-feedback">
                Enter at least 3 letters
              </b-form-invalid-feedback>
              <b-form-text id="chain-address-help">Royalties on sale will be sent to this address</b-form-text>
            </div>

            <div class="mb-4">
              <div class="text-left d-flex justify-content-between">
                <div class="w-50">Desired royalties</div>
                <div class="w-50">
                  <div class="mb-3" role="group">
                    <b-input-group size="sm" append="%">
                      <b-form-input
                        type="number"
                        id="royalty"
                        :state="royaltyState"
                        aria-describedby="royalty-help royalty-feedback"
                        placeholder="Enter royalty"
                        v-model.number="beneficiary.royalty">
                      </b-form-input>
                    </b-input-group>
                    <b-form-invalid-feedback id="royalty-feedback">
                      Between 0 and 50
                    </b-form-invalid-feedback>
                    <b-form-text id="royalty-help">To recieve on sale of each edition.</b-form-text>
                  </div>
                </div>
              </div>
            </div>

            <div v-html="errorMessage" class="text-danger"></div>

            <div class="mb-3" role="group">
              <label class="text2" for="username">Username</label>
              <b-form-input
                id="username"
                v-model="beneficiary.username"
                aria-describedby="username-help username-feedback"
                placeholder="Enter username"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="username-feedback">
                Enter at least 3 letters
              </b-form-invalid-feedback>
              <b-form-text id="username-help">Username this person</b-form-text>
            </div>

            <div class="mb-3" role="group">
              <label class="text2" for="email">Email</label>
              <b-form-input
                id="email"
                v-model="beneficiary.email"
                aria-describedby="email-help email-feedback"
                placeholder="Enter email"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="email-feedback">
                Enter at least 3 letters
              </b-form-invalid-feedback>
              <b-form-text id="email-help">Email for this person</b-form-text>
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
              <b-form-invalid-feedback id="role-feedback">
                Enter at least 3 letters
              </b-form-invalid-feedback>
              <b-form-text id="role-help">Role in relationship to this item</b-form-text>
            </div>
          </div>
        </div>
      </b-form>
    </b-card-text>
    <b-card-text class="mx-4">
      <div class="d-flex justify-content-between">
        <b-button @click="cancel()" class="w-50 mr-4" variant="outline-light">go back</b-button>
        <b-button @click="addBeneficiary()" class="w-50 ml-4" variant="outline-dark">save</b-button>
      </div>
    </b-card-text>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AddBeneficiaryScreen',
  components: {
  },
  props: ['eBen', 'errorMessage'],
  data () {
    return {
      formSubmitted: false,
      savedChainAddress: null,
      beneficiary: {
        royalty: 0,
        chainAddress: '',
        role: '',
        username: '',
        email: ''
      }
    }
  },
  mounted () {
    // this.toDecimals()
    if (this.eBen) {
      this.beneficiary = this.eBen
      this.savedChainAddress = this.eBen.chainAddress
    }
  },
  methods: {
    toDecimals: function () {
      this.beneficiary.royalty = Math.round(this.beneficiary.royalty * 100) / 100
    },
    cancel: function () {
      this.$store.commit('rpayStore/setDisplayCard', 100)
    },
    isValid: function (param) {
      if (param === 'chainAddress') {
        return this.beneficiary.chainAddress.length > 10
      } else if (param === 'royalty') {
        return typeof this.beneficiary.royalty === 'number' && this.beneficiary.royalty > 0 && this.beneficiary.royalty <= 100
      }
    },
    addBeneficiary: function () {
      this.formSubmitted = true
      // if (this.beneficiary.royalty) this.beneficiary.royalty = parseInt(this.beneficiary.royalty)
      if (!this.isValid('chainAddress') | !this.isValid('royalty')) return
      this.$emit('addBeneficiary', this.beneficiary)
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
    preferredNetwork () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
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
