<template>
<section id="deep-logos">
  <div class="row">
    <div class="col-10">
      <logo-risidio :model="currentModel" :scale="scale" :position="position"/>
    </div>
    <div class="col-2">
      <ul>
        <li v-for="( model, index) in gltfModels" :key="index" @click="currentModel = rootPath + model.name">{{model.name}}</li>
      </ul>
    </div>
  </div>
</section>
</template>

<script>
import LogoRisidio from '@/components/scenes/LogoRisidio.vue'
export default {
  name: 'Donate',
  components: {
    LogoRisidio
  },
  data () {
    return {
      currentModel0: 'https://test.risidio.com/gltf/3dLogos/Stacks/stacks_w.gltf',
      currentModel: '/gltf/P1.gltf',
      scale: [0.15, 0.15, 0.15],
      position: [0, 0, 0],
      rootPath: 'https://test.risidio.com/gltf/3dLogos/',
      gltfModels: [
        { name: 'bitcoin/bitcoin.gltf' },
        { name: 'bitcoin/with risidio/bitcoin_b_color.gltf' },
        { name: 'bitcoin/with risidio/bitcoin_b.gltf' },
        { name: 'bitcoin/with risidio/bitcoin_w_color.gltf' },
        { name: 'bitcoin/with risidio/bitcoin_w.gltf' },
        { name: 'light/light.gltf' },
        { name: 'light/with risidio/light_b_color.gltf' },
        { name: 'light/with risidio/light_b.gltf' },
        { name: 'light/with risidio/light_w_color.gltf' },
        { name: 'light/with risidio/light_w.gltf' },

        { name: 'Risidio/risidio_b_color.gltf' },
        { name: 'Risidio/risidio_b.gltf' },
        { name: 'Risidio/risidio_color.gltf' },
        { name: 'Risidio/risidio_w.gltf' },

        { name: 'Stacks/stacks_b.gltf' },
        { name: 'Stacks/stacks_w.gltf' },
        { name: 'Stacks/with_risidio/stacks_b_color.gltf' },
        { name: 'Stacks/with_risidio/stacks_b.gltf' },
        { name: 'Stacks/with_risidio/stacks_w_color.gltf' },
        { name: 'Stacks/with_risidio/stacks_w.gltf' },

        { name: 'Swan/swan.gltf' },
        { name: 'Swan/With_risidio/Swan_b_color.gltf' },
        { name: 'Swan/With_risidio/swan_b.gltf' },
        { name: 'Swan/With_risidio/swan_w_color.gltf' },
        { name: 'Swan/With_risidio/swan_w.gltf' }
      ]
    }
  },
  methods: {
    changeModel (name) {
      this.currentModel = this.rootPath + name
    }
  },
  computed: {
  }
}
</script>

<style>
#deep-logos li {
  cursor: pointer;
}
</style>
