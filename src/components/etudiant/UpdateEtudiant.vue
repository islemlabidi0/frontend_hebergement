<template>
  <div class="container mt-4">

    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">

        <h3 class="text-center text-warning fw-bold mb-4">
          Modifier l’école
        </h3>

        <form @submit.prevent="update">

          <!-- CIN (readonly) -->
          <input v-model="form.cin" class="form-control mb-3" disabled />

          <!-- Nom (readonly) -->
          <input v-model="form.nom" class="form-control mb-3" disabled />

          <!-- Prénom (readonly) -->
          <input v-model="form.prenom" class="form-control mb-3" disabled />

          <!-- Date (readonly) -->
          <input v-model="form.dateNaissance" type="date" class="form-control mb-3" disabled />

          <!-- ONLY editable -->
          <input
            v-model="form.ecole"
            class="form-control mb-4"
            placeholder="École"
          />

          <button class="btn btn-warning w-100">
            Mettre à jour l'école
          </button>

        </form>

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
            Étudiant modifié avec succès
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
import { useRoute, useRouter } from "vue-router";
import { getEtudiant, updateEtudiant } from "../../services/etudiantServices";
import type { Etudiant } from "../../models/Etudiant";
import { Modal } from "bootstrap";

const route = useRoute();
const router = useRouter();

const successModalRef = ref<HTMLElement | null>(null);
let successModal: Modal | null = null;

const form = ref<Etudiant>({
  cin: 0,
  nom: "",
  prenom: "",
  dateNaissance: "",
  ecole: ""
});

// load student
const load = async () => {
  const cin = Number(route.params.cin);
  form.value = await getEtudiant(cin);
};

// update only school
const update = async () => {
  await updateEtudiant(form.value);
  showSuccessModal();
  router.push("/listEtudiants");
};
const showSuccessModal = () => {
  if (successModalRef.value) {
    successModal = new Modal(successModalRef.value);
    successModal.show();
  }
};
onMounted(load);
</script>