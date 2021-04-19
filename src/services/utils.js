import crypto from 'crypto'
import dataUriToBuffer from 'data-uri-to-buffer'
import {
  hexToCV
} from '@stacks/transactions'
import { c32address } from 'c32check'

const precision = 1000000
const NETWORK = process.env.VUE_APP_NETWORK

const utils = {
  buildHash: function (hashable) {
    return crypto.createHash('sha256').update(hashable).digest('hex')
  },
  getFileExtension: function (filename, type) {
    if (filename && filename.lastIndexOf('.') > 0) {
      const index = filename.lastIndexOf('.')
      return filename.substring(index)
    } else {
      const index = type.lastIndexOf('/') + 1
      return '.' + type.substring(index)
    }
  },
  getFileNameNoExtension: function (filename) {
    const index = filename.lastIndexOf('.')
    return filename.substring(0, index)
  },
  copyAddress: function (document, flasher, target) {
    const tempInput = document.createElement('input')
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px'
    tempInput.value = target
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
    flasher.classList.add('flasher')
    setTimeout(function () {
      flasher.classList.remove('flasher')
    }, 1000)
  },
  makeFlasher: function (flasher) {
    flasher.classList.add('flasher')
    setTimeout(function () {
      flasher.classList.remove('flasher')
      setTimeout(function () {
        flasher.classList.add('flasher')
        setTimeout(function () {
          flasher.classList.remove('flasher')
          setTimeout(function () {
            flasher.classList.add('flasher')
            setTimeout(function () {
              flasher.classList.remove('flasher')
            }, 300)
          }, 300)
        }, 300)
      }, 300)
    }, 300)
  },
  convertAddress: function (b160Address) {
    let version = 26
    if (NETWORK === 'mainnet') version = 22
    const address = c32address(version, b160Address) // 22 for mainnet
    return address
  },
  fromMicroAmount: function (amountMicroStx) {
    try {
      if (amountMicroStx === 0) return 0
      const val = Math.round(amountMicroStx) / (precision)
      return val
    } catch {
      return 0
    }
  },
  /**
  fromOnChainAmount: function (amountMicroStx) {
    try {
      amountMicroStx = parseInt(amountMicroStx, 16)
      if (typeof amountMicroStx === 'string') {
        amountMicroStx = Number(amountMicroStx)
      }
      if (amountMicroStx === 0) return 0
      amountMicroStx = amountMicroStx / precision
      return Math.round(amountMicroStx * precision) / precision
    } catch {
      return 0
    }
  },
  **/
  toOnChainAmount: function (amount) {
    try {
      amount = amount * precision
      return Math.round(amount * precision) / precision
    } catch {
      return 0
    }
  },
  audioToBase64: function (audioFile) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest()
      request.open('GET', audioFile, true)
      request.responseType = 'blob'
      request.onload = function () {
        const reader = new FileReader()
        reader.readAsDataURL(request.response)
        reader.onload = function (e) {
          resolve(e.target.result)
        }
      }
      request.send()
    })
  },
  fetchBase64FromImageUrl: function (url, document) {
    return new Promise((resolve) => {
      const img = new File()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(this, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        const mimeType = dataURL.substring(dataURL.indexOf(':') + 1, dataURL.indexOf(';')) // => image/png
        const imageBuffer = dataUriToBuffer(dataURL)
        resolve({ dataURL: dataURL, imageBuffer: imageBuffer, mimeType: mimeType })
      }
      img.src = url
    })
  },
  readFileFromUrlToDataURL: function (url) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.responseType = 'blob'
      request.onload = function () {
        const reader = new FileReader()
        reader.readAsDataURL(request.response)
        const file = {
          size: request.response.size,
          type: request.response.type
        }
        reader.onload = function (e) {
          file.dataUrl = e.target.result
          resolve(file)
        }
      }
      request.send()
    })
  },
  getBase64FromImageUrl: function (dataURL) {
    const imageBuffer = dataUriToBuffer(dataURL)
    // const rawImage = dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
    const mimeType = dataURL.substring(dataURL.indexOf(':') + 1, dataURL.indexOf(';')) // => image/png
    return { imageBuffer: imageBuffer, mimeType: mimeType }
  },
  stringToHex: function (str) {
    const arr = []
    for (let i = 0; i < str.length; i++) {
      arr[i] = (str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '0x' + arr.join('')
  },
  fromHex: function (method, rawResponse) {
    const td = new TextDecoder('utf-8')
    const res = hexToCV(rawResponse)
    if (rawResponse.startsWith('0x08')) {
      throw new Error('Blockchain call returned not okay with error code: ' + res.value.value.toNumber())
    }
    if (method === 'get-mint-price') {
      return res.value.value.toNumber()
    } else if (method === 'get-token-by-hash') {
      return res.value.value.toNumber()
    } else if (method === 'get-mint-counter') {
      return res.value.value.toNumber()
    } else if (method === 'get-app-counter') {
      return res.value.value.toNumber()
    } else if (method === 'get-app') {
      return {
        // owner: td.decode(res.value.data.owner.buffer),
        contractId: td.decode(res.value.data['app-contract-id'].buffer),
        gaiaRootPath: td.decode(res.value.data['gaia-root-path'].buffer),
        status: res.value.data.status.value.toNumber(),
        storageModel: res.value.data['storage-model'].value.toNumber()
      }
    } else if (method === 'get-token-by-index') {
      const clarityAsset = {}
      if (res.value.data.owner) {
        clarityAsset.owner = res.value.data.owner.address.hash160
      }
      if (res.value.data['sale-data']) {
        const saleData = res.value.data['sale-data']
        if (saleData.value) {
          const saleData = {}
          saleData.biddingEndTime = saleData.value.data['bidding-end-time'].value.toNumber()
          saleData.incrementPrice = this.fromMicroAmount(saleData.value.data['increment-stx'].value.toNumber())
          saleData.reservePrice = this.fromMicroAmount(saleData.value.data['reserve-stx'].value.toNumber())
          saleData.buyNowOrStartingPrice = this.fromMicroAmount(saleData.value.data['amount-stx'].value.toNumber())
          saleData.saleType = saleData.value.data['sale-type'].value.toNumber()
          clarityAsset.saleData = saleData
        }
      }
      if (res.value.data['token-info']) {
        clarityAsset.assetHash = res.value.data['token-info'].value.data['asset-hash'].buffer.toString('hex')
        clarityAsset.date = res.value.data['token-info'].value.data.date.value.toNumber()
      }
      if (res.value.data['transfer-count']) {
        clarityAsset.transferCount = res.value.data['transfer-count'].value.toNumber()
      }
      return clarityAsset
    } else if (method === 'get-sale-data') {
      return {
        biddingEndTime: res.value.data['bidding-end-time'].value.toNumber(),
        incrementPrice: this.fromMicroAmount(res.value.data['increment-stx'].value.toNumber()),
        reservePrice: this.fromMicroAmount(res.value.data['reserve-stx'].value.toNumber()),
        auctionId: this.fromMicroAmount(res.value.data['auction-id'].value.toNumber()),
        buyNowOrStartingPrice: this.fromMicroAmount(res.value.data['amount-stx'].value.toNumber()),
        saleType: res.value.data['sale-type'].value.toNumber()
      }
    } else if (method === 'get-base-token-uri') {
      return td.decode(res.buffer)
    }
  }
}
export default utils
