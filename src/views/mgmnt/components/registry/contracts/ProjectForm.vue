<template>
    <b-form>
      <div class="row">
        <div class="col-md-12 col-xs-12">
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="Address.Name - name should contain a version string e.g. \'mycontract-v1\' the part before the version will be used as the name of the project on this platform">Project / Contract Name</span></div>
            </div>
            <b-input v-model="project.contractId" placeholder="Contract name"></b-input>
          </div>
          <div class="mb-4 text2">
            <div class=""><span v-b-tooltip.hover="{ variant: 'warning' }" title="url of project logo - e.g. hosted in prismic or cloudinary">Logo Image URL</span></div>
            <b-input v-model="project.image" placeholder="url of project logo - e.g. hosted in prismic or cloudinary"></b-input>
          </div>
          <div class="mb-4 text2">
            <div class=""><span v-b-tooltip.hover="{ variant: 'warning' }" title="description of project">description of project</span></div>
            <b-textarea v-model="project.description" placeholder="description"></b-textarea>
          </div>
        </div>
        <div class="col-md-6 col-xs-6">
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="Contract owner">Contract Administrator</span></div>
              <div class="text2"><a href="#" class="mr-1" @click.prevent="useMyAddress()">mine</a> <a class="text-info" href="#" @click.prevent="useMacsAddress()">macs</a></div>
            </div>
            <b-input v-model="project.owner"></b-input>
          </div>
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="title">title of project</span></div>
            </div>
            <b-input v-model="project.title" placeholder="title of project"></b-input>
          </div>
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <div class="text2"><span v-b-tooltip.hover="{ variant: 'warning' }" title="3 or 4 letter symbol">Token Symbol</span></div>
            </div>
            <b-input v-model="project.symbol" placeholder="3 letters upper case"></b-input>
          </div>
          <div class="mb-4 text2">
            <div class="">Platform Address</div>
            <b-input v-model="project.platformAddress"></b-input>
          </div>
        </div>
        <div class="col-md-6 col-xs-6">
          <div class="mb-4 text2">
            <div class=""><span v-b-tooltip.hover="{ variant: 'warning' }" title="Initial cost of minting NFTs - can be changed by owner">Mint Price (micro stacks)</span></div>
            <b-input v-model="project.mintPrice"></b-input>
          </div>
          <div class="text2">
            <div class=""><span v-b-tooltip.hover="{ variant: 'warning' }" title="the URL that gets appended with the nft index to display the NFT - should end in a / and can be changed by admin.">Base URI</span></div>
            <b-input v-model="project.callBack"></b-input>
          </div>
          <div class="text2" role="group">
            <label for="status-name"><span class="text-danger">*</span> Project State</label>
            <b-form-select size="lg" id="status-name" v-model="project.status" :options="statusEnum"></b-form-select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="my-3">
            <b-button class="mr-3" variant="light" @click.prevent="this.$emit('update', { opcode: 'project-saved' })">Cancel</b-button>
            <b-button class="mr-3" variant="info" @click.prevent="saveProject()">Save</b-button>
          </div>
        </div>
      </div>
    </b-form>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ProjectForm',
  components: {
  },
  props: ['contractId'],
  data () {
    return {
      statusEnum: ['new', 'deployment', 'connected', 'active', 'inactive', 'disabled'],
      project: {
        platformAddress: process.env.VUE_APP_REGISTRY_CONTRACT_ADDRESS,
        status: 'deployment',
        image: 'https://images.prismic.io/dbid/cc7d59a2-65f4-45a2-b6e5-df136e2fd952_OS_thumb.png?auto=compress,format',
        owner: null,
        description: 'The best NFT project ever..',
        updated: new Date().getTime(),
        title: 'my project',
        symbol: 'MYP',
        mintPrice: '100000',
        contractAddress: null,
        contractName: null,
        callBack: 'https://thisisnumberone.com/nfts/'
      }
    }
  },
  mounted () {
    if (this.contractId) {
      this.$store.dispatch('rpayProjectStore/fetchProjectByContractId', this.contractId).then((project) => {
        this.project = Object.assign(this.project, project)
        this.loaded = true
      })
    } else {
      this.project.contractId = this.profile.stxAddress + '.' + 'myproject-V001'
      this.project.owner = this.profile.stxAddress
      this.project.title = 'My New Project'
      this.project.symbol = 'NWP'
      this.project.updated = new Date().getTime()
      this.loaded = true
    }
  },
  methods: {
    useProject: function () {
      const contractName = this.project.projectId.split('.')[1]
      if (contractName.indexOf('-') > -1) {
        this.project.title = contractName.split('-')[0]
      } else {
        this.project.title = contractName.title
      }
    },
    usePlatformAddress: function () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      this.project.platformAddress = (mac && mac.keyInfo && mac.keyInfo.address) ? mac.keyInfo.address : ''
    },
    useMyAddress: function () {
      this.project.owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    useMacsAddress: function () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      this.project.owner = (mac && mac.keyInfo && mac.keyInfo.address) ? mac.keyInfo.address : ''
    },
    validate: function () {
      let result = true
      const mp = Number(this.project.mintPrice)
      if (!this.project.mintPrice || isNaN(mp) || mp < 10000 || mp > 100000000) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the mint price of your tokens (in micro stacks) between 0.001 and 100 stx' })
        result = false
      }
      if (!this.project.callBack || !this.project.callBack.startsWith('https://')) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter a secure (https) callback url for your tokens - we append the asset hash to retrieve meta data.' })
        result = false
      }
      if (!this.project.title || this.project.title.indexOf('myproject') > -1) {
        this.$notify({ type: 'error', title: 'Project Name', text: 'Please enter a descriptive name.' })
        result = false
      }
      if (!this.project.title || this.project.title.indexOf('token') > -1) {
        this.$notify({ type: 'error', title: 'Token Name', text: 'Please enter a descriptive name.' })
        result = false
      }
      if (!this.project.symbol || this.project.symbol.indexOf('token') > -1) {
        this.$notify({ type: 'error', title: 'Token Symbol', text: 'Please enter a symbol for your token - convention is 3 or 4 uppercase letters or digits.' })
        result = false
      }
      let tokenUrl
      try {
        tokenUrl = new URL(this.project.callBack)
        this.tokenUrl = tokenUrl
      } catch (e) {
        tokenUrl = ''
        result = false
      }
      return result
    },
    getCleanTokenName: function () {
      let cleanTokenName = this.project.title
      if (!this.project.title || this.project.title === 'title') {
        this.$notify({ type: 'error', title: 'Token Name', text: 'Please enter a descriptive name.' })
        return
      } else if (this.project.title.indexOf('-') > -1) {
        cleanTokenName = this.project.title.split('-')[0]
      }
      return cleanTokenName
    },
    saveProject: function () {
      this.$store.dispatch('rpayProjectStore/saveProject', { project: this.project, imageData: null }).then((project) => {
        this.project = project
        this.$notify({ type: 'success', title: 'Projects', text: 'Project has been saved.' })
        this.$emit('update', { opcode: 'project-saved' })
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
