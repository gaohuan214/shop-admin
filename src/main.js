// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 导入axios
import axios from 'axios'
// 引入moment插件
import moment from 'moment'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入通用样式
import '@/assets/base.less'
// 引入element-tree-grid
import ElTreeGrid from 'element-tree-grid'
//
// console.log(ElTreeGrid)
Vue.component('el-table-tree-column', ElTreeGrid)
// 使用element-ui
Vue.use(ElementUI)
// 将axios绑定到Vue的原型上
Vue.prototype.axios = axios
// moment绑定到Vue的原型上
Vue.prototype.moment = moment
// 设置全局axios的baseURL(全局设置一般默认定死,不会更改的)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.config.productionTip = false

// 添加请求和响应拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // console.log(config)
    // 给config设置headers
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    // console.log(response)
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
