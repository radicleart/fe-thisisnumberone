<template>
    <b-form>
      <div class="row">
        <div class="col-md-12 col-xs-12">
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="signer - public key 33 bytes">Signer</span></div>
            </div>
            <b-input v-model="signer" placeholder="Signer"></b-input>
            <b-button class="mr-3" variant="light" @click.prevent="updateSigner()">Update</b-button>
          </div>
        </div>
      </div>
    </b-form>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import {
  bufferCV
} from '@stacks/transactions'

const NETWORK = process.env.VUE_APP_NETWORK
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

export default {
  name: 'ContractForm',
  components: {
  },
  data () {
    return {
      signer: null,
      project: null
    }
  },
  methods: {
    updateSigner: function () {
      const contractAddress = STX_CONTRACT_ADDRESS
      const contractName = STX_CONTRACT_NAME
      const functionArgs = [bufferCV(Buffer.from(this.signer, 'hex'))]
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      const data = {
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'update-signer',
        functionArgs: functionArgs,
        eventCode: 'update-signer'
      }
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$notify({ type: 'success', title: 'Contract update', text: 'Signer changed.' })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Contract Not Found', text: 'Unable to find contract on blobkchain.' })
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
