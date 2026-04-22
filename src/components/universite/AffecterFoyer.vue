<!-- src/components/universite/AffecterFoyer.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
      <h2 class="text-center fw-bold text-info mb-4">
        <i class="bi bi-building-add me-2"></i>
        Affecter un Foyer
      </h2>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-info"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Université</label>
          <input
            :value="nomUniversite"
            type="text"
            class="form-control bg-light"
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

        <div v-if="foyers.length === 0" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Aucun foyer disponible ! Veuillez d'abord créer un foyer.
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/universites" class="btn btn-outline-secondary">
            Annuler
          </router-link>
          <button
            type="submit"
            class="btn btn-info text-white"
            :disabled="submitting || !idFoyerSelected || foyers.length === 0"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
            {{ submitting ? 'Affectation...' : 'Affecter' }}
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
              Foyer affecté avec succès
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
const errorMessage = ref('')

const successModalRef = ref<HTMLElement | null>(null)
const errorModalRef = ref<HTMLElement | null>(null)

let successModal: Modal | null = null
let errorModal: Modal | null = null

const nomUniversite = ref('')
const foyers = ref<Foyer[]>([])
const idFoyerSelected = ref<number | ''>('')

onMounted(() => {
  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value)
  }
  if (errorModalRef.value) {
    errorModal = new Modal(errorModalRef.value)
  }
  fetchData()
})

const fetchData = async () => {
  try {
    const id = Number(route.params.id)
    const resU = await getUniversiteById(id)
    nomUniversite.value = resU.data.nomUniversite

    const resF = await axios.get<Foyer[]>('http://localhost:8080/foyer/all')
    foyers.value = resF.data
  } catch (err: any) {
    errorMessage.value = 'Erreur de chargement. Vérifiez que le service foyer est disponible.'
    errorModal?.show()
    console.error(err)
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
    successModal?.show()

    successModalRef.value?.addEventListener('hidden.bs.modal', () => {
      router.push('/universites')
    }, { once: true })

  } catch (err: any) {
    const raw: string = err.response?.data?.message || err.response?.data || err.message || ''
    if (
      raw.toLowerCase().includes('duplicate') ||
      raw.toLowerCase().includes('unique') ||
      raw.toLowerCase().includes('constraint')
    ) {
      errorMessage.value = 'Ce foyer est déjà affecté à une autre université. Veuillez en choisir un autre.'
    } else {
      errorMessage.value = "Une erreur est survenue lors de l'affectation. Veuillez réessayer."
    }
    errorModal?.show()
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
