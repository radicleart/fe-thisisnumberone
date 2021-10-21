/**
 * This store represents the state of the (session scoped) data in the Vue
 * application. This is the data the Vue components can access reactively
 * to present to users. The Vuex Store has a modular composition and the store
 * modules hand off to services to interface with permanent data storage.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import assetGeneralStore from './assetGeneralStore'
import contentStore from './contentStore'
import publicItemsStore from './publicItemsStore'

Vue.use(Vuex)

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API
const APPLICATION_ID = process.env.VUE_APP_SQUARE_APPLICATION_ID
const LOCATION_ID = process.env.VUE_APP_SQUARE_LOCATION_ID
const SQUARE_URL = process.env.VUE_APP_VUE_APP_SQUARE_URL
const ETH_PAYMENT_ADDRESS = process.env.VUE_APP_ETH_PAYMENT_ADDRESS
const STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_MINT_FUNCTION = process.env.VUE_APP_STACKS_MINT_FUNCTION
const ETH_CONTRACT_ADDRESS = process.env.VUE_APP_NFT_CONTRACT_ADDRESS
const RISIDIO_WALLET_MAC = process.env.VUE_APP_WALLET_MAC
const RISIDIO_WALLET_SKY = process.env.VUE_APP_WALLET_SKY
const RISIDIO_STACKS_API = process.env.VUE_APP_STACKS_API

const selling = {
}
const marketConfig = {
  oneLayout: true,
  searchMenu: false,
  sideMenu: false
}
/**
const beneficiariesDefault = [
  {
    username: 'jim',
    role: 'Jim',
    email: 'jim@thisisnumberone.com',
    royalty: 25,
    chainAddress: 'SP162D87CY84QVVCMJKNKGHC7GGXFGA0TAR9D0XJW'
  },
  {
    username: 'dash.id',
    role: 'dash',
    email: 'dash@thisisnumberone.com',
    royalty: 25,
    chainAddress: 'SP1CS4FVXC59S65C3X1J3XRNZGWTG212JT7CG73AG'
  },
  {
    username: 'marc.id',
    role: 'marc',
    email: 'marc@thisisnumberone.com',
    royalty: 25,
    chainAddress: 'SPZRAE52H2NC2MDBEV8W99RFVPK8Q9BW8H88XV9N'
  },
  {
    username: 'mijoco.id',
    role: 'mijoco',
    email: 'mijoco@thisisnumberone.com',
    royalty: 25,
    chainAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6'
  }
]
**/
const beneficiariesDefault = [
  {
    type: 'sale',
    username: 'owner.id',
    role: 'Seller',
    royalty: 90,
    secondaryRoyalty: 90, // note the owner is worked out runtime in secondaries
    chainAddress: null
  },
  {
    type: 'sale',
    username: 'artist',
    role: 'Artist',
    email: 'info@thisisnumberone.com',
    royalty: 9,
    secondaryRoyalty: 9,
    chainAddress: 'SP1CS4FVXC59S65C3X1J3XRNZGWTG212JT7CG73AG'
  },
  {
    type: 'sale',
    username: 'Platform.id',
    role: 'Platform',
    email: 'info@brightblock.org',
    royalty: 1,
    secondaryRoyalty: 1,
    chainAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6'
  }
]
const beneficiariesMint = [
  {
    type: 'mint',
    username: 'Artist',
    role: 'Artist',
    royalty: 95,
    chainAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6'
  },
  {
    type: 'mint',
    username: 'Platform',
    role: 'Platform',
    royalty: 5,
    chainAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6'
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
  beneficiaries: beneficiariesDefault,
  beneficiariesMint: beneficiariesMint
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

const gaiaAsset = {
  saleData: {}
}
const appDetails = {
  name: 'ThisIsNumberOne - NFTs on Bitcoin',
  icon: origin + '/img/logo/logo.png'
}

const setup = function (data) {
  if (!data.asset) data.asset = {}
  let risidioCardMode = 'marketplace-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const NETWORK = process.env.VUE_APP_NETWORK
  // let beneficiaries = []
  const risidioBaseApi = RISIDIO_API_PATH
  const configuration = {
    lookAndFeel: lookAndFeel,
    appDetails: appDetails,
    gaiaAppDomains: ['localhost:8080', 'localhost:8081', 'localhost:8082'],
    gaiaAsset: (data.asset) ? data.asset : gaiaAsset,
    payment: payment,
    marketConfig: marketConfig,
    selling: selling,
    minter: minter,
    network: NETWORK,
    risidioProjectId: STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
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
    publicItemsStore
  },
  state: {
    configuration: setup({}),
    displayCard: 100,
    webWalletNeeded: false,
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    modalMessage: 'Your request is being processed',
    stacksPath: 'extended/v1/tx/',
    chromeLink: 'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    firefoxLink: 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/',
    separator: '/'
  },
  getters: {
    getDisplayCard: (state) => {
      return state.displayCard
    },
    getWebWalletLinkChrome: state => {
      return state.chromeLink
    },
    getWebWalletNeeded: state => {
      return state.webWalletNeeded
    },
    getWebWalletLinkFirefox: state => {
      return state.firefoxLink
    },
    getRpayConfiguration: state => {
      return state.configuration
    },
    getInnerWidth: state => {
      return (state.windims.innerWidth)
    },
    getModalMessage: state => {
      return state.modalMessage
    },
    getTrackingUrl: state => txId => {
      return RISIDIO_STACKS_API + state.stacksPath + txId
    },
    getSectionHeight: state => {
      return (state.windims.innerHeight)
    },
    getStacksMateUrl: state => profile => {
      const redirect = '?stxAddress=' + profile.stxAddress + '&redirectUrl=' + location.origin
      return process.env.VUE_APP_STACKS_MATE_URL + state.separator + redirect
    }
  },
  mutations: {
    setDisplayCard (state, val) {
      if (val !== 100 && val !== 102 && val !== 104 && val !== 106) {
        val = 100
      }
      if (val === 100) {
        if (!state.configuration.payment.allowMultiples) {
          val = 102
        }
      }
      state.displayCard = val
    },
    setRpayFlow (state, data) {
      state.configuration = setup(data)
    },
    setWebWalletNeeded (state) {
      state.webWalletNeeded = true
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
        dispatch('rpayAuthStore/fetchMyAccount').then(profile => {
          dispatch('rpayStacksContractStore/fetchFullRegistry')
          if (profile.loggedIn) {
            const data = { stxAddress: 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG', mine: true }
            if (process.env.VUE_APP_NETWORK !== 'local') {
              data.stxAddress = profile.stxAddress
            }
            dispatch('rpayCategoryStore/fetchLoopRuns')
            dispatch('rpayCategoryStore/fetchLatestLoopRunForStxAddress', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN, stxAddress: profile.stxAddress }, { root: true })
            dispatch('rpayStacksContractStore/fetchAssetsByOwner', data).then(() => {
              dispatch('rpayMyItemStore/initSchema').then(rootFile => {
                dispatch('rpayAuthStore/fetchAccountInfo', { stxAddress: profile.stxAddress, force: true })
                resolve(rootFile)
              })
            })
          } else {
            dispatch('rpayCategoryStore/fetchLatestLoopRunForAnon', { currentRunKey: process.env.VUE_APP_DEFAULT_LOOP_RUN }, { root: true })
            resolve(null)
          }
        })
      })
    }
  }
})
