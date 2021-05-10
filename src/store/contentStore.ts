
const contentStore = {
  namespaced: true,
  state: {
    content: {
      artists: [],
      charities: [],
      mainFooter: null,
      information: null,
      navigation: null,
      homepage: null,
      about: null,
      tooltips: null,
      howItWorks: null
    },
    defaultArtist: 'chemicalx',
    waitingImage: 'https://images.prismic.io/radsoc/f60d92d0-f733-46e2-9cb7-c59e33a15fc1_download.jpeg?auto=compress,format'
  },
  getters: {
    getWaitingCSS: state => imageUrl => {
      if (!imageUrl) imageUrl = state.waitingImage
      return {
        'min-height': '300px',
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        '-webkit-background-size': 'contain',
        '-moz-background-size': 'contain',
        '-o-background-size': 'contain',
        'background-size': 'contain',
        'background-image': `url(${imageUrl})`,
        opacity: 1,
        'text-align': 'center',
        border: '1pt solid #ccc'
      }
    },
    getCharityByArtistId: state => id => {
      try {
        const charity = state.content.charities.find((o) => o.data.artist_id[0].text === id)
        if (!charity) return state.content.charities[0]
        return charity
      } catch (err) {
        return state.content.charities[0]
      }
    },
    getPixelBackground: state => {
      if (!state.content.homepage) return
      return state.content.homepage.pixelbackground.url
    },
    getBreakLine: state => {
      if (!state.content.homepage) return
      return state.content.homepage.breakline.url
    },
    getTooltip: state => tooltipId => {
      if (!state.content.tooltips || !state.content.tooltips[tooltipId]) return
      return state.content.tooltips[tooltipId]
    },
    getTransactionDialogMessage: (state, getters) => data => {
      let dKey = data.dKey
      if (data.dKey === 'stx-transaction-finished') dKey = 'tx-success'
      else if (data.dKey === 'stx-transaction-error') dKey = 'tx-failed'
      else if (data.dKey === 'stx-transaction-sent') dKey = 'tx-pending'
      const key = 'getDialog'
      const dialog = getters[key](dKey)
      if (!dialog || dialog.length < 3) return 'Dialog content missing for key: ' + data.dKey
      let msg = '<h1>' + dialog[0].text + '</h1>'
      msg += '<p class="my-5">' + dialog[1].text + '</p>'
      if (data.txId) msg += '<p><a href="https://explorer.stacks.co/txid/' + data.txId + '?chain=' + process.env.VUE_APP_NETWORK + '" target="_blank">' + dialog[2].text + '</p>'
      return msg
    },
    getDialog: state => dialogId => {
      if (!state.content.dialogs || !state.content.dialogs[dialogId]) return
      return state.content.dialogs[dialogId]
    },
    getCharities: state => {
      return state.content.charities
    },
    getArtists: state => {
      return state.content.artists
    },
    getArtistById: state => id => {
      return state.content.artists.find((o) => o.uid === id)
    },
    getInformationById: state => id => {
      return state.content.information.find((o) => o.uid === id)
    },
    getArtistId: state => artist => {
      try {
        return artist.toLowerCase().replace(/ /g, '')
      } catch (e) {
        return state.defaultArtist
      }
    },
    getHomepage: state => {
      return state.content.homepage
    },
    getAbout: state => {
      return state.content.about
    },
    getMainFooter: state => {
      return state.content.mainFooter
    },
    getNavbar: state => {
      return state.content.navigation
    },
    getHowItWorks: state => {
      return state.content.howItWorks
    }
  },
  mutations: {
    addTooltips (state, o) {
      state.content.tooltips = o
    },
    addDialogs (state, o) {
      state.content.dialogs = o
    },
    addHomeContent (state, o) {
      state.content.homepage = o
    },
    addAboutContent (state, o) {
      state.content.about = o
    },
    addMainFooter (state, o) {
      state.content.mainFooter = o
    },
    addNavigationContent (state, o) {
      state.content.navigation = o
    },
    addCharities (state, o) {
      state.content.charities = o
    },
    addInformation (state, o) {
      state.content.information = o
    },
    addArtists (state, o) {
      state.content.artists = o
    }
  },
  actions: {
  }
}
export default contentStore
