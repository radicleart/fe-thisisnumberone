import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'
const NETWORK = process.env.VUE_APP_NETWORK
const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const sky = JSON.parse(process.env.VUE_APP_WALLET_SKY || '')

const assetGeneralStore = {
  namespaced: true,
  state: {
    emailData: [],
    buttonText: ['NOT FOR SALE', 'BUY NOW', 'PLACE BID', 'MAKE AN OFFER'],
    badgeText: ['NOT ON SALE', 'BUY NOW', 'ON AUCTION', 'OFFERS ONLY']
  },
  getters: {
    getRecipientAddress: (state, getters, rootState, rootGetters) => (owner) => {
      const myProfile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
      let recipient = myProfile.stxAddress
      if (NETWORK === 'local') {
        recipient = (owner === mac.keyInfo.address) ? sky.keyInfo.address : mac.keyInfo.address
      }
      return recipient
    },
    getSalesButtonLabel: state => saleType => {
      const saleLabel = (saleType) ? state.buttonText[saleType] : state.buttonText[0]
      return saleLabel
    },
    getSalesBadgeLabel: state => saleType => {
      const saleLabel = (saleType) ? state.badgeText[saleType] : state.badgeText[0]
      return saleLabel
    }
  },
  mutations: {
    addRegisteredEmail (state, data) {
      state.emailData.push(data)
    }
  },
  actions: {
    registerForUpdates ({ commit }, data: any) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/register/email', data).then((result) => {
          commit('addRegisteredEmail', data)
          resolve(result)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    }
  }
}
export default assetGeneralStore
