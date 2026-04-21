// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'  // ✅ import type
import BlocView from '../views/BlocView.vue'
import Foyer from "@/views/Foyer.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'blocs',
    component: BlocView
 
  },

  {
    path: "/foyer",
    name: "Foyer",
    component: Foyer
  }

]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
