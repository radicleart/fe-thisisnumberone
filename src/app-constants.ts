export const APP_CONSTANTS = {
  KEY_RPAY_CONFIGURATION: 'getRpayConfiguration',
  KEY_CONFIGURATION: 'getRpayConfiguration',
  SET_RPAY_FLOW: 'setRpayFlow',
  KEY_TRACKING_URL: 'getTrackingUrl',
  KEY_SECTION_HEIGHT: 'getSectionHeight',
  KEY_WEB_WALLET_NEEDED: 'getWebWalletNeeded',
  SET_WEB_WALLET_NEEDED: 'setWebWalletNeeded',
  KEY_WEB_WALLET_LINK_CHROME: 'getWebWalletLinkChrome',
  KEY_WEB_WALLET_LINK_FIREFOX: 'getWebWalletLinkFirefox',
  KEY_MODAL_MESSAGE: 'getModalMessage',

  KEY_CATEGORIES: 'rpayCategoryStore/getCategories',

  KEY_ALL_OFFERS_ON_ASSET: 'assetGeneralStore/getAllOffersForAsset',
  KEY_HIGHEST_OFFER_ON_ASSET: 'assetGeneralStore/getHighestOfferForAsset',

  KEY_HAS_PRIVILEGE: 'rpayPrivilegeStore/hasPrivilege',

  KEY_CONTENT_ABOUT: 'contentStore/getAbout',

  KEY_MY_ITEMS: 'rpayMyItemStore/getMyItems',
  KEY_MY_UNMINTED_ITEMS: 'rpayMyItemStore/getMyUnmintedItems',
  KEY_MY_MINTED_ITEMS: 'rpayMyItemStore/getMyMintedItems',
  KEY_MY_PURCHASED_ITEMS: 'rpayMyItemStore/getMyPurchasedItems',
  KEY_MY_ITEM: 'rpayMyItemStore/myItem',
  KEY_ITEM_VALIDITY: 'rpayMyItemStore/getItemValidity',

  KEY_BIDDING_CURRENT_BID: 'rpayPurchaseStore/getCurrentBid',
  KEY_BIDDING_NEXT_BID: 'rpayPurchaseStore/getNextBid',
  KEY_SALES_BUTTON_LABEL: 'rpayPurchaseStore/getSalesButtonLabel',
  KEY_SALES_BADGE_LABEL: 'rpayPurchaseStore/getSalesBadgeLabel',
  KEY_SALES_INFO_TEXT: 'rpayPurchaseStore/getSalesInfoText',
  KEY_FORMATTED_BIDDING_END_TIME: 'rpayPurchaseStore/getFormattedBiddingEndTime',
  KEY_RECIPIENT: 'rpayPurchaseStore/getRecipientAddress',
  KEY_DB_OFFERS: 'rpayPurchaseStore/getDbOffers',

  KEY_TRANSACTION_DIALOG_MESSAGE: 'contentStore/getTransactionDialogMessage',
  KEY_WAITING_IMAGE: 'contentStore/getWaitingCSS',
  KEY_EMAIL_TEXT: 'contentStore/getEmail',
  KEY_TOOL_TIP: 'contentStore/getTooltip',
  KEY_DIALOG_CONTENT: 'contentStore/getDialog',
  KEY_CONTENT_CHARITY_BY_ARTIST_ID: 'contentStore/getCharityByArtistId',
  KEY_CONTENT_ARTIST_BY_ID: 'contentStore/getArtistById',
  KEY_CONTENT_ARTIST_ID: 'contentStore/getArtistId',
  KEY_CONTENT_ARTISTS: 'contentStore/getArtists',
  KEY_CONTENT_CHARITIES: 'contentStore/getCharities',
  KEY_CONTENT_INFO_PAGE: 'contentStore/getInformationById',
  KEY_BREAK_LINE: 'contentStore/getBreakLine',
  KEY_PIXEL_BACKGROUND: 'contentStore/getPixelBackground',

  KEY_USER_SESSION: 'rpayAuthStore/getUserSession',
  KEY_PROFILE: 'rpayAuthStore/getMyProfile',
  KEY_GAIA_STORAGE: 'rpayAuthStore/getMyProfile',
  KEY_ACCOUNT_INFO: 'rpayAuthStore/getAccountInfo',
  KEY_ACCOUNTS: 'rpayAuthStore/getAccounts',
  KEY_AUTH_HEADERS: 'rpayAuthStore/getAuthHeaders',

  KEY_TICKER_RATES: 'rpayStore/getTickerRates',
  KEY_DISPLAY_CARD: 'rpayStore/getDisplayCard',
  KEY_MINTING_MESSAGE: 'rpayStore/getMintingMessage',
  SET_MINTING_MESSAGE: 'rpayStore/setMintingMessage',
  KEY_PREFERRED_NETWORK: 'rpayStore/getPreferredNetwork',
  KEY_PAYMENT_OPTION_VALUE: 'rpayStore/getCurrentPaymentOption',
  SET_PAYMENT_OPTION_VALUE: 'rpayStore/setCurrentCryptoPaymentOption',
  KEY_ENABLED_NETWORKS: 'rpayStore/getEnabledNetworks',
  SET_PREFERRED_NETWORK_VALUE: 'rpayStore/setPreferredNetwork',
  KEY_PAYMENT_OPTIONS: 'rpayStore/getPaymentOptions',

  KEY_MACS_WALLET: 'rpayStacksStore/getMacsWallet',
  KEY_SKYS_WALLET: 'rpayStacksStore/getSkysWallet',

  KEY_TARGET_FILE_FOR_DISPLAY: 'rpayStacksContractStore/getTargetFileForDisplay',
  KEY_GAIA_ASSET_BY_HASH: 'rpayStacksContractStore/getGaiaAssetByHash',
  KEY_GAIA_ASSETS: 'rpayStacksContractStore/getGaiaAssets',
  KEY_GAIA_ASSETS_BY_OWNER: 'rpayStacksContractStore/getGaiaAssetsByOwner',
  KEY_REGISTRY: 'rpayStacksContractStore/getRegistry',
  KEY_TRADE_INFO_FROM_HASH: 'rpayStacksContractStore/getTradeInfoFromHash',
  KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID: 'rpayStacksContractStore/getApplicationFromRegistryByContractId',
  KEY_ASSET_FROM_CONTRACT_BY_HASH: 'rpayStacksContractStore/getAssetFromContractByHash',
  KEY_ASSETS_BY_CONTRACT_ID: 'rpayStacksContractStore/getAssetsByContractId',
  KEY_ASSETS_BY_CONTRACT_ID_AND_OWNER: 'rpayStacksContractStore/getAssetsByContractIdAndOwner',
  KEY_ASSET_TRANSACTIONS: 'rpayStacksContractStore/getAssetTransactions',
  KEY_ASSET_LAST_TRANSACTION: 'rpayStacksContractStore/getAssetLastTransaction',
  KEY_ASSET_TRANSACTION: 'rpayStacksContractStore/getAssetTransaction',
  KEY_MY_CONTRACT_ASSETS: 'rpayStacksContractStore/getMyContractAssets',

  SET_CURRENT_SEARCH: 'rpaySearchStore/setCurrentSearch',
  KEY_CURRENT_SEARCH: 'rpaySearchStore/getCurrentSearch',
  KEY_ASSET: 'rpaySearchStore/getAsset',
  KEY_SEARCH_RESULTS: 'rpaySearchStore/getSearchResults'

}
