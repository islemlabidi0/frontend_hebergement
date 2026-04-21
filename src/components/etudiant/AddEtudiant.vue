<template>
  <div class="container mt-4">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">

        <h3 class="mb-4 text-center fw-bold text-primary">
          Ajouter un Étudiant
        </h3>

        <form @submit.prevent="save">

          <!-- CIN -->
          <div class="mb-3">
            <label class="form-label fw-semibold">CIN</label>
            <input
              v-model="form.cin"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': cinError }"
              placeholder="8 chiffres"
              maxlength="8"
              inputmode="numeric"
            />
            <div class="invalid-feedback">
              {{ cinError }}
            </div>
          </div>

          <!-- Nom + Prenom -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Nom</label>
              <input
                v-model="form.nom"
                class="form-control"
                placeholder="Nom"
                required
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Prénom</label>
              <input
                v-model="form.prenom"
                class="form-control"
                placeholder="Prénom"
                required
              />
            </div>
          </div>

          <!-- Date -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Date de naissance</label>
            <input
              v-model="form.dateNaissance"
              type="date"
              class="form-control"
              required
            />
          </div>

          <!-- École -->
          <div class="mb-4">
            <select v-model="form.universite" class="form-control" required>
              <option disabled value="">-- Choisir une université --</option>

              <option
                v-for="u in universites"
                :key="u.idUniversite"
                :value="u"
              >
                {{ u.nomUniversite }}
              </option>
            </select>
          </div>

          <!-- Button -->
          <div class="d-grid">
            <button class="btn btn-primary btn-lg rounded-3">
              + Ajouter
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
            <h5 class="modal-title fw-bold" :class="modalType === 'success' ? 'text-success' : 'text-danger'">
              {{ modalType === 'success' ? 'Succès' : 'Erreur' }}
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <p class="fs-5">
              {{ modalMessage }}
            </p>
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
import { ref, watch, onMounted } from "vue";
import { createEtudiant } from "../../services/etudiantServices";
import type { Etudiant } from "../../models/Etudiant";
import { useRouter } from "vue-router";

import { Modal } from "bootstrap";
import { getAllUniversites } from "../../services/universiteServices";
import type { Universite } from "@/models/Universite";

const router = useRouter();

// emit
const emit = defineEmits<{
  (e: "refresh"): void;
}>();

// universités list
const universites = ref<Universite[]>([]);

// form
const form = ref<Etudiant>({
  cin: 0,
  nom: "",
  prenom: "",
  dateNaissance: "",
  universite: undefined
});

// CIN error
const cinError = ref("");

// modal
const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const modalMessage = ref("");
const modalType = ref<"success" | "error">("success");

// INIT
onMounted(async () => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }

  const res = await getAllUniversites();
  universites.value = res.data;
});

// CIN validation
const validateCin = (): boolean => {
  const cinStr = String(form.value.cin);

  if (!/^\d{8}$/.test(cinStr)) {
    cinError.value = "Le CIN doit contenir exactement 8 chiffres";
    return false;
  }

  cinError.value = "";
  return true;
};

// live CIN check
watch(
  () => form.value.cin,
  (value) => {
    const cinStr = String(value);

    if (cinStr.length === 0) {
      cinError.value = "";
    } else if (!/^\d{0,8}$/.test(cinStr)) {
      cinError.value = "Seulement des chiffres";
    } else {
      cinError.value = "";
    }
  }
);

// modal
const showModal = (type: "success" | "error", message: string) => {
  modalType.value = type;
  modalMessage.value = message;

  modalInstance?.show();

  router.push("/listEtudiants");
};

// save
const save = async () => {
  if (!validateCin()) return;

  if (!form.value.universite) {
    showModal("error", "Veuillez choisir une université");
    return;
  }

  try {
    const res = await createEtudiant(form.value);

    if (!res.ok) {
      const msg = await res.text();
      showModal("error", msg);
      return;
    }

    reset();
    emit("refresh");

    showModal("success", "Étudiant ajouté avec succès");
  } catch (error) {
    showModal("error", "Erreur serveur");
  }
};

// reset
const reset = () => {
  form.value = {
    cin: 0,
    nom: "",
    prenom: "",
    dateNaissance: "",
    universite: undefined
  };
};
</script>