// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.config.productionTip = false

import './common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App) // render 是vue里面实现渲染dom的函数，这句的目的是渲染这个app实例
  // 在Vue 1.x下，就应该使用
  // template: '<App/>',
  // components: { App }
})
