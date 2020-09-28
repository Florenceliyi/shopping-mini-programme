import Vue from 'vue'
import App from './App'
import request from "./utils/request"

//将方法添加到vue实例的原型当中
Vue.prototype.$request = request;


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()