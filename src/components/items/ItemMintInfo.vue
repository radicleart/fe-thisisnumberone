<template>
<div  class="mt-3">
  <div class="bg-success p-3 text-white d-flex justify-content-between" v-if="mintedDate">
    <div><a :href="risidioAuctionsUrl" target="_blank">NFT #{{item.nftIndex}}</a></div>
    <div>minted on: {{mintedDate}}</div>
  </div>
  <div class="d-flex justify-content-between" v-else-if="isValid">
    <div class="text-small" v-if="isValid && !mintedDate">
      <b-button class="" variant="danger" @click.prevent="mintToken()">Mint Item</b-button>
    </div>
  </div>
  <div class="d-flex justify-content-between" v-else>
    <span>not valid - fields required: </span>
  </div>
  <b-modal size="lg" id="minting-modal">
    <risidio-pay class="text-dark" v-if="showRpay" :configuration="configuration"/>
  </b-modal>
  <b-modal id="result-modal">
    <div v-html="mintResult"></div>
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
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        $self.mintResult = data.message
        if (data.opcode === 'stx-mint-success' || data.opcode === 'eth-mint-success') {
          $self.$bvModal.hide('minting-modal')
          $self.$bvModal.show('result-modal')
          $self.showRpay = false
          const item = $self.$store.getters['myItemStore/myItem']($self.item.assetHash)
          item.tokenId = data.tokenId
          item.nftIndex = data.nftIndex
          item.network = data.network
          item.mintedDate = moment({}).valueOf()
          $self.$store.dispatch('myItemStore/saveItem', item).then((item) => {
            $self.mintResult = item.name + ' (#' + item.nftIndex + ') has been saved to your storage'
          })
        } else if (data.opcode === 'save-mint-data') {
          $self.$bvModal.hide('minting-modal')
          $self.showRpay = false
        } else {
          $self.$bvModal.hide('minting-modal')
          $self.showRpay = false
          $self.mintResult = data.message
          $self.mintTitle = 'Not Minted'
          $self.$bvModal.show('result-modal')
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
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION](this.item)
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
