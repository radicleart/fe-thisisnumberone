<template>
<div class="mt-3" v-if="!loading">
    <b-row class="mb-2 text-success">
      <b-col :cols="(hidePrimaries) ? 9 : 6">Address</b-col>
      <b-col cols="3" v-if="!hidePrimaries">Primary</b-col>
      <b-col cols="3">Secondary</b-col>
    </b-row>
  <div v-if="beneficiaries">
    <!--
    <b-row class="mb-2">
      <b-col cols="6"><span v-b-tooltip.hover="{ variant: 'danger' }" :title="'STX Address of the secondary buyer/owner owner'">Secondary Buyer/Owner</span></b-col>
      <b-col cols="3">{{beneficiaries[0].royalty}}</b-col>
      <b-col cols="3">{{beneficiaries[0].secondaryRoyalty}}</b-col>
    </b-row>
    -->
    <div v-for="(beneficiary, index) in beneficiaries" :key="index">
      <ListBeneficiary :beneficiary="beneficiary" :index="index" :hidePrimaries="hidePrimaries"/>
    </div>
  </div>
  <div v-else>
    <p>Royalties are set by the first edition of the series.</p>
  </div>
</div>
</template>

<script>
import ListBeneficiary from '@/views/marketplace/components/toolkit/ListBeneficiary'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ListBeneficiaries',
  components: {
    ListBeneficiary
  },
  props: ['item', 'loopRun'],
  data: function () {
    return {
      loading: true,
      toAddress: null,
      errorMessage: null,
      hidePrimaries: true,
      beneficiaries: null
    }
  },
  mounted () {
    let currentRunKey = (this.item) ? this.item.attributes.collection : null
    if (!currentRunKey) {
      currentRunKey = this.loopRun.currentRunKey
    }
    if (currentRunKey.indexOf('/') > -1) {
      currentRunKey = currentRunKey.split('/')[0]
    }
    this.setBeneficiaries(currentRunKey)
  },
  methods: {
    setBeneficiaries: function (currentRunKey) {
      if (this.item && this.item.contractAsset && this.item.contractAsset.beneficiaries) {
        const contratBenes = this.item.contractAsset.beneficiaries
        this.beneficiaries = []
        for (let i = 0; i < contratBenes.addresses.length; i++) {
          if (contratBenes.shares[i].value > 0) {
            this.beneficiaries.push({
              chainAddress: (i > 0) ? contratBenes.addresses[i].valueHex : 'Seller',
              royalty: contratBenes.shares[i].value,
              secondaryRoyalty: contratBenes.secondaries[i].value
            })
          }
        }
        this.loading = false
      } else {
        this.$store.dispatch('rpayCategoryStore/fetchRoyalties', currentRunKey).then((royalties) => {
          // this.minteficaries = royalties.mintRoyalties
          if (royalties.saleRoyalties) {
            this.beneficiaries = royalties.saleRoyalties
          } else {
            const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
            this.beneficiaries = configuration.minter.beneficiaries
          }
          this.loading = false
        })
      }
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
