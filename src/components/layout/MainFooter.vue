<template>
  <div class="bg-black" v-if="content">
    <div class="footer-break-line" :style="'background-image: url(' + getBreakLine + ')'"></div>

    <div class="footer-container">

      <div class="row footer-top">

        <div class="footer-logo col-12 col-lg-4">
          <b-link to="/home"><img :src="logo" alt="logo"/></b-link>
        </div>

        <div class="col-3 offset-2 col-lg-2 footer-top--content">
          <div class="column-header">About</div>
          <div v-scroll-to="{ offset: -60, element: '#thisisone', duration: 1000 }">
            <b-link to="/about">About This is #1</b-link>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#chemicalx', duration: 1000 }">
            <b-link to="/about">Chemical X</b-link>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#charity-grid', duration: 1000 }">
            <b-link to="/about">Charities</b-link>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#about-section5', duration: 1000 }">
            <b-link to="/about">Environment</b-link>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#collaborate', duration: 1000 }">
            <b-link to="/about">Collaborate</b-link>
          </div>
          <!--
          <div v-for="(item,index) of content.column_about" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href="item.link.url" target="_blank">{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href="item.link.url" target="_blank"><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
          -->
        </div>

        <!--
          <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">#1</div>
          <div v-for="(item,index) of content.column__1" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href="item.link.url" target="_blank">{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href="item.link.url" target="_blank" ><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
        </div>
        -->

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">Contact</div>
          <div>
            <a :href="'mailto:press@thisisnumberone.com'" target="_blank">Press enquiries</a>
          </div>
          <div>
            <a :href="'mailto:enquiries@thisisnumberone.com'" target="_blank">Get in touch</a>
          </div>
          <div>
            <b-link to="/information/faq">Read FAQ</b-link>
          </div>
          <!--
          <div v-for="(item,index) of content.news_column" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href="item.link.url" target="_blank">{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href="item.link.url" target="_blank"><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
          -->
          <div class="social-links">
            <!--
            <a href="#"><b-icon width="23px" height="23px" icon="facebook"></b-icon></a>
            <a href="#"><b-icon width="23px" height="23px" icon="twitter"></b-icon></a>
            -->
            <a class="mr-3" href="https://www.instagram.com/this_is_no.1" target="_blank"><b-icon width="20px" height="20px" icon="instagram"></b-icon></a>
            <a :href="'mailto:enquiries@thisisnumberone.com'" target="_blank"><b-icon width="23px" height="23px" icon="mailbox"></b-icon></a>
          </div>
        </div>

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">Partners</div>
          <div v-for="(item,index) of content.partners_column" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href="item.link.url" target="_blank">{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href="item.link.url" target="_blank"><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
          <div v-if="webWalletNeeded"><a :href="webWalletLink" target="_blank">Get Stacks Wallet for Web</a></div>
          <div v-else>
            <div v-if="!loggedIn"><b-link variant="light" @click.prevent="startLogin()">Own NFTs here?</b-link></div>
            <div v-else><b-link variant="light" @click.prevent="startLogout()">Logout</b-link></div>
          </div>
        </div>
      </div>

      <div class="d-none d-sm-flex justify-content-between footer-bottom">
        <div class="footer-bottom--left">
          {{ content.left_bottom_corner[0].text }}
        </div>
      </div>
        <!--
      <div class="d-none d-sm-flex justify-content-between footer-bottom">
        <div class="footer-bottom--left">
          {{ content.left_bottom_corner[0].text }}
        </div>

        <div class="footer-bottom--right">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>
      </div>

      <div class="d-block d-sm-none text-center footer-bottom">
        <div class="footer-bottom--left mb-1">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>

        <div class="footer-bottom--right">
          {{ content.left_bottom_corner[0].text }}
        </div>
      </div>
        -->

    </div>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainFooter',
  data () {
    return {
      webWalletNeeded: false,
      logo: require('@/assets/img/navbar-footer/logo-footer.svg')
    }
  },
  methods: {
    startLogout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        // localStorage.clear()
        // sessionStorage.clear()
        if (this.$route.name !== 'splash') {
          this.$router.push('/')
        }
      })
    },
    startLogin () {
      this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
        if (this.$route.name !== 'my-nfts') {
          this.$router.push('/my-nfts')
        }
      }).catch((err) => {
        console.log(err)
        // https://www.hiro.so/wallet/install-web
        this.webWalletNeeded = true
      })
    }
  },
  computed: {
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    },
    getBreakLine () {
      return this.$store.getters[APP_CONSTANTS.KEY_BREAK_LINE]
    },
    content () {
      const content = this.$store.getters['contentStore/getMainFooter']
      return content
    }
  }
}
</script>

<style>
/* TOP BREAK LINE */
.footer-break-line {
  height: 10px;
}

/* FOOTER GENERAL STYLE */
.footer-container {
  font-size: 1.4rem;
  padding: 90px 24px 24px;
  color: #ffffff;
}
.footer-container a, .footer-container a:hover {
  color: #ffffff;
}

/* FOOTER TOP ROW STYLE */
.footer-top--content {
  text-align: center;
}
.footer-top--content div:not(:last-child) {
  margin-bottom: 15px;
}
/* Column headers */
.footer-container .footer-top--content .column-header {
  font-weight: 700;
  margin-bottom: 25px;
}
/* Social icons */
.social-links {
  margin-top: 30px;
}
.social-links a:not(:last-child){
  margin-right: 30px;
}
/* Logo */
.footer-logo {
  text-align: center;
}
.footer-logo img {
  margin-left: 0;
  margin-bottom: 50px;
}

/* FOOTER BOTTOM ROW STYLE */
.footer-bottom {
  margin-top: 50px;
}
.footer-bottom a:first-child {
  margin-right: 27px;
}

/* MOBILE STYLE */
@media only screen and (min-width: 992px) {
  .footer-logo {
    text-align: left;
  }
  .footer-logo img {
    margin-left: 40px;
    margin-bottom: 0;
  }
  .footer-top--content {
    text-align: left;
  }
}

@media only screen and (max-width: 700px) {
  .social-links {
    display: flex;
    flex-flow: column;
    margin-top: 0;
  }
  .social-links a:not(:last-child){
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
