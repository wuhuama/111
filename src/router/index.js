import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/abnormalParking/Home.vue'

Vue.use(VueRouter)
// function load(component) {
//   // return resolve => require([`./views/${component}`], resolve)
//   return () => import(`@v/${component}.vue`)
// }
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/abnormalParking/About.vue')
  },
  {
    path: '/page',
    component: () => import('../views/page/index.vue'),
    redirect: {
      name: 'PageA'
    },
    children: [{
      path: 'aa',
      name: 'PageA',
      component: () => import('../views/page/pagea/index.vue')
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
