/**
 * myItemStore represents the state of the data to the Vue components
 * it is session scoped store and hands off to myItemService to access
 * permanent storage.
 */
import searchIndexService from '@/services/searchIndexService'
import myItemService from '@/services/myItemService'
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import utils from '@/services/utils'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

const filterItems = function (state, rootGetters, filter) {
  const filteredRecords = []
  state.rootFile.records.forEach((o) => {
    const contractAsset = rootGetters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](o.assetHash)
    if (filter === 'minted') {
      if (contractAsset) {
        o.contractAsset = contractAsset
        filteredRecords.push(o)
      }
    } else if (filter === 'unminted') {
      if (!contractAsset) {
        filteredRecords.push(o)
      }
    }
  })
  return filteredRecords
}

const purchasedItems = function (rootGetters) {
  const purchasedRecords = []
  const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
  const contractId = STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME
  const myContractAssets = rootGetters[APP_CONSTANTS.KEY_ASSETS_BY_CONTRACT_ID_AND_OWNER]({ contractId: contractId, stxAddress: profile.stxAddress })
  if (myContractAssets) {
    myContractAssets.forEach((contractAsset) => {
      const gaiaAsset = rootGetters[APP_CONSTANTS.KEY_GAIA_ASSET_BY_HASH](contractAsset.tokenInfo.assetHash)
      if (gaiaAsset && contractAsset) {
        gaiaAsset.contractAsset = contractAsset
        purchasedRecords.push(gaiaAsset)
      }
    })
  }
  // note ownership (on-chain) can be changing hands as we speak!
  return purchasedRecords
}

const myItemStore = {
  namespaced: true,
  state: {
    rootFile: null,
    gaiaUrl: null,
    indexResult: null,
    mintedRecords: null,
    purchasedRecords: null,
    unmintedRecords: null
  },
  getters: {
    getMyItems: state => {
      return (state.rootFile) ? state.rootFile.records : []
    },
    getMyMintedItems: (state, getters, rootState, rootGetters) => {
      return filterItems(state, rootGetters, 'minted')
    },
    getMyUnmintedItems: (state, getters, rootState, rootGetters) => {
      return filterItems(state, rootGetters, 'unminted')
    },
    getMyPurchasedItems: (state, getters, rootState, rootGetters) => {
      return purchasedItems(rootGetters)
    },
    getItemParamValidity: state => (item, param) => {
      if (!state.rootFile) return
      if (param === 'artworkFile') {
        return ((item.attributes.artworkFile && item.attributes.artworkFile.fileUrl))
      } else if (param === 'artworkClip') {
        return ((item.attributes.artworkClip && item.attributes.artworkClip.fileUrl))
      } else if (param === 'coverImage') {
        return ((item.attributes.coverImage && item.attributes.coverImage.fileUrl))
      } else if (param === 'artist') {
        return (item.artist && item.artist.length > 2)
      } else if (param === 'name') {
        return (item.name && item.name.length > 2)
      } else if (param === 'keywords') {
        return (item.keywords && item.keywords.length > 0)
      } else if (param === 'editions') {
        return (item.editions > 0)
      } else if (param === 'coverArtist') {
        return (item.attributes.coverArtist && item.attributes.coverArtist.length > 1)
      }
      return true
    },
    getItemValidity: (state, getters) => item => {
      if (!state.rootFile || state.rootFile.records.length === 0) return false
      const invalidParams = []
      const myGetter = 'getItemParamValidity'
      if (!getters[myGetter](item, 'uploader')) invalidParams.push('uploader')
      if (!getters[myGetter](item, 'editions')) invalidParams.push('editions')
      if (!getters[myGetter](item, 'artist')) invalidParams.push('artist')
      if (!getters[myGetter](item, 'artworkFile')) invalidParams.push('artworkFile')
      if (!getters[myGetter](item, 'artworkClip')) invalidParams.push('artworkClip')
      if (!getters[myGetter](item, 'coverImage')) invalidParams.push('coverImage')
      if (!getters[myGetter](item, 'keywords')) invalidParams.push('keywords')
      return invalidParams
    },
    myItem: state => assetHash => {
      let item
      if (state.rootFile && assetHash) {
        item = state.rootFile.records.find(myItem => myItem.assetHash === assetHash)
      }
      return item
    }
  },
  mutations: {
    rootFile (state: any, rootFile: any) {
      state.rootFile = rootFile
    },
    indexResult (state: any, indexResult: any) {
      state.indexResult = indexResult
    },
    setMintTxId (state: any, item: any) {
      const index = state.rootFile.records.findIndex((o) => o.assetHash === item.assetHash)
      state.rootFile.records[index] = item
    }
  },
  actions: {
    initSchema ({ dispatch, state, rootGetters }, forced: boolean) {
      return new Promise((resolve) => {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        if (state.rootFile && !forced) {
          resolve(state.rootFile)
        } else {
          dispatch('fetchItems').then((rootFile: object) => {
            resolve(rootFile)
          }).catch(() => {
            myItemService.initItemSchema(profile)
          })
        }
      })
    },
    fetchItems ({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        myItemService.fetchMyItems(profile).then((rootFile: any) => {
          commit('rootFile', rootFile)
          resolve(rootFile)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    indexRootFile ({ state, commit }) {
      return new Promise((resolve) => {
        searchIndexService.indexRootFile(state.rootFile).then((result) => {
          commit('indexResult', result)
          resolve(result)
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    deleteItem ({ state, dispatch, rootGetters }, item) {
      return new Promise((resolve, reject) => {
        const contractAsset = rootGetters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](item.assetHash)
        if (contractAsset) {
          reject(new Error('Forbidden - item has been minted.'))
          return
        }
        const artworkFile = item.attributes.artworkFile
        if (artworkFile && artworkFile.storage === 'gaia') dispatch('deleteMediaItem', { id: 'artworkFile', item: item })
        const artworkClip = item.attributes.artworkClip
        if (artworkClip && artworkClip.storage === 'gaia') dispatch('deleteMediaItem', { id: 'artworkClip', item: item })
        const coverImage = item.attributes.coverImage
        if (coverImage && coverImage.storage === 'gaia') dispatch('deleteMediaItem', { id: 'coverImage', item: item })

        const index = state.rootFile.records.findIndex((o) => o.assetHash === item.assetHash)
        state.rootFile.records.splice(index, 1)

        myItemService.saveItem(state.rootFile).then((res) => {
          resolve(res)
        })
      })
    },
    deleteMediaItem ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        if (!data.item.assetHash) {
          reject(new Error('Unable to delete - unknown data...'))
          return
        }
        if (data.item.attributes[data.id].storage !== 'gaia') {
          data.item.attributes[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
          return
        }
        const lio = data.item.attributes[data.id].fileUrl.lastIndexOf('/')
        const coverImageFileName = data.item.attributes[data.id].fileUrl.substring(lio + 1)
        myItemService.deleteFile(coverImageFileName).then(() => {
          data.item.attributes[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
        }).catch(() => {
          data.item.attributes[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
        })
      })
    },
    findItemByAssetHash ({ state }, assetHash: string) {
      return new Promise((resolve) => {
        const index = state.rootFile.records.findIndex((o) => o.assetHash === assetHash)
        resolve(state.rootFile.records[index])
      })
    },
    saveAttributesObject ({ state }: any, data: any) {
      return new Promise((resolve, reject) => {
        if (!data.attributes.dataUrl) {
          // ok the file is stored externally - carry on..
          resolve(data.attributes)
          return
        }
        data.attributes.storage = 'gaia'
        const fileName = data.assetHash + '_' + data.attributes.id + utils.getFileExtension(data.attributes.fileUrl, data.attributes.type)
        myItemService.uploadFileData(fileName, data.attributes).then((gaiaUrl: string) => {
          state.gaiaUrl = gaiaUrl
          data.attributes.fileUrl = gaiaUrl
          resolve(data.attributes)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    saveItem ({ state, rootGetters, commit }: any, item: any) {
      return new Promise((resolve, reject) => {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        item.uploader = profile.username
        if (!item.owner) item.owner = profile.username
        // the item can be saved once there is an asset hash - all other fields can be added later..
        // e.g. || !item.attributes.musicFileUrl || !item.attributes.coverImage || !item.attributes.musicFile
        if (!profile.loggedIn || !item.assetHash) {
          reject(new Error('Unable to save your data...'))
          return
        }
        if (item.contractAsset) item.contractAsset = null
        if (typeof item.nftIndex === 'undefined') item.nftIndex = -1
        if (item.attributes && item.attributes.coverImage && item.attributes.coverImage.fileUrl) {
          const mintedUrl = encodeURI(item.attributes.coverImage.fileUrl)
          item.externalUrl = location.origin + '/display?asset=' + mintedUrl
          item.image = item.attributes.coverImage.fileUrl
        }
        item.projectId = STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME
        item.domain = location.hostname
        item.objType = 'artwork'
        item.updated = moment({}).valueOf()
        const index = state.rootFile.records.findIndex((o) => o.assetHash === item.assetHash)
        if (index < 0) {
          state.rootFile.records.splice(0, 0, item)
        } else {
          state.rootFile.records.splice(index, 1, item)
        }
        if (item.attributes.artworkClip && item.attributes.artworkClip.dataUrl) item.attributes.artworkClip.dataUrl = null
        if (item.attributes.artworkFile && item.attributes.artworkFile.dataUrl) item.attributes.artworkFile.dataUrl = null
        if (item.attributes.coverImage && item.attributes.coverImage.dataUrl) item.attributes.coverImage.dataUrl = null
        item.updated = moment({}).valueOf()
        if (!item.metaDataUrl && !profile.gaiaHubConfig) {
          throw new Error('profile needs to refresh - please reload current page..')
        }
        item.metaDataUrl = profile.gaiaHubConfig.url_prefix + profile.gaiaHubConfig.address + '/' + item.assetHash + '.json'
        myItemService.saveAsset(item).catch((error) => {
          console.log(error)
        })
        myItemService.saveItem(state.rootFile).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(item)
          if (!item.private) {
            searchIndexService.addRecord(item).catch((error) => {
              console.log(error)
            })
          }
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default myItemStore
