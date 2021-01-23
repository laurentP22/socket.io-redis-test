import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router';
import { routes } from './routes';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter);

const router = new VueRouter({ routes })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app')
