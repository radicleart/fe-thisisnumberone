import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_API_SEARCH
const MESH_API_PATH = process.env.VUE_APP_API_MESH

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const searchIndexService = {
  addExchangeRates: function (rates: any) {
    return new Promise(function (resolve, reject) {
      axios.post(MESH_API_PATH + '/v1/rates/', rates).then((result) => {
        resolve(result.data)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  getExchangeRates: function () {
    return new Promise(function (resolve, reject) {
      axios.get(MESH_API_PATH + '/v1/rates/').then((result) => {
        resolve(result.data)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  removeRecord: function (field: string, value: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/removeRecord/' + field + '/' + value).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable unindex record: ' + error))
      })
    })
  },

  addRecords: function (application: any) {
    return new Promise(function (resolve, reject) {
      axios.post(SEARCH_API_PATH + '/v1/application', application).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  addTradeInfo: function (asset: any) {
    return new Promise(function (resolve, reject) {
      axios.post(SEARCH_API_PATH + '/v1/trade-info/' + asset.assetHash, asset.saleData).then((result) => {
        resolve(result.data)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  addRecord: function (asset: any) {
    return new Promise(function (resolve, reject) {
      const indexable: any = {}
      indexable.assetHash = asset.assetHash
      indexable.tokenId = asset.tokenId
      indexable.objType = asset.objType
      indexable.nftIndex = asset.nftIndex
      indexable.privacy = asset.privacy
      indexable.projectId = asset.projectId
      indexable.imageUrl = asset.imageUrl
      indexable.assetProjectUrl = asset.assetProjectUrl
      indexable.name = asset.name
      indexable.owner = asset.owner
      indexable.description = asset.description
      indexable.artist = asset.owner
      indexable.mintedOn = asset.mintedOn
      indexable.domain = location.hostname
      indexable.objType = 'artwork'
      if (asset.objType) {
        indexable.objType = asset.objType
      }
      indexable.metaData = asset.metaData
      if (!asset.category) {
        indexable.category = {
          id: 'zero',
          name: 'artwork',
          level: 1
        }
      } else {
        indexable.category = asset.category
      }
      indexable.saleData = {
        saleType: (asset.saleData) ? asset.saleData.saleType : 0,
        buyNowOrStartingPrice: (asset.saleData) ? asset.saleData.buyNowOrStartingPrice : 0,
        reservePrice: (asset.saleData) ? asset.saleData.reservePrice : 0,
        biddingEndTime: (asset.saleData) ? asset.saleData.biddingEndTime : 0,
        incrementPrice: (asset.saleData) ? asset.saleData.incrementPrice : 0
      }
      axios.post(SEARCH_API_PATH + '/addRecord', indexable).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  sizeOfIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/size').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  clearDappsIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/dapps/clear').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  clearNamesIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/clear').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  fetchAllNamesIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/fetch').then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  searchNamesIndex: function (term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/query/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findAssets: function (): Promise < any[] > {
    return new Promise(function (resolve, reject) {
      const url = SEARCH_API_PATH + '/findByObject/artwork'
      axios.get(url).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByOwner: function (owner: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByOwner' + '?q=' + owner).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findBySaleType: function (saleType: number) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findBySaleType/' + saleType).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByObject: function (objectType: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByObject/' + objectType).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByProjectId: function (projectId: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByProjectId' + '?q=' + projectId).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByDomainAndObjectTypeAndTitleOrDescriptionOrCategoryOrKeyword: function (domain: string, objType: string, term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByDomainAndObjectTypeAndTitleOrDescriptionOrCategoryOrKeyword/' + domain + '/' + objType + '/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findAssetByHash: function (assetHash: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/v1/asset/' + assetHash).then((asset: any) => {
        if (asset.nftIndex === 'null') asset.nftIndex = null
        if (asset.tokenId === 'null') asset.tokenId = null
        resolve(asset)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByTitleOrDescriptionOrCategoryOrKeyword: function (query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByTitleOrDescriptionOrCategoryOrKeyword/title' + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  countByDomainAndObjectTypeAndCategories: function (domain: string, objType: string, term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/countByDomainAndObjectTypeAndCategories/' + domain + '/' + objType + '/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  indexUsers: function (names: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/users/' + names).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  indexUser: function (bsId: string) {
    return searchIndexService.indexUsers(bsId)
  },
  indexPages: function (from: string, to: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/pages/' + from + '/' + to).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  remove: function (field: string, value: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/art/index/remove/' + field + '/' + value).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  }
}
export default searchIndexService
