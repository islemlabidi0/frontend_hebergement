// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/universites'
    },
    {
      path: '/universites',
      name: 'universites',
      component: () => import('../components/universite/getAllUniversites.vue')
    },
    {
      path: '/universites/add',
      name: 'add-universite',
      component: () => import('../components/universite/AddUniversite.vue')
    },
    {
      path: '/universites/update/:id',
      name: 'update-universite',
      component: () => import('../components/universite/UpdateUniversite.vue')
    },
    {
      path: '/universites/affecter-foyer/:id',
      name: 'affecter-foyer',
      component: () => import('../components/universite/AffecterFoyer.vue')
    }
  ]
})

export default router
