
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Etudiant from '../components/etudiant/getAllEtudiants.vue';
import CreateEtudiant from '../components/etudiant/AddEtudiant.vue';
import EditEtudiant from '../components/etudiant/UpdateEtudiant.vue';
import type { RouteRecordRaw } from 'vue-router'
import BlocView from '../views/BlocView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/listEtudiants",
    name: "Etudiant",
    component: Etudiant,
  },
  {
    path: "/etudiants/create",
    name: "CreateEtudiant",
    component: CreateEtudiant,
  },
  {
    path: "/etudiants/edit/:cin",
    name: "EditEtudiant",
    component: EditEtudiant,
    props: true
  },
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
