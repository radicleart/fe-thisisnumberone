<template>
 <div class="d-flex justify-content-center">
    <b-card-group>
      <b-card header-tag="header" footer-tag="footer" :style="cardDimensions()">
        <b-card-text style="height: 35vh;">
          <div class="mt-5">
            <loopbomb-spinner />
          </div>
        </b-card-text>
        <b-card-text style="height: 30vh;">
          <span v-html="myLoadingMessage"></span>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'

export default {
  name: 'LoadingView',
  components: {
    LoopbombSpinner
  },
  props: ['message'],
  data () {
    return {
      lm: 'Loading resources from your storage - nearly done..'
    }
  },
  computed: {
    myLoadingMessage: function () {
      if (this.message) {
        return this.message
      }
      return this.lm
    }
  },
  methods: {
    cardDimensions () {
      const cardDims = this.$store.getters['loopStore/getCardDimensionsBC']
      return cardDims
    }
  }
}
</script>

<style scoped>
</style>
