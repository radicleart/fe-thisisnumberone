<template>
  <div v-if="content">
    <div class="footer-break-line" :style="'background-image: url(' + line + ')'"></div>

    <div class="footer-container">

      <div class="row footer-top">

        <div class="footer-logo col-12 col-lg-4">
          <img :src="logo" alt="logo"/>
        </div>

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">About</div>
          <div v-for="(item,index) of content.column_about" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
        </div>

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">#1</div>
          <div v-for="(item,index) of content.column__1" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
        </div>

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">News</div>
          <div v-for="(item,index) of content.news_column" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
          <div class="social-links">
            <a href="#"><b-icon width="23px" height="23px" icon="facebook"></b-icon></a>
            <a href="#"><b-icon width="23px" height="23px" icon="instagram"></b-icon></a>
            <a href="#"><b-icon width="23px" height="23px" icon="twitter"></b-icon></a>
          </div>
        </div>

        <div class="col-3 col-lg-2 footer-top--content">
          <div class="column-header">Partners</div>
          <div v-for="(item,index) of content.partners_column" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href=item.link.url>{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href=item.link.url><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
        </div>
      </div>

      <div class="d-none d-sm-flex justify-content-between footer-bottom">
        <div class="footer-bottom--left">
          {{ content.left_bottom_corner[0].text }}
        </div>

        <div class="footer-bottom--right">
          <a href="#">Term of use</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>

      <div class="d-block d-sm-none text-center footer-bottom">
        <div class="footer-bottom--left mb-1">
          <a href="#">Term of use</a>
          <a href="#">Privacy policy</a>
        </div>

        <div class="footer-bottom--right">
          {{ content.left_bottom_corner[0].text }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'MainFooter',
  data () {
    return {
      logo: require('@/assets/img/navbar-footer/logo-footer.svg'),
      line: require('@/assets/img/navbar-footer/break-line.svg')
    }
  },
  methods: {
  },
  computed: {
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
