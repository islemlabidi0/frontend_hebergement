<template>
  <div class="container py-4">

    <!-- TITLE -->
    <h2 class="text-center foyer-title mb-4">
      <i class="bi bi-buildings-fill me-2"></i>Gestion des Foyers
    </h2>

    <!-- FORM CARD -->
    <div class="foyer-card p-4 mb-4">
      <h5 class="mb-3 fw-semibold">
        <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2 text-primary"></i>
        {{ isEditing ? 'Modifier un foyer' : 'Ajouter un foyer' }}
      </h5>

      <div class="row g-2 align-items-end">
        <div class="col-md-5">
          <label class="form-label fw-semibold small">Nom du foyer</label>
          <input
            v-model="form.nomFoyer"
            placeholder="Ex: Foyer El Amal"
            class="form-control foyer-input"
            :class="{ 'is-invalid': formError }"
          />
          <div class="invalid-feedback">{{ formError }}</div>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold small">Capacité</label>
          <input
            v-model.number="form.capaciteFoyer"
            type="number"
            min="1"
            placeholder="Ex: 200"
            class="form-control foyer-input"
          />
        </div>

        <div class="col-md-3 d-flex gap-2">
          <button
            class="btn btn-foyer w-100"
            @click="submitForm"
            :disabled="submitting"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
            {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
          </button>
          <button v-if="isEditing" class="btn btn-soft" @click="resetForm">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Feedback messages -->
      <div v-if="successMessage" class="alert alert-success mt-3 mb-0 py-2">
        <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0 py-2">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
      </div>
    </div>

    <!-- SEARCH + LIST CARD -->
    <div class="foyer-card p-4">

      <!-- Search bar -->
      <div class="input-group mb-4">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input
          v-model="searchKeyword"
          type="text"
          class="form-control border-start-0 ps-0"
          placeholder="Rechercher un foyer par nom..."
          @input="onSearch"
        />
        <button v-if="searchKeyword" class="btn btn-outline-secondary" @click="clearSearch">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- List header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0 fw-semibold">
          Liste des foyers
          <span class="badge bg-primary ms-2">{{ foyers.length }}</span>
        </h5>
        <button class="btn btn-soft btn-sm" @click="loadFoyers">
          <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="foyers.length === 0" class="text-center empty-state">
        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
        {{ searchKeyword ? `Aucun résultat pour "${searchKeyword}"` : 'Aucun foyer disponible' }}
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="table table-borderless table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Capacité</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in foyers" :key="f.idFoyer">
              <td class="text-muted small">#{{ f.idFoyer }}</td>
              <td class="fw-semibold">{{ f.nomFoyer }}</td>
              <td>
                <span class="badge-capacity">
                  <i class="bi bi-people-fill me-1"></i>{{ f.capaciteFoyer }} places
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-soft btn-sm me-2" @click="editFoyer(f)">
                  <i class="bi bi-pencil me-1"></i>Modifier
                </button>
                <button class="btn btn-danger btn-sm" @click="openDeleteModal(f)">
                  <i class="bi bi-trash me-1"></i>Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- DELETE MODAL -->
    <div class="modal fade" tabindex="-1" ref="deleteModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger fw-bold">Confirmation</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <p class="fs-5">
              Voulez-vous vraiment supprimer <strong>{{ pendingDelete?.nomFoyer }}</strong> ?
            </p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button class="btn btn-danger" @click="confirmDelete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import {
  getAllFoyers,
  searchFoyers,
  addFoyer,
  updateFoyer,
  deleteFoyer,
  type Foyer
} from '@/services/foyerService'

const foyers = ref<Foyer[]>([])
const loading = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const searchKeyword = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const formError = ref('')
const pendingDelete = ref<Foyer | null>(null)

const deleteModalRef = ref<HTMLElement | null>(null)
let deleteModal: Modal | null = null

const form = ref<Foyer>({ nomFoyer: '', capaciteFoyer: 0 })

onMounted(() => {
  loadFoyers()
  if (deleteModalRef.value) deleteModal = new Modal(deleteModalRef.value)
})

// ── Load ──
const loadFoyers = async () => {
  loading.value = true
  try {
    const res = await getAllFoyers()
    foyers.value = res.data
  } catch {
    showError('Impossible de charger les foyers.')
  } finally {
    loading.value = false
  }
}

// ── Search (debounced) ──
let searchTimeout: ReturnType<typeof setTimeout>
const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (!searchKeyword.value.trim()) { loadFoyers(); return }
    loading.value = true
    try {
      const res = await searchFoyers(searchKeyword.value)
      foyers.value = res.data
    } catch {
      showError('Erreur lors de la recherche.')
    } finally {
      loading.value = false
    }
  }, 300)
}

const clearSearch = () => {
  searchKeyword.value = ''
  loadFoyers()
}

// ── Submit (add or update) ──
const submitForm = async () => {
  formError.value = ''
  if (!form.value.nomFoyer.trim()) { formError.value = 'Le nom est obligatoire.'; return }
  if (!form.value.capaciteFoyer || form.value.capaciteFoyer <= 0) {
    showError('La capacité doit être supérieure à 0.')
    return
  }

  submitting.value = true
  clearMessages()
  try {
    if (isEditing.value) {
      const res = await updateFoyer(form.value)
      const idx = foyers.value.findIndex(f => f.idFoyer === res.data.idFoyer)
      if (idx !== -1) foyers.value[idx] = res.data
      showSuccess(`Foyer "${res.data.nomFoyer}" modifié avec succès.`)
    } else {
      const res = await addFoyer(form.value)
      foyers.value.unshift(res.data)
      showSuccess(`Foyer "${res.data.nomFoyer}" ajouté avec succès.`)
    }
    resetForm()
  } catch (err: any) {
    // 409 = duplicate name from backend
    const msg = err.response?.data || (isEditing.value ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.')
    showError(msg)
  } finally {
    submitting.value = false
  }
}

// ── Edit ──
const editFoyer = (foyer: Foyer) => {
  form.value = { ...foyer }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetForm = () => {
  form.value = { nomFoyer: '', capaciteFoyer: 0 }
  isEditing.value = false
  formError.value = ''
  clearMessages()
}

// ── Delete ──
const openDeleteModal = (foyer: Foyer) => {
  pendingDelete.value = foyer
  deleteModal?.show()
}

const confirmDelete = async () => {
  if (!pendingDelete.value?.idFoyer) return
  deleteModal?.hide()
  try {
    await deleteFoyer(pendingDelete.value.idFoyer)
    foyers.value = foyers.value.filter(f => f.idFoyer !== pendingDelete.value!.idFoyer)
    showSuccess('Foyer supprimé avec succès.')
  } catch {
    showError('Erreur lors de la suppression.')
  } finally {
    pendingDelete.value = null
  }
}

// ── Helpers ──
const showSuccess = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => successMessage.value = '', 3000)
}
const showError = (msg: string) => {
  errorMessage.value = msg
  setTimeout(() => errorMessage.value = '', 5000)
}
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}
</script>
