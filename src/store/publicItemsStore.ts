import keywordService from '@/services/keywordService'

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
    }
  }
}
export default publicItemsStore
