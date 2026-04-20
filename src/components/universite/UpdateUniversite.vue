<!-- src/components/universite/UpdateUniversite.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
      <h2 class="text-center fw-bold text-warning mb-4">Modifier Université</h2>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-warning"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Nom de l'université</label>
          <input
            v-model="universite.nomUniversite"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Adresse</label>
          <input
            v-model="universite.adresse"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div v-if="universite.foyer" class="alert alert-light border">
          <small class="text-muted d-block">Foyer actuellement affecté :</small>
          <strong>{{ universite.foyer.nomFoyer }}</strong> ({{ universite.foyer.capaciteFoyer }} places)
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/universites" class="btn btn-outline-secondary">
            Annuler
          </router-link>
          <button type="submit" class="btn btn-warning" :disabled="submitting">
            {{ submitting ? 'Modification...' : 'Modifier' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUniversiteById, updateUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const submitting = ref(false)

const universite = ref<Universite>({
  nomUniversite: '',
  adresse: ''
})

const fetchUniversite = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getUniversiteById(id)
    universite.value = res.data
  } catch (err) {
    alert('Erreur de chargement')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await updateUniversite(universite.value)
    alert('Université modifiée avec succès')
    router.push('/universites')
  } catch (err) {
    alert('Erreur lors de la modification')
    console.error(err)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchUniversite)
</script>
