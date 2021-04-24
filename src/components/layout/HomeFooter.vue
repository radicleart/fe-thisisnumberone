<template>
<div>
  <div class="py-4 mr-5 d-flex justify-content-end" style="position: relative; top: -50px; ">
    <div><b-link to="/home"><img width="80px" height="50px" :src="solidWhiteOne"/></b-link></div>
  </div>
</div>
</template>

<script>

export default {
  name: 'HomeFooter',
  data () {
    return {
      solidWhiteOne: require('@/assets/img/Group 95.png')
    }
  },
  methods: {
  },
  computed: {
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
