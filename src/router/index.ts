// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BlocView from '../views/BlocView.vue'

const routes: Array<RouteRecordRaw> = [
  // Redirection par défaut vers la liste des universités
  {
    path: '/',
    redirect: '/universites'
  },

  // Routes Bloc (de ton ami)
  {
    path: '/blocs',
    name: 'blocs',
    component: BlocView
  },

  // Routes Universités (les tiennes)
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
