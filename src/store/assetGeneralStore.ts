import axios from 'axios'

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'

const assetGeneralStore = {
  namespaced: true,
  state: {
    emailData: []
  },
  getters: {
  },
  mutations: {
    addRegisteredEmail (state, data) {
      state.emailData.push(data)
    }
  },
  actions: {
    registerOfferOffChain ({ commit }, data: any) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/register/offer', data).then(() => {
          commit('addOffer', data)
          resolve(data)
        }).catch((error) => {
          reject(new Error('Unable to register offer: ' + error))
        })
      })
    },
    registerForUpdates ({ commit }, data: any) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/register/email', data).then((result) => {
          commit('addRegisteredEmail', data)
          resolve(result)
        }).catch((error) => {
          reject(new Error('Unable to register email: ' + error))
        })
      })
    }
  }
}
export default assetGeneralStore
