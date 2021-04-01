<template>
<div>
<router-link :to="assetUrl">
  <div ref="lndQrcode" class="result-item0 mb-4 bg-light" :style="calcHeight()">
  </div>
</router-link>
<!-- {{created(result.created)}} / {{created(result.updated)}} -->
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import utils from '@/services/utils'
import Vue from 'vue'

export default {
  name: 'ResultItem',
  components: {
  },
  props: ['result'],
  data () {
    return {
      height: 300,
      likeIconTurquoise: require('@/assets/img/Favorite_button_turquoise_empty.png'),
      likeIconPurple: require('@/assets/img/Favorite_button_purple_empty.png')
    }
  },
  mounted () {
    Vue.nextTick(function () {
      const ele = this.$refs.lndQrcode
      let width = 300
      if (ele) {
        width = ele.clientWidth
      }
      this.height = width // this.$store.getters[APP_CONSTANTS.KEY_GALLERY_IMAGE_WIDTH](width)
    }, this)
  },
  methods: {
    hoverIn (index) {
      this.dHover[index] = true
      this.componentKey += 1
    },
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    toggleFavourite () {
      utils.makeFlasher(this.$refs.lndQrcode)
      this.$store.dispatch('projectStore/toggleFavourite', this.result).then((index) => {
        if (index < 0) {
          this.$notify({ type: 'info', title: 'Favourites', text: this.result.title + ' has been added to your favourites - you can access them in your account.' })
        } else {
          this.$notify({ type: 'info', title: 'Favourites', text: this.result.title + ' has been removed from your favourites.' })
        }
      })
    },
    calcHeight () {
      return {
        height: this.height + 'px',
        width: '100%',
        'background-repeat': 'no-repeat',
        'background-image': `url(${this.result.assetUrl})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover'
      }
    },
    truncateProjectId (projectId) {
      if (projectId.indexOf('.') > -1) {
        let addr = projectId.split('.')[0]
        addr = addr.substring(addr.length - 5)
        return addr + '.' + projectId.split('.')[1]
      }
      return projectId
    },
    truncateAssetHash (assetHash) {
      const addr = assetHash.substring(0, 4)
      return addr + '...' + assetHash.substring(assetHash.length - 4)
    },
    amIOwner () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.username === this.result.owner
    },
    owner (id) {
      return (id && id.indexOf('.') > -1) ? id.split('.')[0] : '?'
    },
    saleType () {
      if (this.result.tradeInfo && this.result.tradeInfo.saleType === 0) {
        return 'not selling'
      } else if (this.result.tradeInfo && this.result.tradeInfo.saleType === 1) {
        return 'buy now'
      } else if (this.result.tradeInfo && this.result.tradeInfo.saleType === 2) {
        return 'place bid'
      } else if (this.result.tradeInfo && this.result.tradeInfo.saleType === 3) {
        return 'make offer'
      }
    },
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    buyingPriceConversion () {
      const tradeInfo = this.$store.getters[APP_CONSTANTS.GET_TRADE_INFO_FROM_HASH](this.result.assetHash)
      const buyNowOrStartingPrice = tradeInfo.buyNowOrStartingPrice
      const rate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE](buyNowOrStartingPrice)
      return rate
    },
    buyingPrice () {
      const tradeInfo = this.$store.getters[APP_CONSTANTS.GET_TRADE_INFO_FROM_HASH](this.result.assetHash)
      return tradeInfo.buyNowOrStartingPrice
    },
    assetUrl () {
      let assetUrl = '/assets/' + this.result.assetHash
      if (this.$route.name === 'my-assets') {
        assetUrl = '/my-assets/' + this.result.assetHash
      }
      return assetUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.result-item {
  position: relative;
}
.flasher {
  width: 50px;
  height: 50px;
}
.result-item {
  /* ITEMS STYLE */

  & .result__item--overlay {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    cursor: pointer;
  }

  & .result__item--description {
    width: 100%;
    padding: 11px 18px;
    color: #fff;
    text-shadow: 0px 3px 6px #00000029;
    background: #50B1B5;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  & .result__item--overlay:hover .result__item--description {
    opacity: 0.95;
  }

  & .result__item--title {
    font-size: 1.4rem;
    font-weight: 400;
  }

  & .result__item--amount {
    font-size: 1.2rem;
    font-weight: 600;
  }

  & .result__item--by {
    font-size: 1rem;
    font-weight: 300;
  }

  & .result__item--artist {
    font-size: 1rem;
    font-weight: 700;
  }

  & .result__item--price {
    font-size: 0.9rem;
    font-weight: 400;
  }

  & .result__item--like-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 1.3rem;
    background-color: #50B1B5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
  & .result__item--my-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 13px;
    background-color: #9d50b5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
}
</style>
