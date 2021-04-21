import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Notifications from 'vue-notification'
import PrismicVue from 'prismic-vue'
import linkResolver from './prismic/link-resolver'
import htmlSerializer from './prismic/html-serializer'
import RisidioPay from 'risidio-pay'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/scss/custom.scss'
import './assets/scss/rpay-pay-card.css'
import VueScrollTo from 'vue-scrollto'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueScrollTo)
Vue.use(IconsPlugin)
Vue.use(Notifications, { closeOnClick: true, duration: 6000 })
Vue.use(PrismicVue, {
  endpoint: 'https://dbid.cdn.prismic.io/api/v2',
  linkResolver,
  htmlSerializer
})
Vue.use(RisidioPay)

declare global {
  interface Window { eventBus: any }
}
window.eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
