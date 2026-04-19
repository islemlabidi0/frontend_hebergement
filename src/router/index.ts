import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Etudiant from '../components/etudiant/getAllEtudiants.vue';
import CreateEtudiant from '../components/etudiant/AddEtudiant.vue';
import EditEtudiant from '../components/etudiant/UpdateEtudiant.vue';

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
