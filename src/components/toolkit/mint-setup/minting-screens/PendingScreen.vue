<template>
<b-card-group class="">
  <b-card header-tag="header" footer-tag="footer" class="rpay-card">
    <b-card-text class="mx-4 text-center border-bottom">
      <div>
        <img width="100%" src="https://images.prismic.io/risidio-journal/c824b73a-908b-402d-8ee9-b21c297e734e_vector-creator+%288%29%402x.png?auto=compress,format"/>
      </div>
      <div class="">
        <div class="mb-auto">
          <div class="text-danger mb-3 text-bold" v-html="getPendingMessage"></div>
        </div>
      </div>
    </b-card-text>
    <template v-slot:footer>
      <div class="">
        <div>
          <div class="bg-dark p-3 d-flex justify-content-between">
            <b-button variant="outline-primary" @click="backData()">Back</b-button>
         </div>
        </div>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SquareButton from '@/components/utils/SquareButton'

export default {
  name: 'PendingScreen',
  components: {
    SquareButton
  },
  data () {
    return {
      pendingMessage: 'Minting token - please sit tight',
      errorMessage: null,
      mintedMessage: null
    }
  },
  methods: {
    backData: function () {
      this.$store.commit('rpayStore/setDisplayCard', 100)
    }
  },
  computed: {
    getPendingMessage () {
      const message = 'Minting on Stacks network can take some time - please keep this tab open so we can moniter progress.'
      // const mintingObject = this.$store.getters[APP_CONSTANTS.KEY_MINTING_MESSAGE]
      // if (mintingObject && mintingObject.message) {
      //  message = mintingObject.message
      // }
      return message
    },
    displayCard () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      return displayCard
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
