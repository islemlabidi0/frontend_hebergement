<!-- src/components/universite/AffecterFoyer.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
      <h2 class="text-center fw-bold text-info mb-4">Affecter un Foyer</h2>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-info"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Université</label>
          <input
            :value="nomUniversite"
            type="text"
            class="form-control"
            disabled
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Choisir un foyer</label>
          <select v-model="idFoyerSelected" class="form-select" required>
            <option disabled value="">-- Sélectionner un foyer --</option>
            <option
              v-for="f in foyers"
              :key="f.idFoyer"
              :value="f.idFoyer"
            >
              {{ f.nomFoyer }} ({{ f.capaciteFoyer }} places)
            </option>
          </select>
        </div>

        <div v-if="foyers.length === 0" class="alert alert-warning small">
          Aucun foyer disponible !
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/universites" class="btn btn-outline-secondary">
            Annuler
          </router-link>
          <button
            type="submit"
            class="btn btn-info text-white"
            :disabled="submitting || !idFoyerSelected"
          >
            {{ submitting ? 'Affectation...' : 'Affecter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  getUniversiteById,
  affecterFoyerAUniversite
} from '../../services/universiteServices'
import type { Foyer } from '../../models/Universite'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const submitting = ref(false)

const nomUniversite = ref('')
const foyers = ref<Foyer[]>([])
const idFoyerSelected = ref<number | ''>('')

const fetchData = async () => {
  try {
    // Récupère le nom de l'université
    const id = Number(route.params.id)
    const resU = await getUniversiteById(id)
    nomUniversite.value = resU.data.nomUniversite

    // Récupère la liste des foyers depuis l'API de ton ami
    // ⚠️ Endpoint à adapter selon ce que ton ami a exposé
    const resF = await axios.get<Foyer[]>('http://localhost:8080/foyer/all')
    foyers.value = resF.data
  } catch (err) {
    console.error(err)
    alert('Erreur de chargement. Vérifie que les endpoints foyer existent.')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!idFoyerSelected.value) return
  submitting.value = true
  try {
    await affecterFoyerAUniversite(
      Number(idFoyerSelected.value),
      nomUniversite.value
    )
    alert('Foyer affecté avec succès')
    router.push('/universites')
  } catch (err) {
    alert("Erreur lors de l'affectation")
    console.error(err)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>
