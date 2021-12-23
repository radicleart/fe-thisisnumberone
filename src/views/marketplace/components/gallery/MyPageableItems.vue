<template>
<div>
<div v-if="clicked && currentRunKey === 'crash_punks_v1'" class="text-center">
  <div class="mt-5 pt-5">Request sent - thank you. Your Crash Punks will be upgraded shortly...</div>
  <div class="mt-5 pt-5">Transactions are taking some time at the moment. Please be patient and you will see the # of V2 Crash Punk NFTs in your wallet after your transaction is in an anchor block - this site will take a little longer to reflect the update.</div>
  <div class="mt-2"></div>
  <div class="mt-5 pt-5">
    <a :href="transactionUrl()" target="_blank"><span class="text-warning ml-3">Track via the explorer</span></a>
  </div>
  <div class="mt-5 pt-5">How to read your transaction status: If your transaction is pending, it will go through, just please wait a while. Once your transaction status is picked up by the micro-block, it will go into the anchor block, and you have successfully upgraded. The NFTs will take some time to display back here.</div>
</div>
<div v-else>
  <div v-if="!loading">
    <h1 class="pointer mb-4 border-bottom"><b-icon font-scale="0.6" icon="chevron-right"/> {{tokenCount}} NFTs</h1>
    <div v-if="currentRunKey === 'crash_punks_v2' && tokenCount === 0">
      You currently have 0 Crash Punks on v2 - if you already upgraded they will appear here soon. If not, please make sure to upgrade <b-link class="text-warning" :to="'/my-nfts/crash_punks_v1'">here</b-link>
    </div>
    <div class="mb-4" v-if="loopRun && tokenCount > 0">
      <div class="my-5 text-center" v-if="canSeeUpgrade()">
        <div><b-button @click="revealCrashpunks" variant="outline-warning">Upgrade Your Crash Punks!</b-button></div>
        <div class="mt-5">Transactions are taking some time at the moment. Please be patient and you will see the # of V2 Crash Punk NFTs in your wallet after your transaction is in an anchor block - this site will take a little longer to reflect the update.</div>
      </div>
      <div v-if="currentRunKey === 'crash_punks_v2'">
        <Pagination @changePage="gotoPage" :pageSize="pageSize" :numberOfItems="numberOfItems" v-if="numberOfItems > 0"/>
        <div id="my-table" class="row" v-if="resultSet && resultSet.length > 0">
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 mx-0 p-1" v-for="(asset, index) of resultSet" :key="index">
            <MySingleItem @revealCrashpunk="revealCrashpunk" :parent="'list-view'" :loopRun="loopRun" :asset="asset" :key="componentKey"/>
          </div>
        </div>
        <div class="d-flex justify-content-start my-3 mx-4" v-else>
          <div class="mt-5">
            <p>No NFTs found for this collection...</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="numberOfItems > 0">Loading NFTs...</div>
  </div>
</div>
</div>
</template>

<script>
import MySingleItem from './MySingleItem'
import Pagination from './common/Pagination'
import { APP_CONSTANTS } from '@/app-constants'
import {
  uintCV, listCV, NonFungibleConditionCode, makeStandardNonFungiblePostCondition, createAssetInfo
} from '@stacks/transactions'

export default {
  name: 'MyPageableItems',
  components: {
    MySingleItem,
    Pagination
  },
  props: ['loopRun'],
  data () {
    return {
      trait: '',
      clicked: false,
      ready: true,
      showMinted: true,
      resultSet: [],
      tokenCount: null,
      pageSize: 200,
      loading: true,
      doPaging: true,
      numberOfItems: 0,
      componentKey: 0,
      nowOnPage: 0,
      currentRunKey: null,
      testAddresses: [
        'SPZV2JB3VG1071NCYZBTPDYNPJB638T9VJ6XVZ8T',
        'SP3K22XKPT9WJFCE957J94J6XXVZHP7747YNPDTFD',
        'SP1JT14AAXH7N3TYRX118GB7ZPMH4Q341TS0HM0VB',
        'SP3V11C6X2EBFN72RMS3B1NYQ1BX98F61GR6CFET9',
        'SP215E8HSVHDJ5Z3FWWENMDC6T6WSJG8MVR07ENT',
        'SP6G0ZVG8F746FZXNGPJE54MPYN70VT1N9C4Y6BW',
        'SP1W4WC3DGZ2YYKNAZNJ80F621R11FAPZGGA4Y2QH',
        'SP2ZSAFCYS4F079G5YSQG82H2Z3WY9VPTSTM7FV8Z',
        'SP1GBC4AF1682VJ4MSP1VWX6KPTEPX3S7B1W31061',
        'SP168FXMCG1VZVJK46XNKHXWC418MH4JY5HETAWY4',
        'SPAGKDWK07GB9T2X5PZ12N004PDW94MJGRR2JSHS',
        'SP36HSTPM2C0WVJX4G3415CYPNBKCAE5GR5R7SW88',
        'SP162D87CY84QVVCMJKNKGHC7GGXFGA0TAR9D0XJW',
        'SP3WJCRTJNSMZ58VTP4D87GRG3HK8X06ST8VSAZCC',
        'SP3HNXGEERV3RM08WKNSYJQC2ZVCS28A37C9WGAQ5',
        'SP3E2ZEKW0HAGG0BJSCVNJRQVJMJBNS87S1V6SG0K',
        'SP5EJ12SJVFHC93E9VQV2QZY046C8D6VG47MPH74',
        'SP3Z7XXN33498GYVKZ3A3WA54M2NP88WF06FG99YT',
        'SP3ESBKP1EDKAA0083DA2MAM1TYPF93MFME2MRE2B',
        'SP2KQ9DVPWJKEZ7XE5HZ6G33HT90EKTQTA74P2NFG',
        'SP2SP0TCPTTDNVWA4HCRDEB65HQR2XNCVDG3XW2N8',
        'SP34SMWPA91H97KBBHPN9EM28F7H99EBWP7PFCKKJ',
        'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ',
        'SP267TMY9MTMP98AW05X8RFQ43JRMTPGDWFKFCPTH'
      ]
    }
  },
  mounted () {
    this.loading = false
    const UPGRADE_TX = localStorage.getItem('UPGRADE_TX')
    if (UPGRADE_TX) {
      this.clicked = true
    }
    this.currentRunKey = this.$route.params.collection
    // this.numberOfItems = 500 // this.loopRun.tokenCount
    this.fetchPage(0)
    const $self = this
    let resizeTimer
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.componentKey += 1
      }, 400)
    })
    window.onscroll = () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
        // $self.page++
        // $self.fetchPage()
      }
    }
  },
  methods: {
    canSeeUpgrade () {
      if ((this.loopRun.contractId.indexOf('crashpunks-t8') > -1 || this.loopRun.contractId.indexOf('crashpunks-v1') > -1)) {
        return true // this.testAddresses.indexOf(this.profile.stxAddress) > -1
      }
      return false
    },
    transactionUrl: function () {
      if (!this.result) return
      let txId = this.result.txId
      if (!txId.startsWith('0x')) txId = '0x' + txId
      const stacksApiUrl = process.env.VUE_APP_STACKS_EXPLORER
      return stacksApiUrl + '/txid/' + txId + '?chain=' + process.env.VUE_APP_NETWORK
    },
    gotoPage (page) {
      this.nowOnPage = page - 1
      this.fetchPage(page - 1)
    },
    updateCacheByNftIndex (data) {
      this.$store.dispatch('rpayStacksContractStore/updateCacheByNftIndex', data).then(() => {
        // sent
      })
    },
    pokeCache () {
      this.resultSet.forEach((o) => {
        this.updateCacheByNftIndex({ contractId: o.contractAsset.contractId, nftIndex: o.contractAsset.nftIndex })
      })
    },
    getPostCondition (nftIndex) {
      const nonFungibleAssetInfo = createAssetInfo(
        this.loopRun.contractId.split('.')[0],
        this.loopRun.contractId.split('.')[1],
        'crashpunks'
      )
      return makeStandardNonFungiblePostCondition(
        this.profile.stxAddress,
        NonFungibleConditionCode.DoesNotOwn,
        nonFungibleAssetInfo,
        uintCV(nftIndex)
      )
    },
    revealCrashpunk (data) {
      if (!this.ready) {
        this.$notify({ type: 'warning', title: 'Coming Soon!', text: 'We will be ready soon.' })
        return
      }
      const callData = {
        postConditions: [this.getPostCondition(data.nftIndex)],
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME_CPS_UPGRADE,
        functionName: 'upgrade-v1-to-v2',
        functionArgs: [uintCV(data.nftIndex)]
      }
      const methos = (process.env.VUE_APP_NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$store.dispatch(methos, callData).then((result) => {
        this.clicked = true
        localStorage.setItem('UPGRADE_TX', 'CLICKED')
        this.result = result
        this.$notify({ type: 'success', title: 'Reveal in Progress', text: 'Check the explorer - your Punks will be ready soon!' })
      }).catch(() => {
        this.$notify({ type: 'Error', title: 'Upagrade Failed', text: 'Thanks for your patience while we investigate!' })
      })
    },
    revealCrashpunks () {
      if (!this.ready) {
        this.$notify({ type: 'warning', title: 'Coming Soon!', text: 'We will be ready soon.' })
        return
      }
      const postConditions = []
      const upgradeList = []
      this.resultSet.forEach((o) => {
        upgradeList.push(uintCV(o.nftIndex))
        postConditions.push(this.getPostCondition(o.nftIndex))
      })
      const callData = {
        postConditions: postConditions,
        contractAddress: this.loopRun.contractId.split('.')[0],
        contractName: process.env.VUE_APP_STACKS_CONTRACT_NAME_CPS_UPGRADE,
        functionName: 'batch-upgrade-v1-to-v2',
        functionArgs: [listCV(upgradeList)]
      }
      const methos = (process.env.VUE_APP_NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$store.dispatch(methos, callData).then((result) => {
        this.clicked = true
        localStorage.setItem('UPGRADE_TX', 'CLICKED')
        this.result = result
        this.$notify({ type: 'success', title: 'Reveal in Progress', text: 'Check the explorer - your Punks will be ready soon!' })
      }).catch(() => {
        this.$notify({ type: 'Error', title: 'Upagrade Failed', text: 'Thanks for your patience while we investigate!' })
      })
    },
    isTheV2Contract () {
      const STX_CONTRACT_NAME_V2 = process.env.VUE_APP_STACKS_CONTRACT_NAME_V2
      return this.loopRun && this.loopRun.contractId.indexOf(STX_CONTRACT_NAME_V2) > -1
    },
    fetchPage (page) {
      const data = {
        // runKey: (this.loopRun) ? this.loopRun.currentRunKey : LOOP_RUN_DEF,
        contractId: this.loopRun.contractId,
        stxAddress: this.profile.stxAddress,
        asc: true,
        page: page,
        pageSize: this.pageSize
      }
      if (this.isTheV2Contract()) data.contractId = (this.loopRun) ? this.loopRun.contractId : process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME
      // if (this.currentRunKey) data.runKey = this.currentRunKey
      if (process.env.VUE_APP_NETWORK === 'local') {
        data.stxAddress = 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
      }
      this.$store.dispatch('rpayStacksContractStore/fetchMyTokensCPSV2', data).then((result) => {
        this.resultSet = result.gaiaAssets // this.resultSet.concat(results)
        this.tokenCount = result.tokenCount
        this.numberOfItems = result.gaiaAssets.length
        if (this.resultSet && this.resultSet.length > 0) {
          // this.pokeCache()
        }
        this.loading = false
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    mintCounter () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME)
      return application.tokenContract.mintCounter
    }
  }
}
</script>
<style>
.myItemsIntroText {font-weight: 200; font-size: 1.1rem; color: #fff;}
.btn {
  width: auto;
}
</style>
