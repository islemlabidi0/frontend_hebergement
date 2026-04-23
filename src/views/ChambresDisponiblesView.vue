<template>
  <div class="container py-4">

    <h2 class="text-center foyer-title mb-4">
      <i class="bi bi-door-open me-2"></i>Chambres Disponibles
    </h2>

    <!-- Filters -->
    <div class="foyer-card p-4 mb-4">
      <h5 class="mb-3 fw-semibold">Rechercher des chambres libres</h5>

      <div class="row g-3 align-items-end">
        <div class="col-md-5">
          <label class="form-label fw-semibold small">Foyer</label>
          <select v-model="selectedFoyer" class="form-select foyer-input">
            <option disabled value="">-- Choisir un foyer --</option>
            <option v-for="f in foyers" :key="f.idFoyer" :value="f.nomFoyer">
              {{ f.nomFoyer }}
            </option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold small">Type de chambre</label>
          <select v-model="selectedType" class="form-select foyer-input">
            <option disabled value="">-- Choisir un type --</option>
            <option value="SIMPLE">🔵 SIMPLE</option>
            <option value="DOUBLE">🟢 DOUBLE</option>
            <option value="TRIPLE">🟠 TRIPLE</option>
          </select>
        </div>

        <div class="col-md-3">
          <button
            class="btn btn-foyer w-100"
            @click="search"
            :disabled="!selectedFoyer || !selectedType || loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-search me-1"></i>
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="foyer-card p-4" v-if="searched || errorMessage">

      <!-- Error -->
      <div v-if="errorMessage" class="alert alert-danger py-2 mb-0">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
      </div>

      <!-- Empty -->
      <div v-else-if="chambres.length === 0" class="text-center empty-state py-4">
        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
        Aucune chambre disponible pour ce foyer et ce type
      </div>

      <!-- Table -->
      <div v-else>
        <p class="text-muted small mb-3">
          <strong>{{ chambres.length }}</strong> chambre(s) disponible(s) —
          Foyer <strong>{{ selectedFoyer }}</strong> —
          Type <strong>{{ selectedType }}</strong>
        </p>

        <table class="table table-borderless table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th>N° Chambre</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in chambres" :key="c.numeroChambre">
              <td class="fw-bold">{{ c.numeroChambre }}</td>
              <td>
                <span :class="typeBadge(c.type)">{{ c.type }}</span>
              </td>
              <td>
                <span class="badge bg-success">Disponible</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getAllFoyers,
  getChambresDisponibles,
  type Foyer,
  type Chambre
} from '@/services/foyerService'

const foyers = ref<Foyer[]>([])
const chambres = ref<Chambre[]>([])
const selectedFoyer = ref('')
const selectedType = ref('')
const loading = ref(false)
const searched = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const res = await getAllFoyers()
  foyers.value = res.data
})

const search = async () => {
  loading.value = true
  searched.value = false
  errorMessage.value = ''
  try {
    const res = await getChambresDisponibles(selectedFoyer.value, selectedType.value)
    chambres.value = res.data
    searched.value = true
  } catch {
    errorMessage.value = 'Erreur lors de la recherche.'
  } finally {
    loading.value = false
  }
}

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    SIMPLE: 'badge bg-primary',
    DOUBLE: 'badge bg-success',
    TRIPLE: 'badge bg-warning text-dark'
  }
  return map[type] || 'badge bg-secondary'
}
</script>
