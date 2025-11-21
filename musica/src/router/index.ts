import { createRouter, createWebHistory } from 'vue-router'
import reproductor from '@/components/reproductor.vue'

const routes = [
  { path: '/', redirect: '' },
  { path: '/reproductor', name: 'Reproductor', component: reproductor }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
