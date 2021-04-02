<template>
<div  class="mt-3">
  <div class="text-white d-flex justify-content-between" v-if="minted()">
    <!-- <div><a :href="risidioAuctionsUrl" target="_blank">NFT #{{item.nftIndex}}</a></div>
    <div>minted on: {{mintedDate}}</div>
    -->
    <div class="text-small">
      <b-button class="" variant="success">Minted at #{{item.nftIndex}}</b-button>
    </div>
  </div>
  <div class="d-flex justify-content-between" v-else-if="isValid">
    <div class="text-small" v-if="isValid && !mintedDate">
      <b-button class="" variant="danger" @click.prevent="mintToken()">Mint Item</b-button>
    </div>
  </div>
  <div class="d-flex justify-content-between" v-else>
    <span>not valid - fields required: </span>
  </div>
  <b-modal size="md" id="minting-modal">
    <risidio-pay class="text-dark" v-if="showRpay" :configuration="configuration"/>
  </b-modal>
  <b-modal id="result-modal">
    <div v-html="mintResult"></div>
    <template #modal-footer class="text-center">
      <div class="w-100">
      </div>
    </template>
  </b-modal>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import RisidioPay from 'risidio-pay'

const RISIDIO_ASSET_URL = process.env.VUE_APP_RISIDIO_ASSET_URL

export default {
  name: 'ItemMintInfo',
  components: {
    RisidioPay
  },
  props: ['item'],
  data: function () {
    return {
      showRpay: false,
      mintResult: null,
      mintTitle: ''
    }
  },
  mounted () {
    const $self = this
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'minting-flow', asset: this.item })
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        $self.mintResult = data.message
        if (data.opcode === 'stx-mint-success' || data.opcode === 'eth-mint-success') {
          $self.showRpay = false
          $self.$bvModal.hide('minting-modal')
          $self.$bvModal.show('result-modal')
          const item = $self.$store.getters['myItemStore/myItem']($self.item.assetHash)
          item.tokenId = data.tokenId
          item.nftIndex = data.nftIndex
          item.network = data.network
          item.mintedDate = moment({}).valueOf()
          $self.$store.dispatch('myItemStore/saveItem', item).then((item) => {
            $self.mintResult = item.name + ' (#' + item.nftIndex + ') has been saved to your storage'
          })
        } else if (data.opcode === 'save-mint-data') {
          console.log(data.opcode)
        } else if (data.opcode === 'stx-contract-data') {
          console.log(data.opcode)
        } else {
          // $self.$bvModal.hide('minting-modal')
          // $self.showRpay = false
          // $self.mintResult = data.message
          // $self.mintTitle = 'Not Minted'
          // $self.$bvModal.show('result-modal')
        }
      })
    }
  },
  methods: {
    mintToken: function () {
      this.$bvModal.show('minting-modal')
      this.mintTitle = 'Mint: ' + this.item.name
      this.showRpay = true
    },
    downable: function () {
      return this.uploadState > 2
    },
    minted: function () {
      return this.item.nftIndex > -1
    },
    upable: function () {
      return this.uploadState > 1 && this.uploadState < 5
    }
  },
  computed: {
    risidioAuctionsUrl () {
      if (this.item && this.item.nftIndex && typeof this.item.nftIndex === 'number' && this.item.nftIndex >= 0) {
        return RISIDIO_ASSET_URL + this.item.assetHash
      }
      return null
    },
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    isValid: function () {
      const invalidItems = this.$store.getters[APP_CONSTANTS.KEY_ITEM_VALIDITY](this.item)
      return invalidItems.length === 0
    },
    mintedDate: function () {
      if (this.item.nftIndex > -1) {
        return moment(this.item.mintedDate).format('YYYY-MM-DD HH:mm:SS')
      }
      return null
    }
  }
}
</script>

<style>
#minting-modal .modal-content {
  background-color: transparent !important;
  border-radius: 20px;
  min-height: 200px;
  color: #fff;
  border: none;
}
#minting-modal .modal-header {
  display: none;
  border-bottom: 0px solid #dee2e6;
  border-radius: 20px;
}
#minting-modal .modal-footer {
  display: none;
  border-top: 0px solid #dee2e6;
  border-radius: 20px;
}
#minting-modal .footer-container {
  background: transparent !important;
}

</style>
