/**
 * myItemStore represents the state of the data to the Vue components
 * it is session scoped store and hands off to myItemService to access
 * permanent storage.
 */
import searchIndexService from '@/services/searchIndexService'
import myItemService from '@/services/myItemService'
import { APP_CONSTANTS } from '@/app-constants'
import store from '@/store'
import moment from 'moment'
import utils from '@/services/utils'

const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

const myItemStore = {
  namespaced: true,
  state: {
    rootFile: null,
    gaiaUrl: null,
    indexResult: null
  },
  getters: {
    getMyItems: state => {
      return (state.rootFile) ? state.rootFile.records : []
    },
    getItemParamValidity: state => (item, param) => {
      if (!state.rootFile) return
      if (param === 'artworkFile') {
        return ((item.nftMedia.artworkFile && item.nftMedia.artworkFile.fileUrl))
      } else if (param === 'artworkClip') {
        return ((item.nftMedia.artworkClip && item.nftMedia.artworkClip.fileUrl))
      } else if (param === 'coverImage') {
        return ((item.nftMedia.coverImage && item.nftMedia.coverImage.fileUrl))
      } else if (param === 'artist') {
        return (item.artist && item.artist.length > 2)
      } else if (param === 'name') {
        return (item.name && item.name.length > 2)
      } else if (param === 'keywords') {
        return (item.keywords && item.keywords.length > 0)
      } else if (param === 'editions') {
        return (item.editions > 0)
      } else if (param === 'coverArtist') {
        return (item.nftMedia.coverArtist && item.nftMedia.coverArtist.length > 1)
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
    initSchema ({ state, commit, rootGetters }, forced: boolean) {
      return new Promise((resolve) => {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        if (state.rootFile && !forced) {
          resolve(state.rootFile)
        } else {
          myItemService.fetchMyItems(profile).then((rootFile: object) => {
            commit('rootFile', rootFile)
            resolve(rootFile)
          }).catch(() => {
            myItemService.initItemSchema(profile).then((rootFile: object) => {
              commit('rootFile', rootFile)
              resolve(rootFile)
            })
          })
        }
      })
    },
    deleteItem ({ state, dispatch, rootGetters }, item) {
      return new Promise((resolve, reject) => {
        const contractAsset = rootGetters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](item.assetHash)
        if (contractAsset) {
          reject(new Error('Forbidden - item has been minted.'))
          return
        }
        const artworkFile = item.nftMedia.artworkFile
        if (artworkFile && artworkFile.storage === 'gaia') dispatch('deleteMediaItem', { id: 'artworkFile', item: item })
        const artworkClip = item.nftMedia.artworkClip
        if (artworkClip && artworkClip.storage === 'gaia') dispatch('deleteMediaItem', { id: 'artworkClip', item: item })
        const coverImage = item.nftMedia.coverImage
        if (coverImage && coverImage.storage === 'gaia') dispatch('deleteMediaItem', { id: 'coverImage', item: item })

        const index = state.rootFile.records.findIndex((o) => o.assetHash === item.assetHash)
        state.rootFile.records.splice(index, 1)

        console.log(state.rootFile.records)
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
        if (data.item.nftMedia[data.id].storage !== 'gaia') {
          data.item.nftMedia[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
          return
        }
        const lio = data.item.nftMedia[data.id].fileUrl.lastIndexOf('/')
        const coverImageFileName = data.item.nftMedia[data.id].fileUrl.substring(lio + 1)
        myItemService.deleteFile(coverImageFileName).then(() => {
          data.item.nftMedia[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
        }).catch(() => {
          data.item.nftMedia[data.id] = null
          dispatch('saveItem', data.item).then((item) => {
            resolve(item)
          })
        })
      })
    },
    fetchItems ({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        myItemService.fetchMyItems(profile).then((rootFile: any) => {
          commit('rootFile', rootFile)
          resolve(rootFile.records)
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
        /**
        state.rootFile.records.forEach((record) => {
          searchIndexService.addRecord(record).then((result) => {
            commit('indexResult', result)
            resolve(result)
          }).catch((error) => {
            console.log(error)
          })
        })
        **/
      })
    },
    findItemByAssetHash ({ state }, assetHash: string) {
      return new Promise((resolve) => {
        const index = state.rootFile.records.findIndex((o) => o.assetHash === assetHash)
        resolve(state.rootFile.records[index])
      })
    },
    saveNftMediaObject ({ state }: any, data: any) {
      return new Promise((resolve, reject) => {
        if (!data.nftMedia.dataUrl) {
          // ok the file is stored externally - carry on..
          resolve(data.nftMedia)
        }
        data.nftMedia.storage = 'gaia'
        const fileName = data.assetHash + '_' + data.nftMedia.id + utils.getFileExtension(data.nftMedia.fileUrl, data.nftMedia.type)
        myItemService.uploadFileData(fileName, data.nftMedia).then((gaiaUrl: string) => {
          state.gaiaUrl = gaiaUrl
          data.nftMedia.fileUrl = gaiaUrl
          resolve(data.nftMedia)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    saveItem ({ state, commit }: any, item: any) {
      return new Promise((resolve, reject) => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        item.uploader = profile.username
        if (!item.owner) item.owner = profile.username
        // the item can be saved once there is an asset hash - all other fields can be added later..
        // e.g. || !item.nftMedia.musicFileUrl || !item.nftMedia.coverImage || !item.nftMedia.musicFile
        if (!profile.loggedIn || !item.assetHash) {
          reject(new Error('Unable to save your data...'))
          return
        }
        if (typeof item.nftIndex === 'undefined') item.nftIndex = -1
        if (item.nftMedia && item.nftMedia.coverImage && item.nftMedia.coverImage.fileUrl) {
          const mintedUrl = encodeURI(item.nftMedia.coverImage.fileUrl)
          item.externalUrl = location.origin + '/display?asset=' + mintedUrl
          item.imageUrl = item.nftMedia.coverImage.fileUrl
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
        if (item.nftMedia.artworkClip && item.nftMedia.artworkClip.dataUrl) item.nftMedia.artworkClip.dataUrl = null
        if (item.nftMedia.artworkFile && item.nftMedia.artworkFile.dataUrl) item.nftMedia.artworkFile.dataUrl = null
        if (item.nftMedia.coverImage && item.nftMedia.coverImage.dataUrl) item.nftMedia.coverImage.dataUrl = null
        myItemService.saveItem(state.rootFile).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(item)
          if (!item.private) {
            searchIndexService.addRecord(item).then((result) => {
              console.log(result)
            }).catch((error) => {
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
