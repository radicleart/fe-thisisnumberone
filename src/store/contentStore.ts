const contentStore = {
  namespaced: true,
  state: {
    content: {
      artists: [],
      charities: [],
      mainFooter: null,
      navigation: null,
      homepage: null,
      about: null,
      tooltips: null,
      howItWorks: null
    },
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
    getCharityById: state => id => {
      return state.content.charities.find((o) => o.uid === id)
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
    getCharities: state => {
      return state.content.charities
    },
    getArtists: state => {
      return state.content.artists
    },
    getArtistById: state => id => {
      return state.content.artists.find((o) => o.uid === id)
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
    addArtists (state, o) {
      state.content.artists = o
    }
  },
  actions: {
  }
}
export default contentStore
