<!-- src/components/universite/UpdateUniversite.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
      <h2 class="text-center fw-bold text-warning mb-4">
        <i class="bi bi-pencil-square me-2"></i>
        Modifier Université
      </h2>

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
          <i class="bi bi-building me-2"></i>
          <small class="text-muted d-block">Foyer actuellement affecté :</small>
          <strong>{{ universite.foyer.nomFoyer }}</strong> ({{ universite.foyer.capaciteFoyer }} places)
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/universites" class="btn btn-outline-secondary">
            Annuler
          </router-link>
          <button type="submit" class="btn btn-warning" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
            {{ submitting ? 'Modification...' : 'Modifier' }}
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
            <i class="bi bi-building-check text-success" style="font-size: 3rem;"></i>
            <p class="fs-5 mt-3">
              Université modifiée avec succès
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
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { getUniversiteById, updateUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
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
  fetchUniversite()
})

const fetchUniversite = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getUniversiteById(id)
    universite.value = res.data
  } catch (err: any) {
    errorMessage.value = 'Erreur de chargement de l\'université'
    errorModal?.show()
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await updateUniversite(universite.value)
    successModal?.show()

    successModalRef.value?.addEventListener('hidden.bs.modal', () => {
      router.push('/universites')
    }, { once: true })

  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erreur lors de la modification'
    errorModal?.show()
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
