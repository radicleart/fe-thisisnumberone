/**
 * This store represents the state of the (session scoped) data in the Vue
 * application. This is the data the Vue components can access reactively
 * to present to users. The Vuex Store has a modular composition and the store
 * modules hand off to services to interface with permanent data storage.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import authStore from './authStore'
import myItemStore from './myItemStore'
import assetGeneralStore from './assetGeneralStore'
import contentStore from './contentStore'
import publicItemsStore from './publicItemsStore'

Vue.use(Vuex)

const APPLICATION_ID = process.env.VUE_APP_SQUARE_APPLICATION_ID
const LOCATION_ID = process.env.VUE_APP_SQUARE_LOCATION_ID
const SQUARE_URL = process.env.VUE_APP_VUE_APP_SQUARE_URL
const ETH_PAYMENT_ADDRESS = process.env.VUE_APP_ETH_PAYMENT_ADDRESS
const STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_MINT_FUNCTION = process.env.VUE_APP_STACKS_MINT_FUNCTION
const ETH_CONTRACT_ADDRESS = process.env.VUE_APP_NFT_CONTRACT_ADDRESS
const RISIDIO_STACKS_API = process.env.VUE_APP_API_STACKS
const RISIDIO_WALLET_MAC = process.env.VUE_APP_WALLET_MAC
const RISIDIO_WALLET_SKY = process.env.VUE_APP_WALLET_SKY

const setup = function (data) {
  if (!data.asset) data.asset = {}
  let risidioCardMode = 'payment-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const useNetwork = 'testnet'
  // let beneficiaries = []
  let risidioBaseApi = 'http://https://tapi.risidio.com'
  if (location.href.indexOf('https://one.risidio.com') > -1 || location.href.indexOf('https://test.loopbomb.com') > -1) {
    risidioBaseApi = 'https://tapi.risidio.com'
  } else if (location.href.indexOf('https://loopbomb.com') > -1) {
    risidioBaseApi = 'https://api.risidio.com'
  } else if (location.href.indexOf('localhost') > -1) {
    // beneficiaries = state.beneficiariesLocalhost
  }
  const lookAndFeel = {
    variant0: 'danger',
    variant1: 'warning',
    variant2: 'info',
    variant3: 'light',
    labels: {
      title: 'Mint Your Item',
      numberUnits: 'How many spins?',
      quantityLabel: 'Tokens'
    }
  }
  const selling = {
  }
  const marketConfig = {
    oneLayout: true,
    searchMenu: false,
    sideMenu: false,
    projectId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.thisisnumberone'
  }
  const beneficiariesDefault = [
    {
      username: 'donation.id',
      role: 'Charitable Donation',
      email: 'donation@thisisnumberone.com',
      royalty: 10,
      chainAddress: 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
    },
    {
      username: 'environment.id',
      role: 'Environment/Sustainabilty',
      email: 'environment@thisisnumberone.com',
      royalty: 5,
      chainAddress: 'STMYA5EANW6C0HNS1S57VX52M0B795HHFDBW2XBE'
    }
  ]
  const payment = {
    forceNew: false,
    amountFiat: 0.5,
    currency: 'GBP',
    paymentCode: 'po-12324',
    allowMultiples: true,
    stxPaymentAddress: STX_PAYMENT_ADDRESS,
    ethPaymentAddress: ETH_PAYMENT_ADDRESS,
    paymentOption: 'ethereum',
    paymentOptions: [
      { allowFiat: true },
      { allowBitcoin: true },
      { allowLightning: true },
      { allowStacks: true },
      { allowLSAT: false },
      { allowEthereum: true }
    ],
    creditAttributes: {
      start: 4,
      step: 2,
      min: 2,
      max: 20
    },
    squarePay: {
      applicationId: APPLICATION_ID,
      locationId: LOCATION_ID,
      squareUrl: SQUARE_URL
    }
  }
  const minter = {
    item: {
      gaiaUsername: data.asset.owner,
      assetHash: data.asset.assetHash,
      name: data.asset.name,
      imageUrl: data.asset.imageUrl
    },
    preferredNetwork: 'stacks risidio',
    networks: [
      {
        network: 'stacks risidio',
        functionName: STX_MINT_FUNCTION,
        enabled: true,
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME
      },
      {
        network: 'stacks connect',
        enabled: true,
        functionName: STX_MINT_FUNCTION,
        contractAddress: STX_CONTRACT_ADDRESS,
        contractName: STX_CONTRACT_NAME
      },
      {
        network: 'ethereum',
        enabled: true,
        functionName: 'mint-token',
        contractAddress: ETH_CONTRACT_ADDRESS
      }
    ],
    enableRoyalties: true,
    beneficiaries: beneficiariesDefault
  }
  const configuration = {
    lookAndFeel: lookAndFeel,
    payment: payment,
    marketConfig: marketConfig,
    selling: selling,
    minter: minter,
    network: useNetwork,
    risidioBaseApi: risidioBaseApi,
    risidioStacksApi: RISIDIO_STACKS_API,
    risidioWalletMac: RISIDIO_WALLET_MAC,
    risidioWalletSky: RISIDIO_WALLET_SKY,
    risidioCardMode: risidioCardMode
  }
  // window.risidioPaymentConfig = JSON.stringify(configuration)
  return configuration
}

export default new Vuex.Store({
  modules: {
    assetGeneralStore,
    contentStore,
    myItemStore,
    authStore,
    publicItemsStore
  },
  state: {
    configuration: setup({}),
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    modalMessage: 'Your request is being processed'
  },
  getters: {
    getRpayConfiguration: state => {
      return state.configuration
    },
    getInnerWidth: state => {
      return (state.windims.innerWidth)
    },
    getModalMessage: state => {
      return state.modalMessage
    }
  },
  mutations: {
    setRpayFlow (state, data) {
      state.configuration = setup(data)
    },
    setModalMessage (state, modalMessage) {
      state.modalMessage = modalMessage
    },
    setWinDims (state) {
      state.windims = {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight
      }
    }
  },
  actions: {
    initApplication ({ dispatch }) {
      return new Promise(resolve => {
        dispatch('authStore/fetchMyAccount').then(profile => {
          if (profile.loggedIn) {
            dispatch('myItemStore/initSchema').then(rootFile => {
              resolve(rootFile)
            })
          } else {
            resolve(null)
          }
        })
      })
    }
  }
})
