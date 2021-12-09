<template>
<b-card class="bg-black mt-0 py-1 text-white" style="overflow-y: scroll; overflow-x: hidden; ">
  <b-card-text :style="'height:' + (height - 20) + 'px;'">
    <div class="text-xsmall text-center" v-if="trait">
      <div>{{trait.dna}}</div>
    </div>
    <div class="text-small d-flex justify-content-between" v-if="trait">
      <div><span class="text-warning" v-b-tooltip.hover="{ variant: 'warning' }" title="Normalized rarity score - 100 is most rare, 0 least.">{{trait.normalizedRarityScore.toFixed(4)}}</span></div>
      <div><span class="text-warning">{{trait.rank}} / {{loopRun.versionLimit}}</span></div>
    </div>
    <div>
      <b-table striped hover :items="values()" :fields="fields()" class="my-0 bg-black text-small text-white">
      </b-table>
    </div>
  </b-card-text>
</b-card>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'RarityTable',
  components: {
  },
  props: ['height', 'image', 'loopRun', 'edition'],
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      trait: null
    }
  },
  mounted () {
    this.fetchTraits()
  },
  methods: {
    fetchTraits () {
      // this.$emit('update', { opcode: 'display-trait', edition: this.edition })
      this.$store.dispatch('publicItemsStore/fetchTraits', this.edition).then((trait) => {
        this.trait = trait
        this.$bvModal.show('trait-modal-' + this.edition)
        // this.$notify({ type: 'success', title: 'Punk Traits', text: 'Click to display Punk Traits!' })
      })
    },
    fields () {
      return [
        {
          key: 'Layer'
        },
        {
          key: 'Trait'
        },
        {
          key: 'Chance',
          sortable: true
        }
      ]
    },
    values () {
      if (!this.trait) return []
      let mapped = []
      mapped = this.trait.attributes.map(function (trait) {
        const label = trait.trait_type.split('_')
        label.splice(0, 2)
        const value = (trait.value) ? trait.value.split('_') : ['']
        value.splice(0, 1)
        return {
          Layer: label.join(' '),
          Trait: value.join(' '),
          Chance: trait.chance.toFixed(5)
        }
      })
      return mapped
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
<style>
.modal-content {
    border: none !important;
    border-radius: 0px !important;
    min-height: 200px;
    background-color: #000;
    color: #fff;
    padding: 50px;
}
.trait-tools  .nav-link.active {
  color: #000;
}
.trait-tools .nav-link:hover {
  color: #ccc;
}
</style>
