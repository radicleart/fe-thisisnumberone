<template>
<section v-if="content" :class="'theme-' + content.uid">
  <b-container fluid class="center-section">
    <b-row align-h="center" class="text-center">
      <b-col v-for="(charity, index) in content" :key="index" class="mx-3" style="max-width: 250px;">
        <div>
          <div v-scroll-to="{ element: '#asset-charity', duration: 1000 }" @click="assetCharity(charity)" style="cursor: pointer;">
            <img style="min-width: 250px; height: 250px;" :src="charity.data.image.url"/>
          </div>
          <p class="my-1 py-0 text-center text-small" style="font-size: 1.4rem">{{charity.data.charityname[0].text}}</p>
          <p class="my-0 py-0 text-center  text-small text-white" style="font-size: 1.4rem">{{charity.data.charityartist[0].text}}</p>
        </div>
        <div v-if="index === 3" class="w-100"></div>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CharityGrid',
  components: {
  },
  data: function () {
    return {
    }
  },
  methods: {
    getCols: function () {
      if (window.innerWidth > 1100) {
        return 12
      } else {
        return 6
      }
    },
    assetCharity: function (charity) {
      const artistId = charity.data.artist_id[0].text
      const resultSet = this.$store.getters[APP_CONSTANTS.KEY_ASSETS_BY_CONTRACT_ID]()
      const artistAssets = resultSet.filter((o) => {
        const oArtistId = o.artist.toLowerCase().replace(/ /g, '')
        if (oArtistId === artistId) {
          return o
        }
      })
      if (!artistAssets || artistAssets.length === 0) return '#'
      this.$router.push('/assets/' + artistAssets[0].assetHash + '#asset-charity')
    }
  },
  computed: {
    content () {
      const content = this.$store.getters[APP_CONSTANTS.KEY_CONTENT_CHARITIES]
      return content
    }
  }
}
</script>

<style scoped>
/* General style */
.theme-chemicalx {
  background-color: #C92E11;
  color: #fff;
}
.title-text {
  font-weight: normal;
  font-size: 1.6rem;
}
p {
  display: inline-block;
  max-width: 333px;
  width: 100%;
  margin: 20px 0 40px;
  font-size: 25px;
  color: #000;
}

/* Images style */
.image-background {
  background: #000;
  display: table;
  width: 100%;
  height: 100%;
  position: relative;
  max-height: 333px;
  max-width: 333px;
}

.image-container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
}

img {
  display: block;
  max-height: 100%;
  max-width: 100%;
  margin: auto;
}
</style>
