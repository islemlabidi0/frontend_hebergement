<template>
  <div class="container mt-4">

    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">

        <!-- TITLE -->
        <h2 class="text-center fw-bold text-primary mb-4">
          Liste des réservations
        </h2>

        <!-- ADD BUTTON -->
        <div class="text-end mb-4">
          <router-link to="/reservations/add" class="btn btn-primary rounded-3">
            + Ajouter Réservation
          </router-link>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>

        <!-- EMPTY -->
        <div v-else-if="reservations.length === 0" class="text-center text-muted py-4">
          Aucune réservation trouvée
        </div>

        <!-- TABLE -->
        <div v-else class="table-responsive">

          <table class="table table-hover align-middle">

            <thead class="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Étudiants</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody class="text-center">

              <tr v-for="r in reservations" :key="r.idReservation">

                <td class="fw-bold">{{ r.idReservation }}</td>

                <td>{{ formatDate(r.dateReservation) }}</td>

                <td>
                  <span class="badge"
                        :class="r.estValide ? 'bg-success' : 'bg-danger'">
                    {{ r.estValide ? 'Valide' : 'Non valide' }}
                  </span>
                </td>

                <td>
                  <div class="d-flex flex-wrap justify-content-center gap-1">
                    <span
                      v-for="e in r.etudiants"
                      :key="e.cin"
                      class="badge bg-light text-dark border"
                    >
                      {{ e.nom }} {{ e.prenom }}
                    </span>
                  </div>
                </td>

                <td>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="openDeleteModal(r.idReservation)"
                  >
                    Annuler
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
              Voulez-vous vraiment annuler cette réservation ?
            </p>
          </div>

          <div class="modal-footer border-0 justify-content-center">

            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Annuler
            </button>

            <button class="btn btn-danger" @click="confirmDelete">
              Confirmer
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
              Réservation annulée avec succès
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
import { Modal } from "bootstrap";

/* ---------------- TYPES ---------------- */
interface Etudiant {
  cin: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface Reservation {
  idReservation: string;
  dateReservation: string;
  estValide: boolean;
  etudiants: Etudiant[];
}

/* ---------------- STATE ---------------- */
const reservations = ref<Reservation[]>([]);
const loading = ref(false);

/* ---------------- MODALS ---------------- */
const deleteModalRef = ref<HTMLElement | null>(null);
const successModalRef = ref<HTMLElement | null>(null);

let deleteModal: Modal | null = null;
let successModal: Modal | null = null;

const selectedId = ref<string | null>(null);

/* ---------------- LOAD ---------------- */
const load = async () => {
  loading.value = true;

  try {
    const res = await fetch("http://localhost:8080/reservations");
    reservations.value = await res.json();
  } finally {
    loading.value = false;
  }
};

/* ---------------- OPEN DELETE ---------------- */
const openDeleteModal = (id: string) => {
  selectedId.value = id;
  deleteModal?.show();
};

/* ---------------- CONFIRM DELETE ---------------- */
const confirmDelete = async () => {
  if (!selectedId.value) return;

  try {
    const res = await fetch(
      `http://localhost:8080/reservations/annuler/${selectedId.value}`,
      { method: "DELETE" }
    );

    if (!res.ok) return;

    deleteModal?.hide();
    await load();
    successModal?.show();

  } catch (err) {
    console.error(err);
  }
};

/* ---------------- FORMAT DATE ---------------- */
const formatDate = (date: string) => {
  return date ? date.split("T")[0] : "";
};

/* ---------------- INIT ---------------- */
onMounted(() => {
  if (deleteModalRef.value) deleteModal = new Modal(deleteModalRef.value);
  if (successModalRef.value) successModal = new Modal(successModalRef.value);

  load();
});
</script>