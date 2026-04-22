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
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
            {{ submitting ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>

    <!-- SUCCESS MODAL -->
    <div class="modal fade" tabindex="-1" ref="successModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-success fw-bold">
              <i class="bi bi-check-circle-fill me-2"></i>
              Succès
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-building text-success" style="font-size: 3rem;"></i>
            <p class="fs-5 mt-3">
              Université ajoutée avec succès
            </p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button class="btn btn-success px-4" data-bs-dismiss="modal">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR MODAL -->
    <div class="modal fade" tabindex="-1" ref="errorModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Erreur
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
            <p class="fs-5 mt-3">
              {{ errorMessage }}
            </p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button class="btn btn-danger px-4" data-bs-dismiss="modal">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { addUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const router = useRouter()
const submitting = ref(false)
const errorMessage = ref('')

const successModalRef = ref<HTMLElement | null>(null)
const errorModalRef = ref<HTMLElement | null>(null)

let successModal: Modal | null = null
let errorModal: Modal | null = null

const universite = ref<Universite>({
  nomUniversite: '',
  adresse: ''
})

onMounted(() => {
  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value)
  }
  if (errorModalRef.value) {
    errorModal = new Modal(errorModalRef.value)
  }
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    await addUniversite(universite.value)
    successModal?.show()

    // Redirection après fermeture de la modale
    successModalRef.value?.addEventListener('hidden.bs.modal', () => {
      router.push('/universites')
    }, { once: true })

  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || "Erreur lors de l'ajout de l'université"
    errorModal?.show()
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
