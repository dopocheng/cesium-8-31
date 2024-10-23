import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/hydrometeorview',
      name: 'hydrometeorview',
      component: () => import('../views/HydrometeorView.vue')
    },
    {
      path: '/cetest',
      name: 'cetest',
      component: () => import('../views/CeTest.vue')
    },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/pinia',
      name: 'pinia',
      component: () => import('../views/PiniaStore.vue')
    },
    {
      path: '/uploadnot',
      name: 'uploadnot',
      component: () => import('../views/UploadNot.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
