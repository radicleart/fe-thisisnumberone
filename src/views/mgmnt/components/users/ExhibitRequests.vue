<template>
<div v-if="loaded" :key="componentKey">
  <b-table striped hover :items="values()" :fields="fields()" class="bg-light text-dark">
    <template #cell(status)="data">
      <b-button class="btn-action" size="sm" variant="warning" v-on:click="updateRequest(data)" v-html="data.value"></b-button>
    </template>
  </b-table>
</div>
<div v-else>
  <LoopbombSpinner />
</div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ExhibitRequests',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      componentKey: 0,
      loaded: false,
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      exhibitRequests: null,
      modalAuth: null,
      statusLabels: ['pending', 'approved', 'suspended']
    }
  },
  watch: {
  },
  mounted () {
    this.$store.dispatch('rpayMyItemStore/fetchExhibitRequests').then((exhibitRequests) => {
      this.exhibitRequests = exhibitRequests
      this.loaded = true
    })
  },
  methods: {
    fields () {
      return ['STX Address', 'Name', 'Status', 'Email']
    },
    values () {
      let mapped = []
      const $self = this
      mapped = this.exhibitRequests.map(function (exreq) {
        return {
          'STX Address': exreq.stxAddress,
          Name: exreq.name,
          Status: (exreq.status) ? $self.statusLabels[exreq.status - 1] : 'unknown',
          Email: exreq.email
        }
      })
      return mapped
    },
    updateRequest: function (data) {
      const index = this.exhibitRequests.findIndex((o) => o.stxAddress === data.item['STX Address'])
      if (index > -1) {
        data = this.exhibitRequests[index]
        if (data.status === 1) {
          data.status = 2
        } else if (data.status === 3) {
          data.status = 1
        } else {
          data.status = 3
        }
        this.$store.dispatch('rpayMyItemStore/updateExhibitRequestStatus', data).then((result) => {
          const index = this.exhibitRequests.findIndex((o) => o.stxAddress === result.data.stxAddress)
          if (index > -1) {
            this.exhibitRequests[index] = result.data
            this.componentKey++
          }
          const pData = { stxAddress: result.data.stxAddress, domain: location.hostname, privilege: 'can-upload' }
          if (data.status === 2) {
            this.$store.dispatch('rpayPrivilegeStore/addPrivilege', pData).then(() => {
              this.$notify({ type: 'warning', title: 'Privileges', text: 'Added upload privilege!' })
            })
          } else {
            this.$store.dispatch('rpayPrivilegeStore/removePrivilege', pData).then(() => {
              this.$notify({ type: 'warning', title: 'Privileges', text: 'Removed upload privilege!' })
            })
          }
        })
      }
    }
  },
  computed: {
    availablePrivileges () {
      const ap = this.$store.getters[APP_CONSTANTS.KEY_AVAILABLE_PRIVILEGES]
      return ap
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
