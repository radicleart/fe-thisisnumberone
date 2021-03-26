<template>
<div v-if="content">
  <footer class="footer-container">
    <div style="height: 240px;" class="row">
      <div class="col-12 text-center mt-4"><h1>This Is Definitely Not The One</h1></div>
      <div class="col-12 text-center">By Risidio</div>
      <div class="col-12 text-center social-icons">
        <span style="font-size: 15px;">
          <a href="https://discord.gg/qvuxB9P"><b-icon class="mx-4" scale="3" icon="discord"></b-icon></a>
          <a href="https://twitter.com/Risidio1"><b-icon class="mx-4" scale="3"  icon="twitter"></b-icon></a>
          <a href="https://www.instagram.com/risidio_official/"><b-icon class="mx-4" scale="3"  icon="instagram"></b-icon></a>
        </span>
      </div>
    </div>
    <div class="row text-center">
      <div class="col-12">
        &copy; &nbsp; {{ year }} Risidio Ltd. All right reserved.
      </div>
    </div>
  </footer>
</div>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  data () {
    return {
      year: new Date().getFullYear()
    }
  },
  methods: {
    getContent (contentType) {
      const content = this.$store.getters['contentStore/getHomepage']
      if (content) {
        let sitecontent = ''
        content.footer[0][contentType].forEach(function (option) {
          sitecontent += option.text
        })
        return sitecontent
      }
      return {}
    }
  },
  computed: {
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    }
  }
}
</script>
<style>
.footer-container {
  height: 280px;
}

.footer-container h2 {
  font-size: 17px;
  font-weight: 200;
}

.footer-container p {
  font-size: 12px;font-weight: 700; padding: 5px 0 0 0; margin: 0;
}

.footer-logo {
  width: 255px;
  height: 100px;
}

/* FOOTER ON MOBILE */
.mobile-footer p {
  width: 30%;
  margin: 0 auto !important;
  text-align: center;
  font-size: 10px !important;
  font-weight: 400 !important;
  letter-spacing: 0.5px;
  padding-top: 8px !important;
}

.mobile-footer h2 {
  font-size: 15px !important;
  letter-spacing: 0.75px;
  margin-bottom: 2px;
}

.mobile-footer--contact p:last-child, .mobile-footer--contact p:nth-child(3) {
  display: none;
}

.social-icons {
  margin-top: 11px;
}

.social-icons a:not(:last-child) {
  margin-right: 15px;
}

.social-icons a {
  color: #fff;
}

.social-icons a:hover {
  color: #fff;
}

.mobile-footer--copyright {
  font-size: 8px;
  font-weight: 300;
  padding-bottom: 22px;
}

@media only screen and (max-width: 991px) {
  .footer-logo {
    width: 138px;
    height: 55px;
  }
}

@media only screen and (max-width: 768px) {
  .content-footer {
    margin-left: 3rem;
  }
}

@media only screen and (max-width: 575px) {
  .footer-logo {
    width: 200px;
    height: auto;
  }
  .footer-container {
    height: 395px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }
}

@media only screen and (max-width: 320px) {
  .mobile-footer p {
    width: 33%;
  }
}
</style>
