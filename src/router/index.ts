import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'  // ✅ import type
import BlocView from '../views/BlocView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'blocs',
    component: BlocView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router