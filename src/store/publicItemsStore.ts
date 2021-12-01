import keywordService from '@/services/keywordService'
import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API

const publicItemsStore = {
  namespaced: true,
  state: {
  },
  getters: {
  },
  actions: {
    fetchKeywords () {
      return new Promise((resolve) => {
        resolve(keywordService.getFixedKeywords())
      })
    },
    fetchTraits ({ rootGetters }, edition) {
      return new Promise((resolve) => {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        const url = RISIDIO_API_PATH + '/mesh/v2/rarities/' + edition
        axios.get(url, authHeaders).then((response) => {
          resolve(response.data)
        }).catch(() => {
          resolve(null)
        })
      })
    }
  }
}
export default publicItemsStore
