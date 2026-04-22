<!-- src/components/universite/getAllUniversites.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 p-4">
      <h2 class="text-center fw-bold text-primary mb-4">
        <i class="bi bi-building me-2"></i>
        Liste des universités
      </h2>

      <div class="d-flex justify-content-end mb-3">
        <router-link to="/universites/add" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          Ajouter Université
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
                <span v-if="u.foyer" class="badge bg-success">
                  <i class="bi bi-check-circle me-1"></i>
                  {{ u.foyer.nomFoyer }}
                </span>
                <span v-else class="badge bg-secondary">
                  <i class="bi bi-dash-circle me-1"></i>
                  Aucun
                </span>
              </td>
              <td>{{ u.foyer?.capaciteFoyer || '-' }}</td>
              <td>
                <router-link
                  :to="`/universites/update/${u.idUniversite}`"
                  class="btn btn-outline-warning btn-sm me-2"
                  title="Modifier"
                >
                  <i class="bi bi-pencil"></i>
                </router-link>
                <router-link
                  v-if="!u.foyer"
                  :to="`/universites/affecter-foyer/${u.idUniversite}`"
                  class="btn btn-outline-info btn-sm me-2"
                  title="Affecter un foyer"
                >
                  <i class="bi bi-building-add"></i>
                </router-link>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="openDeleteModal(u.idUniversite, u.nomUniversite)"
                  title="Supprimer"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="universites.length === 0">
              <td colspan="6" class="text-muted py-4">
                <i class="bi bi-inbox fs-1"></i>
                <p class="mt-2">Aucune université trouvée</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div class="modal fade" tabindex="-1" ref="deleteModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmation
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-building text-danger" style="font-size: 3rem;"></i>
            <p class="fs-5 mt-3">
              Voulez-vous vraiment supprimer l'université <br>
              <strong class="text-danger">{{ universiteToDelete.nom }}</strong> ?
            </p>
            <small class="text-muted">Cette action est irréversible.</small>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">
              Annuler
            </button>
            <button type="button" class="btn btn-danger px-4" @click="confirmDelete" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
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
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-building-check text-success" style="font-size: 3rem;"></i>
            <p class="fs-5 mt-3">
              Université supprimée avec succès
            </p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-success px-4" data-bs-dismiss="modal">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR MODAL - AMÉLIORÉ -->
    <div class="modal fade" tabindex="-1" ref="errorModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-danger">
          <div class="modal-header border-0 bg-danger bg-opacity-10">
            <h5 class="modal-title text-danger fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Suppression impossible
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body py-4">
            <div class="text-center mb-3">
              <i class="bi bi-people-fill text-danger" style="font-size: 3rem;"></i>
            </div>
            <p class="fs-6 mb-2">
              <i class="bi bi-info-circle-fill text-primary me-2"></i>
              {{ errorMessage }}
            </p>
            <div class="alert alert-warning mt-3">
              <i class="bi bi-lightbulb-fill me-2"></i>
              <strong>Suggestion :</strong> Supprimez ou réaffectez d'abord les étudiants de cette université.
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
              Annuler
            </button>
            <button type="button" class="btn btn-primary px-4" @click="goToEtudiants">
              <i class="bi bi-people me-2"></i>
              Voir les étudiants
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
import { getAllUniversites, deleteUniversite } from '../../services/universiteServices'
import type { Universite } from '../../models/Universite'

const router = useRouter()
const universites = ref<Universite[]>([])
const loading = ref(false)
const deleting = ref(false)
const errorMessage = ref('')

const deleteModalRef = ref<HTMLElement | null>(null)
const successModalRef = ref<HTMLElement | null>(null)
const errorModalRef = ref<HTMLElement | null>(null)

let deleteModal: Modal | null = null
let successModal: Modal | null = null
let errorModal: Modal | null = null

const universiteToDelete = ref({ id: 0, nom: '' })

onMounted(() => {
  if (deleteModalRef.value) {
    deleteModal = new Modal(deleteModalRef.value)
  }
  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value)
  }
  if (errorModalRef.value) {
    errorModal = new Modal(errorModalRef.value)
  }
  fetchData()
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAllUniversites()
    universites.value = res.data
  } catch (err: any) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openDeleteModal = (id: number | undefined, nom: string) => {
  if (!id) return
  universiteToDelete.value = { id, nom }
  deleteModal?.show()
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await deleteUniversite(universiteToDelete.value.id)
    deleteModal?.hide()
    await fetchData()
    successModal?.show()
  } catch (err: any) {
    deleteModal?.hide()

    // Message personnalisé selon l'erreur
    if (err.response?.status === 409 || err.message?.includes('foreign key')) {
      errorMessage.value = "Cette université ne peut pas être supprimée car des étudiants y sont actuellement inscrits."
    } else {
      errorMessage.value = err.response?.data?.message || "Une erreur est survenue lors de la suppression."
    }

    errorModal?.show()
    console.error(err)
  } finally {
    deleting.value = false
  }
}

const goToEtudiants = () => {
  errorModal?.hide()
  router.push('/listEtudiants')
}
</script>
