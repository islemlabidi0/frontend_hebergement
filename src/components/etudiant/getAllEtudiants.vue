<template>
  <div class="container mt-4">

    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">

        <!-- Title -->
        <h2 class="text-center fw-bold text-primary mb-4">
          Liste des étudiants
        </h2>

<div class="text-end mb-4">
  <router-link to="etudiants/create" class="btn btn-primary rounded-3">
    + Ajouter Étudiant
  </router-link>
</div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="etudiants.length === 0" class="text-center text-muted py-4">
          Aucun étudiant trouvé
        </div>

        <!-- Table -->
        <div v-else class="table-responsive">

          <table class="table table-hover align-middle">

            <thead class="table-primary text-center">
              <tr>
                <th>CIN</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date</th>
                <th>École</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody class="text-center">

              <tr v-for="e in etudiants" :key="e.cin">

                <td class="fw-bold">{{ e.cin }}</td>
                <td>{{ e.nom }}</td>
                <td>{{ e.prenom }}</td>
                <td>{{ formatDate(e.dateNaissance) }}</td>
                <td>{{ e.ecole }}</td>

                <td>

                  <router-link
                    :to="`/etudiants/edit/${e.cin}`"
                    class="btn btn-outline-warning btn-sm me-2"
                  >
                    Modifier
                  </router-link>

                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="openDeleteModal(e.cin)"
                  >
                    Supprimer
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </div>

    <!-- DELETE MODAL -->
    <div class="modal fade" tabindex="-1" ref="deleteModalRef">
      <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content rounded-4">

          <div class="modal-header border-0">
            <h5 class="modal-title text-danger fw-bold">
              Confirmation
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <p class="fs-5">
              Voulez-vous vraiment supprimer cet étudiant ?
            </p>
          </div>

          <div class="modal-footer border-0 justify-content-center">

            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Annuler
            </button>

            <button class="btn btn-danger" @click="confirmDelete">
              Supprimer
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
              Succès
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <p class="fs-5">
              Étudiant supprimé avec succès
            </p>
          </div>

          <div class="modal-footer border-0 justify-content-center">
            <button class="btn btn-success" data-bs-dismiss="modal">
              OK
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllEtudiants, deleteEtudiant } from "../../services/etudiantServices";
import type { Etudiant } from "../../models/Etudiant";
import { Modal } from "bootstrap";

const etudiants = ref<Etudiant[]>([]);
const loading = ref(false);

// modal
const deleteModalRef = ref<HTMLElement | null>(null);
const selectedCin = ref<number | null>(null);
let modalInstance: Modal | null = null;

const successModalRef = ref<HTMLElement | null>(null);
let successModal: Modal | null = null;

// load
const load = async () => {
  try {
    loading.value = true;
    etudiants.value = await getAllEtudiants();
  } finally {
    loading.value = false;
  }
};

// open modal
const openDeleteModal = (cin: number) => {
  selectedCin.value = cin;
  modalInstance?.show();
};

// confirm delete
const confirmDelete = async () => {
  if (selectedCin.value === null) return;

  try {
    const res = await deleteEtudiant(selectedCin.value);

    if (!res.ok) {
      console.error("Delete failed");
      return;
    }

    modalInstance?.hide();
    await load();
    successModal?.show();

    selectedCin.value = null;

  } catch (error) {
    console.error("Error deleting:", error);
  }
};

// format date
const formatDate = (date: string) => {
  return date ? date.split("T")[0] : "";
};
const showSuccessModal = () => {
  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value);
    successModal.show();
  }
};
onMounted(() => {
  if (deleteModalRef.value) {
    modalInstance = new Modal(deleteModalRef.value);
  }

  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value);
  }

  load();
});
</script>