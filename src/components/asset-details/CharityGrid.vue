<template>
<b-container class="center-section" style="min-height: 30vh;">
  <section v-if="content" :class="'theme-' + content.uid" fluid>
    <div class="d-flex justify-content-around">
      <div class="mx-3" v-for="(charity, index) in content" :key="index">
        <div v-scroll-to="{ element: '#asset-charity', duration: 1000 }" @click="assetCharity(charity)" style="cursor: pointer;">
          <img style="width: 100%;" :src="charity.data.image.url"/>
        </div>
        <p class="my-1 py-0 text-center text-small" style="font-size: 1.4rem">{{charity.data.charityname[0].text}}</p>
        <p class="my-0 py-0 text-center  text-small text-white" style="font-size: 1.4rem">{{charity.data.charityartist[0].text}}</p>
      </div>
    </div>
  </section>
</b-container>
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
.spaced-name--charity-grid {
  margin: -3.5rem 0 8rem -4rem;
  text-align: left;
  font-size: 15rem;
  color: #888888;
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

/* Spaced name responsive design */
@media only screen and (max-width: 1023px) {
  .spaced-name--charity-grid {
    font-size: 10rem;
  }
}
@media only screen and (max-width: 787px) {
  .spaced-name--charity-grid {
    font-size: 8rem;
  }
}
@media only screen and (max-width: 600px) {
  .spaced-name--charity-grid {
    font-size: 6rem;
  }
}
@media only screen and (max-width: 475px) {
  .spaced-name--charity-grid {
    font-size: 5rem;
    margin: -3rem 0 8rem -3rem;
  }
}
@media only screen and (max-width: 350px) {
  .spaced-name--charity-grid {
    font-size: 4rem;
  }
}
</style>
