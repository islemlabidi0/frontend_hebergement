<template>
  <div class="container mt-4">

    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">

        <h3 class="text-center fw-bold text-primary mb-4">
          Ajouter une Réservation
        </h3>

        <form @submit.prevent="save">

          <!-- CIN Étudiant -->
          <div class="mb-3">
            <label class="form-label fw-semibold">CIN Étudiant</label>
            <input
              v-model="cin"
              type="text"
              class="form-control"
              placeholder="11451202"
            />
          </div>

          <!-- Chambre -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Numéro Chambre</label>
            <input
              v-model="numeroChambre"
              type="number"
              class="form-control"
              placeholder="101"
            />
          </div>

          <!-- Bloc -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Bloc</label>
            <input
              v-model="nomBloc"
              type="text"
              class="form-control"
              placeholder="A / B / C"
            />
          </div>

          <!-- Année universitaire -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Année universitaire</label>
            <input
              v-model="anneeUniversitaire"
              type="text"
              class="form-control"
              placeholder="2025-2026"
            />
          </div>

          <!-- Button -->
          <div class="d-grid">
            <button class="btn btn-primary btn-lg rounded-3">
              + Ajouter Réservation
            </button>
          </div>

        </form>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content rounded-4">

          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold"
                :class="modalType === 'success' ? 'text-success' : 'text-danger'">
              {{ modalType === 'success' ? 'Succès' : 'Erreur' }}
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <p class="fs-5">{{ modalMessage }}</p>
          </div>

          <div class="modal-footer border-0 justify-content-center">
            <button
              class="btn px-4"
              :class="modalType === 'success' ? 'btn-success' : 'btn-danger'"
              data-bs-dismiss="modal"
            >
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
import { useRouter } from "vue-router";

const router = useRouter();

/* FORM */
const cin = ref("");
const numeroChambre = ref<number | null>(null);
const nomBloc = ref("");
const anneeUniversitaire = ref("");

/* MODAL */
const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const modalMessage = ref("");
const modalType = ref<"success" | "error">("success");

/* INIT MODAL */
onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }
});

/* SHOW MODAL */
const showModal = (type: "success" | "error", message: string) => {
  modalType.value = type;
  modalMessage.value = message;
  modalInstance?.show();
};

/* REDIRECTION PROPRE */
const goToReservations = () => {
  router.push("/reservations");
};

/* SAVE */
const save = async () => {
  try {
    const payload = {
      etudiantsCINs: [cin.value],
      numeroChambre: numeroChambre.value,
      nomBloc: nomBloc.value,
      anneeUniversitaire: anneeUniversitaire.value
    };

    const res = await fetch("http://localhost:8080/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      showModal("error", "Erreur lors de l'ajout");
      return;
    }

    showModal("success", "Réservation ajoutée avec succès");

    // ⬇️ redirection après petit delay (UX propre)
    setTimeout(() => {
      modalInstance?.hide();
      goToReservations();
    }, 800);

  } catch (err) {
    showModal("error", "Erreur serveur");
  }
};
</script>