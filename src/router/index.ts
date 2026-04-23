// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BlocView from '../views/BlocView.vue'
import Etudiant from '../components/etudiant/getAllEtudiants.vue'
import CreateEtudiant from '../components/etudiant/AddEtudiant.vue'
import EditEtudiant from '../components/etudiant/UpdateEtudiant.vue'
import DashboardView from '../views/DashboardView.vue'

const routes: Array<RouteRecordRaw> = [

  // ── Root redirect ───────────────────────────────────────────
  {
    path: '/',
    redirect: '/dashboard'
  },

  // ── Dashboard (SANS navbar) ─────────────────────────────────
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },

  // ── Pages AVEC navbar (via MainLayout) ──────────────────────
  {
    path: '/',
    component: () => import('../views/Mainlayout.vue'),
    children: [

      // Etudiants
      {
        path: 'listEtudiants',
        name: 'Etudiant',
        component: Etudiant
      },
      {
        path: 'etudiants/create',
        name: 'CreateEtudiant',
        component: CreateEtudiant
      },
      {
        path: 'etudiants/edit/:cin',
        name: 'EditEtudiant',
        component: EditEtudiant,
        props: true
      },

      // Universites
      {
        path: 'universites',
        name: 'universites',
        component: () => import('../components/universite/getAllUniversites.vue')
      },
      {
        path: 'universites/add',
        name: 'add-universite',
        component: () => import('../components/universite/AddUniversite.vue')
      },
      {
        path: 'universites/update/:id',
        name: 'update-universite',
        component: () => import('../components/universite/UpdateUniversite.vue')
      },
      {
        path: 'universites/affecter-foyer/:id',
        name: 'affecter-foyer',
        component: () => import('../components/universite/AffecterFoyer.vue')
      },

      // Foyers
      {
        path: 'foyers',
        name: 'foyers',
        component: () => import('../views/Foyer.vue')
      },

       {
          path: 'chambres-disponibles',
          name: 'chambres-disponibles',
          component: () => import('../views/ChambresDisponiblesView.vue')
},      

      // Blocs
      {
        path: 'blocs',
        name: 'blocs',
        component: BlocView
      },

      // ✅ Chatbot — page dédiée dans le layout (avec navbar)
      {
        path: 'chatbot',           // ← No leading slash: becomes /chatbot
        name: 'chatbot',
        component: () => import('../components/chatbot/Chatbot.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router