<template>
<div>
  <div style="font-size: 1.6rem;" class="d-flex justify-content-between" v-if="beneficiary">
    <div><a href="#" @click.prevent="showBeneficiary = !showBeneficiary">{{chainAddress()}}</a></div>
    <div class=" d-flex justify-content-between">
      <div class="mr-5">{{displayBeneficiary(beneficiary.royalty)}} %</div>
      <div v-if="!beneficiary.owner" style="width: 40px;">
        <a href="#" @click="editBeneficiary()"><b-icon icon="pencil"/></a>
        <a class="ml-2 text-danger" href="#" @click="removeBeneficiary()"><b-icon icon="trash"/></a>
      </div>
      <div v-else style="width: 40px;">
      </div>
    </div>
  </div>
  <div class="" style="font-size: 1.3rem;" v-if="showBeneficiary">
    <div class="row">
      <div class="col-3">Address</div>
      <div class="col-9">{{beneficiary.chainAddress}}</div>
    </div>
    <div class="row">
      <div class="col-3">Royalty</div>
      <div class="col-9">{{beneficiary.royalty}}</div>
    </div>
    <div class="row">
      <div class="col-3">Role</div>
      <div class="col-9">{{beneficiary.role}}</div>
    </div>
    <div class="row">
      <div class="col-3">Username</div>
      <div class="col-9">{{beneficiary.username}}</div>
    </div>
    <div class="row">
      <div class="col-3">Email</div>
      <div class="col-9">{{beneficiary.email}}</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Beneficiary',
  components: {
  },
  props: ['beneficiary'],
  data () {
    return {
      showBeneficiary: false
    }
  },
  methods: {
    chainAddress: function () {
      if (this.beneficiary.username) return this.beneficiary.username
      return this.beneficiary.chainAddress.substring(0, 5) + '...' + this.beneficiary.chainAddress.substring(this.beneficiary.chainAddress.length - 5)
    },
    displayBeneficiary: function (num) {
      return parseFloat(num).toFixed(2)
    },
    editBeneficiary: function () {
      this.$emit('editBeneficiary', this.beneficiary)
    },
    removeBeneficiary: function () {
      this.$emit('removeBeneficiary', this.beneficiary)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
