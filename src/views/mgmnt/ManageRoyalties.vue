<template>
<b-container class="text-white" v-if="loopRun">
  <div class="text-right">
    <span class="text-info mt-3" @click="resetRoyalties()"><b-icon icon="chevron-left"/> Reset</span>
    <b-link class="text-info mt-3" to="/mgmnt/manage-collections"><b-icon icon="chevron-left"/> Back</b-link>
  </div>
  <div>
    <h1 class="text-white">Manage Royalties for Collection</h1>
    <b-tabs
      active-nav-item-class="font-weight-bold text-uppercase text-danger"
      active-tab-class="font-weight-bold text-white"
      content-class="mt-3"
      justified bg-variant="warning" v-model="tabIndex" small card left>
      <b-tab title="Minting" active lazy>
        <Royalties :beneficiaries="mintRoyalties" :type="'mint'" @update="update"/>
      </b-tab>
      <b-tab title="Sales" lazy>
        <Royalties :beneficiaries="saleRoyalties" :type="'sale'" @update="update"/>
      </b-tab>
    </b-tabs>
    <div class="my-4">
      <b-button class="mr-3" variant="warning" @click="saveRoyalties">save royalties</b-button>
      <b-button class="mr-3" variant="outline-warning" @click="newRoyalty = !newRoyalty">new royalty</b-button>
      <b-button v-if="loopRun.type === 'punks'" variant="outline-warning" @click="sendToContract">send to contract</b-button>
    </div>
    <RoyaltyForm :key="componentKey" v-if="newRoyalty" :royalty="royalty" @update="update"/>
  </div>
</b-container>
</template>

<script>
import Royalties from './components/collections/Royalties.vue'
import RoyaltyForm from './components/collections/RoyaltyForm.vue'

export default {
  name: 'ManageRoyalties',
  components: {
    RoyaltyForm,
    Royalties
  },
  data () {
    return {
      tabIndex: 0,
      newRoyalty: false,
      currentRunKey: null,
      royalty: null,
      royalties: null,
      mintRoyalties: [],
      saleRoyalties: [],
      componentKey: 0,
      loopRun: null
    }
  },
  mounted () {
    this.currentRunKey = this.$route.params.currentRunKey
    this.$store.dispatch('rpayCategoryStore/fetchLoopRun', this.currentRunKey).then((loopRun) => {
      this.loopRun = loopRun
      this.$store.dispatch('rpayCategoryStore/fetchRoyalties', this.currentRunKey).then((royalties) => {
        if (!royalties) {
          // const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
          const configuration = this.$store.getters['rpayStore/getConfiguration']
          // configuration.minter.beneficiaries[1].chainAddress = profile.stxAddress
          // configuration.minter.beneficiaries[1].username = profile.username
          this.mintRoyalties = configuration.minter.beneficiariesMint
          this.saleRoyalties = configuration.minter.beneficiaries
        } else {
          this.royalties = royalties
          this.mintRoyalties = royalties.mintRoyalties
          this.saleRoyalties = royalties.saleRoyalties
        }
      })
    })
  },
  methods: {
    resetRoyalties () {
      const configuration = this.$store.getters['rpayStore/getConfiguration']
      this.mintRoyalties = configuration.minter.beneficiariesMint
      this.saleRoyalties = configuration.minter.beneficiaries
      this.royalties = null
      this.saveRoyalties()
    },
    saveRoyalties () {
      if (!this.royalties) {
        this.royalties = {
          currentRunKey: this.currentRunKey,
          mintRoyalties: this.mintRoyalties,
          saleRoyalties: this.saleRoyalties
        }
      } else {
        this.royalties.mintRoyalties = this.mintRoyalties
        this.royalties.saleRoyalties = this.saleRoyalties
      }
      this.$store.dispatch('rpayCategoryStore/updateRoyalties', this.royalties).then((royalties) => {
        this.$notify({ type: 'success', title: 'royalties', text: 'royalties saved!' })
        this.royalties = royalties
        this.mintRoyalties = royalties.mintRoyalties
        this.saleRoyalties = royalties.saleRoyalties
      }).catch(() => {
        this.$notify({ type: 'error', title: 'royalties', text: 'royalties error!' })
      })
    },
    update (data) {
      this.newRoyalty = false
      if (data.opcode === 'cancel') {
        this.tabIndex = 0
      } else if (data.opcode === 'addBeneficiary') {
        const r = (data.beneficiary.type === 'sale') ? this.saleRoyalties : this.mintRoyalties
        if (this.tabIndex === 1) {
          data.beneficiary.type = 'sale'
        } else {
          data.beneficiary.type = 'mint'
        }
        const index = r.findIndex((r) => r.chainAddress === data.beneficiary.chainAddress)
        if (index === -1) {
          r.splice(0, 0, data.beneficiary)
        } else {
          r.splice(index, 1, data.beneficiary)
        }
      } else if (data.opcode === 'delBeneficiary') {
        let r = this.mintRoyalties
        this.tabIndex = 0
        if (data.type === 'sale') {
          r = this.saleRoyalties
          this.tabIndex = 1
        }
        const index = r.findIndex((r) => r.chainAddress === data.beneficiary.chainAddress)
        if (index > -1) {
          r.splice(index, 1)
        }
      } else if (data.opcode === 'editBeneficiary') {
        this.newRoyalty = true
        this.royalty = data.beneficiary
        this.royalty.type = data.type
        this.componentKey++
      }
    },
    sendToContract: function () {
      const data = {
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: this.loopRun.contractId.split('.')[1],
        beneficiaries: this.saleRoyalties,
        minteficaries: this.mintRoyalties
      }
      this.$store.dispatch('rpayPurchaseStore/setCollectionRoyalties', data).then((result) => {
        this.result = result
      }).catch((error) => {
        console.log(error)
        this.sellingMessage = null
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.btn {
  width: inherit;
}
.text-muted {
  color: #ffd54f !important;
}
</style>
