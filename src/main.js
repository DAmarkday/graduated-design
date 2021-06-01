import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import './assets/global.scss'
Vue.config.productionTip = false

// 引入工具
import apis from './utils/apis.js'
Vue.prototype.$api = apis
import { Net, Common, DataStore, Jump } from './utils/utils.js'
Vue.prototype.$Net = Net
Vue.prototype.$Common = Common
Vue.prototype.$DataStore = DataStore
Vue.prototype.$Jump = Jump
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.prototype.$host = "http://localhost:8080" // 请求host

Vue.use(antd)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
