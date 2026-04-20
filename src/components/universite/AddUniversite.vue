<!-- src/components/universite/AddUniversite.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
      <h2 class="text-center fw-bold text-primary mb-4">Ajouter une Université</h2>

      <form @submit.prevent="handleSubmit">
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

        <div class="alert alert-info small">
          <i class="bi bi-info-circle me-1"></i>
          Vous pourrez affecter un foyer à cette université après sa création.
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/universites" class="btn btn-outline-secondary">
            Annuler
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const router = useRouter()
const submitting = ref(false)

const universite = ref<Universite>({
  nomUniversite: '',
  adresse: ''
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    await addUniversite(universite.value)
    alert('Université ajoutée avec succès')
    router.push('/universites')
  } catch (err) {
    alert("Erreur lors de l'ajout")
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
