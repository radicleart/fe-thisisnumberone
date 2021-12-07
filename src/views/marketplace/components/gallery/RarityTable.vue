<template>
  <div>
    <div v-if="allowRevealRarities() && hasTraits()"><b-link @click.prevent="fetchTraits()" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Click to display Punk Traits!'" class="text-warning"><b-icon icon="question-circle"/></b-link></div>
    <b-modal class="trait-modal" size="md" :id="'trait-modal-' + edition" v-if="trait">
      <template #modal-header="{ close }">
        <div class="text-black text-warning w-100 d-flex justify-content-between">
          <div><h2>Punk Traits</h2></div>
          <b-button size="sm" @click="close()"  class="m-0 p-1 text-dark" style="background: #fff; border:none; max-width: 30px !important; max-height: 30px !important;">
            <img class="filter-black" :src="cross" alt="close" style="max-width: 20px !important; max-height: 20px !important;"/>
          </b-button>
        </div>
      </template>
      <div class="mb-5 d-flex justify-content-between">
        <div>DNA: {{trait.dna}}</div>
        <div>{{trait.normalizedRarityScore.toFixed(2)}}</div>
      </div>
      <div>
        <b-table striped hover :items="values()" :fields="fields()" class="text-white">
        </b-table>
      </div>
      <template #modal-footer class="text-center"><div class="w-100"></div></template>
    </b-modal>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'RarityTable',
  components: {
  },
  props: ['image', 'loopRun', 'edition'],
  data () {
    return {
      cross: require('@/assets/img/navbar-footer/cross.svg'),
      trait: null
    }
  },
  methods: {
    hasTraits () {
      return typeof this.edition === 'number' && this.edition > -1
    },
    fetchTraits () {
      // this.$emit('update', { opcode: 'display-trait', edition: this.edition })
      this.$store.dispatch('publicItemsStore/fetchTraits', this.edition).then((trait) => {
        this.trait = trait
        this.$bvModal.show('trait-modal-' + this.edition)
        // this.$notify({ type: 'success', title: 'Punk Traits', text: 'Click to display Punk Traits!' })
      })
    },
    allowRevealRarities () {
      return this.loopRun && this.loopRun.status === 'active' && this.image.indexOf(this.loopRun.mintImage3) === -1
    },
    fields () {
      return ['Layer', 'Trait', 'Chance']
    },
    values () {
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
