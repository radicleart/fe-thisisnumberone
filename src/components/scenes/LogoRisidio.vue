<template>
<section>
  <Scene id="logo-risidio" name="logo-risidio">
    <Asset :scaling="scale" :position="position" :src="model"></Asset>
    <!--
    <Property name="clearColor" color="#fefefe"></Property>
    <Camera type="arcRotate" :position="[0, 1, 0]" ></Camera>
    <Asset
      @complete="complete"
      @before-render$="beforeRender"
      @after-render$="++frames"
      :src="model"
      :scaling="scale"
      :position="[0, 0, 0]"
      :rotation="[0, Math.PI, 0]"></Asset>
    <Box :position="[0, 0, 0]">
      <Material diffuse="#41B883" specular="#41B883"></Material>
      <Animation property="rotation.x" :duration="200" :end="Math.PI * 4"></Animation>
      <Animation property="rotation.y" :duration="200" :end="Math.PI * 4"></Animation>
    </Box>
    <Asset src="https://www.babylonjs-playground.com/scenes/skull.babylon" :scaling="[0.02, 0.02, 0.02]" :position="[4, 0.5, 0]"></Asset>
    <Asset src="https://www.babylonjs-playground.com/scenes/StanfordBunny.obj" :scaling="[7.5, 7.5, 7.5]" :position="[-4, -0.25, -0.5]" :rotation="[0, Math.PI, 0]"></Asset>
    <Asset src="https://rawgit.com/saswata26/misc/master/base.stl" :scaling="[0.02, 0.02, 0.02]" :position="[-2, 0, -0.5]"></Asset>
    <Entity :position="[0, 0, 5]">
      <Animation property="rotation.x" :duration="100">
        <Key frame="0%" :value="0"></Key>
        <Key frame="100%" :value="Math.PI * 2"></Key>
      </Animation>
      <Animation property="rotation.y" :duration="50" :end="Math.PI * 2"></Animation>
      <Animation property="rotation.z" :duration="50" :end="Math.PI * 2"></Animation>
      <PointLight diffuse="#FF0000"></PointLight>
      <template v-for="x in [0, 4, -4]">
        <template v-for="y in [0, 4, -4]">
          <Box v-for="z in [0, 4, -4]" :position="[x, y, z]" :key="`${x},${y},${z}`"></Box>
        </template>
      </template>
    </Entity>
    -->
  </Scene>
</section>
</template>

<script>
// var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.env", scene);
// scene.environmentTexture = hdrTexture;
export default {
  name: 'Donate',
  components: {
  },
  props: ['model', 'scale', 'position'],
  data () {
    return {
      environment: {
        mySkyBox: false,
        hgrFile: 'http://asdfsdfadsfcsd'
      },
      loading: true,
      box: null,
      sphere: null,
      time: performance.now(),
      frames: 0
    }
  },
  methods: {
    beforeRender () {
      this.time = performance.now()
    },
    onSphere (event) {
      console.log('onSphere', event)
      // the entity event includes entity reference
      this.sphere = event.entity
    },
    complete (event) {
      console.log('complete', event)
      console.log('box', this.box)
      console.log('sphere', this.sphere)
    }
  },
  computed: {
    scale1 () {
      const a = 2 + Math.cos(this.time * 0.00001)
      const b = 2 + Math.sin(this.time * 0.00001)
      return {
        box: [a, b, 1],
        sphere: [1.5, 1.5, 1.5]
      }
    }
  }
}
</script>

<style>
</style>
