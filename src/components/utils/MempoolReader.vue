<template>
<div id="memread" class="">
<b-nav-item-dropdown right no-caret style="list-style: none;">
  <template v-slot:button-content>
    <div class="pl-2 px-2 mem-lights">
      <span><b-icon class="m-0 p-0" font-scale="0.9" :class="mempoolTemp()" icon="circle-fill"/></span>
    </div>
  </template>
  <b-dropdown-item>
    <div class="text-warning p-3">
      <div><a :class="mempoolTemp" :href="mempoolApi" target="_blank">Transactions in mempool: <span @click="fetchMempool()">{{mempool.total}}</span></a></div>
      <div :class="mempoolTemp()" v-if="mempoolTemp() === 'text-success'">Mint Away</div>
      <div :class="mempoolTemp()" v-if="mempoolTemp() === 'text-warning'">Mint with caution</div>
      <div :class="mempoolTemp()" v-if="mempoolTemp() === 'text-danger'">Minting paused due to high loads</div>
    </div>
    <div class="text-warning p-3">
      <div>Thresholds</div>
      <div class="text-white"> &lt; {{mempoolSettings.threshold2}} = Mint Away</div>
      <div class="text-white"> &lt; {{mempoolSettings.threshold3}} = Mint with caution</div>
      <div class="text-white"> &gt; {{mempoolSettings.threshold3}} = Minting paused due to high loads</div>
    </div>
  </b-dropdown-item>
</b-nav-item-dropdown>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MempoolReader',
  components: {
  },
  data () {
    return {
      mempoolApi: process.env.VUE_APP_STACKS_API + '/extended/v1/tx/mempool'
    }
  },
  mounted () {
    this.fetchMempool()
  },
  methods: {
    fetchMempool () {
      this.$store.dispatch('rpayStacksContractStore/fetchMempool').then((mempool) => {
        console.log(mempool)
      })
    },
    mempoolTemp () {
      if (this.mempool.total < this.mempoolSettings.threshold2) {
        return 'text-success'
      } else if (this.mempool.total < this.mempoolSettings.threshold3) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    }
  },
  computed: {
    mempoolSettings () {
      const mempoolSettings = this.$store.getters[APP_CONSTANTS.KEY_MEMPOOL_SETTINGS]
      return mempoolSettings || {}
    },
    mempool () {
      const mempool = this.$store.getters[APP_CONSTANTS.KEY_MEMPOOL]
      return mempool || {}
    }
  }
}
</script>
<style lang="scss">
#memread .dropdown-menu {
  background: #000 !important;
  margin: 0
}
#memread .dropdown-menu:hover {
  background: #000 !important;
}
.mem-lights {
  border-radius: 3px;
  cursor: pointer;
  /* border: 1pt solid #FF9900; */
  max-height: 55px;
  position: relative;
  top: -5px;
}
</style>
