<template>
<b-card-group class="" v-if="guestList">
  <b-card header-tag="header" footer-tag="footer" class="bg-dark">
    <b-card-text class="m-4">
      <b-form>
        <div class="row">
          <div class="col-md-12">
            <h2 for="description">Guest List</h2>
          </div>
          <div class="col-md-12">
            <p>Allow List - addresses allowed to mint if empty then anyone can mint</p>
            <b-textarea
              ref="guestList"
              v-model="guestList.guestList"
              rows="5"
              placeholder="stx addresses comma separated - blank for no guest list"
            ></b-textarea>
          </div>
          <div class="col-md-12">
            <p>Block List - addresses not allowed to mint</p>
            <b-textarea
              ref="blockList"
              v-model="guestList.blockList"
              rows="5"
              placeholder="stx addresses comma separated - blank for no block list"
            ></b-textarea>
          </div>
        </div>
      </b-form>
    </b-card-text>
    <b-card-text class="mx-4">
      <div class="d-flex justify-content-between">
        <b-button @click="addGuestList()" class="w-50 mr-2" variant="warning">Update</b-button>
        <!-- <b-button @click="checkGuestList()" class="w-50 ml-2" variant="outline-light">check on guest list</b-button> -->
      </div>
    </b-card-text>
  </b-card>
</b-card-group>
</template>

<script>

export default {
  name: 'GuestList',
  components: {
  },
  props: ['loopRun'],
  data () {
    return {
      guestList: null
    }
  },
  mounted () {
    this.$store.dispatch('rpayCategoryStore/fetchGuestListByContractIdAndRunKey', this.loopRun).then((gl) => {
      if (gl) {
        this.update = true
        this.guestList = gl
      } else {
        this.guestList = {
          contractId: this.loopRun.contractId,
          currentRunKey: this.loopRun.currentRunKey
        }
      }
    })
  },
  methods: {
    cancel: function () {
      this.$emit('update', { opcode: 'cancel' })
    },
    checkGuestList: function () {
      this.guestList.guestList.split(',').forEach((gl) => {
        this.$store.dispatch('rpayCategoryStore/checkGuestList', this.guestList).then((result) => {
          if (result) {
            this.$notify({ type: 'success', title: 'Guest List', text: gl + 'is on the guest list!' })
          } else {
            this.$notify({ type: 'error', title: 'Guest List', text: gl + 'is not on the guest list!' })
          }
        }).catch(() => {
          this.$notify({ type: 'error', title: 'Guest List', text: 'Guest List check error!' })
        })
      })
    },
    addGuestList: function () {
      this.$store.dispatch('rpayCategoryStore/updateGuestList', this.guestList).then((gl) => {
        this.guestList = gl
        this.$notify({ type: 'success', title: 'Guest List', text: 'Guest List saved!' })
        this.$emit('update', { opcode: 'cancel' })
      }).catch(() => {
        this.$notify({ type: 'error', title: 'Guest List', text: 'Guest List error!' })
        this.$emit('update', { opcode: 'cancel' })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.text2 {
  text-transform: capitalize;
}

</style>
