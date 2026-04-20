<!-- src/components/universite/getAllUniversites.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4">
      <h2 class="text-center fw-bold text-primary mb-4">Liste des universités</h2>

      <div class="d-flex justify-content-end mb-3">
        <router-link to="/universites/add" class="btn btn-primary">
          + Ajouter Université
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nom Université</th>
              <th>Adresse</th>
              <th>Foyer</th>
              <th>Capacité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in universites" :key="u.idUniversite">
              <td class="fw-bold">{{ u.idUniversite }}</td>
              <td>{{ u.nomUniversite }}</td>
              <td>{{ u.adresse }}</td>
              <td>
                <span v-if="u.foyer">{{ u.foyer.nomFoyer }}</span>
                <span v-else class="text-muted fst-italic">Aucun</span>
              </td>
              <td>{{ u.foyer?.capaciteFoyer || '-' }}</td>
              <td>
                <router-link
                  :to="`/universites/update/${u.idUniversite}`"
                  class="btn btn-outline-warning btn-sm me-2"
                >
                  Modifier
                </router-link>
                <router-link
                  v-if="!u.foyer"
                  :to="`/universites/affecter-foyer/${u.idUniversite}`"
                  class="btn btn-outline-info btn-sm me-2"
                >
                  Affecter Foyer
                </router-link>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDelete(u.idUniversite)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="universites.length === 0">
              <td colspan="6" class="text-muted py-4">Aucune université trouvée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUniversites, deleteUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const universites = ref<Universite[]>([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAllUniversites()
    universites.value = res.data
  } catch (err) {
    console.error(err)
    alert('Erreur de chargement. Vérifie que le backend tourne sur localhost:8080')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number | undefined) => {
  if (!id) return
  if (!confirm('Voulez-vous vraiment supprimer cette université ?')) return
  try {
    await deleteUniversite(id)
    fetchData()
  } catch (err) {
    alert('Erreur lors de la suppression')
    console.error(err)
  }
}

onMounted(fetchData)
</script>
