<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="bg-dark">
    <b-card-text class="m-4">
      <b-form>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-3">
              <h2 for="description">Guest List</h2>
              <b-textarea
                ref="description"
                v-model="guestList"
                rows="5"
                placeholder="stx addresses comma separated - blank for no guest list"
              ></b-textarea>
            </div>
          </div>
        </div>
      </b-form>
    </b-card-text>
    <b-card-text class="mx-4">
      <div class="d-flex justify-content-between">
        <b-button @click="addGuestList()" class="w-50 mr-2" variant="warning">save</b-button>
        <b-button @click="cancel()" class="w-50 ml-2" variant="outline-light">cancel</b-button>
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
    if (this.loopRun.guestList) {
      this.guestList = this.loopRun.guestList
    }
  },
  methods: {
    cancel: function () {
      this.$emit('update', { opcode: 'cancel' })
    },
    addGuestList: function () {
      this.loopRun.guestList = this.guestList
      this.$store.dispatch('rpayCategoryStore/updateLoopRun', this.loopRun).then(() => {
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
