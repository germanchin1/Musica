import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/components/Landing.vue'
import Reproductor from '@/components/reproductor.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Landing },
  { path: '/reproductor', name: 'Reproductor', component: Reproductor },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
