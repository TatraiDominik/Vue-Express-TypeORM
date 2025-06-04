import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/producers',
      name:'Producers',
      component: ()=> import("@/views/Producers.vue")
    },
    {
      path: '/movies',
      name:'Movies',
      component: ()=> import("@/views/Movies.vue")
    }
  ],
})

export default router
