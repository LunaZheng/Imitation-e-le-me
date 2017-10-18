import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    path: '/goods',
    component: require('../components/goods/goods.vue')
  }, {
    path: '/ratings',
    component: require('../components/ratings/ratings.vue')
  }, {
    path: '/seller',
    component: require('../components/seller/seller.vue')
  }, {
    path: '*',
    redirect: '/goods'
  }]
})
