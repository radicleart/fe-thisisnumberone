/**
 * myItemService stores and retrieves user data from backend storage
 * this implementation uses gaia but this could in theory be swapped with
 * centralised db without affecting the application.
 * Schema for the data stored by this service is in the PRD on confluence...
 * https://mijoco.atlassian.net/wiki/spaces/RP/pages/2182709258/PRD+Sticksnstones
 */
import { AppConfig, UserSession } from '@stacks/connect'
import { Storage } from '@stacks/storage'
import moment from 'moment'
import utils from '@/services/utils'

const ITEM_ROOT_PATH = process.env.VUE_APP_ITEM_ROOT_PATH

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const storage = new Storage({ userSession })

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    artistProfile: {},
    records: []
  }
  return newRootFile
}
const myItemService = {
  initItemSchema: function (profile) {
    return new Promise((resolve) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      const rootFile = getNewRootFile()
      storage.getFile(ITEM_ROOT_PATH, { decrypt: false }).then((file: string) => {
        if (!file) {
          storage.putFile(ITEM_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        storage.putFile(ITEM_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
        resolve(rootFile)
      })
    })
  },
  deleteItem: function (itemName) {
    storage.deleteFile(itemName).then(() => {
      window.location.reload()
    })
  },
  deleteFile: function (fileName) {
    return new Promise((resolve, reject) => {
      storage.deleteFile(fileName).then(() => {
        resolve(null)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  fetchUserItems: function (username) {
    return new Promise((resolve, reject) => {
      storage.getFile(ITEM_ROOT_PATH, { username: username, decrypt: false }).then((file: string) => {
        if (!file) {
          resolve(null)
        } else {
          const rootFile = JSON.parse(file)
          resolve(rootFile.projects)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  fetchMyItems: function (profile) {
    return new Promise((resolve, reject) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      storage.getFile(ITEM_ROOT_PATH, { decrypt: false }).then((file: string) => {
        if (!file) {
          const rootFile = getNewRootFile()
          storage.putFile(ITEM_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          const rootFile = JSON.parse(file)
          resolve(rootFile)
        }
      }).catch(() => {
        reject(new Error('Failed to fetch - logged in?'))
      })
    })
  },
  uploadFileData: function (filename, file) {
    return new Promise((resolve, reject) => {
      // const artwork = Buffer.from(imageData.imageBuffer).toString('base64') // imageDataURI.decode(dataUrl)
      const encodedFile = utils.getBase64FromImageUrl(file.dataUrl)
      const path = filename
      if (file.size >= 20971520) {
        reject(new Error('File exceeds Gaia file size limit of 20971520 bytes'))
      }
      const options = {
        contentType: file.type,
        encrypt: false,
        dangerouslyIgnoreEtag: true
      }
      storage.getFileUrl(path).then(() => {
        storage.putFile(path, encodedFile.imageBuffer, options).then(function () {
          storage.getFileUrl(path).then((gaiaUrl) => {
            resolve(gaiaUrl)
          }).catch((error) => {
            reject(new Error('Url not available: ' + error))
          })
        }).catch((error) => {
          reject(new Error('Uanble to put file: ' + error))
        })
        // if (gaiaUrl) {
        //  resolve(gaiaUrl)
        // } else {
        // }
      })
    })
  },
  saveItem: function (rootFile) {
    return new Promise((resolve) => {
      rootFile.updated = moment({}).valueOf()
      storage.getFile(ITEM_ROOT_PATH, { decrypt: false }).then((file: string) => {
        let rootFile2 = JSON.parse(file)
        rootFile2 = rootFile
        storage.putFile(ITEM_ROOT_PATH, JSON.stringify(rootFile2), { encrypt: false }).then(() => {
          resolve(rootFile2)
        }).catch(() => {
          // reject(error)
        })
      }).catch(() => {
        storage.putFile(ITEM_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false }).then(() => {
          resolve(rootFile)
        }).catch(() => {
          // reject(error)
        })
      })
    })
  },
  saveAsset: function (item) {
    return new Promise((resolve) => {
      storage.getFile(item.assetHash + '.json', { decrypt: false }).then((file: string) => {
        let item2 = JSON.parse(file)
        item2 = item
        storage.putFile(item.assetHash + '.json', JSON.stringify(item2), { encrypt: false }).then(() => {
          resolve(item)
        }).catch(() => {
          // reject(error)
        })
      }).catch(() => {
        storage.putFile(item.assetHash + '.json', JSON.stringify(item), { encrypt: false }).then(() => {
          resolve(item)
        }).catch(() => {
          // reject(error)
        })
      })
    })
  }
}
export default myItemService
