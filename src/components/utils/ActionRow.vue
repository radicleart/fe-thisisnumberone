<template>
  <b-row>
    <b-col cols="12">
      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <div class="mr-5" style="width: 70%; border-bottom: 1pt solid #000000;"></div>
          <div v-if="buttonLabel2" style="position: relative; top: 25px;">
            <modal-button :theme="'dark'" v-on="$listeners" :label1="buttonLabel2" :svgImage="icon" :usePixelBg="true"/>
          </div>
          <div style="position: relative; top: 25px;">
            <modal-button :theme="'dark'" v-on="$listeners" :label1="buttonLabel" :svgImage="icon" :usePixelBg="true"/>
          </div>
        </div>
      </div>
    </b-col>
    <b-col cols="12">
      <div class="text-small">Need help? <a class="inline-link" href="mailto:info@thisisnumberone.com">Email us</a></div>
    </b-col>
  </b-row>
</template>

<script>
import ModalButton from '@/components/utils/ModalButton'

export default {
  name: 'ActionRow',
  components: {
    ModalButton
  },
  props: ['buttonLabel', 'buttonLabel2'],
  data () {
    return {
      icon: require('@/assets/img/check-square.svg')
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
