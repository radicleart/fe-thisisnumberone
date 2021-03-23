import searchIndexService from '@/services/searchIndexService'
import keywordService from '@/services/keywordService'

const publicItemsStore = {
  namespaced: true,
  state: {
    details: null
  },
  getters: {
    getPublicItems: state => {
      return (state.details) ? state.details : []
    }
  },
  actions: {
    fetchPublicItems () {
      return new Promise((resolve, reject) => {
        searchIndexService.fetchAllNamesIndex().then((details) => {
          resolve(details)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchKeywords () {
      return new Promise((resolve) => {
        resolve(keywordService.getFixedKeywords())
      })
    }
  }
}
export default publicItemsStore
