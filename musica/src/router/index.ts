import { createRouter, createWebHistory } from 'vue-router'
import Componente1 from '../components/componente1.vue'
import Componente2 from '../components/componente2.vue'

const routes = [
  { path: '/', redirect: '/comp1' },
  { path: '/comp1', name: 'Comp1', component: Componente1 },
  { path: '/comp2', name: 'Comp2', component: Componente2 },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
