<template>
  <div class="container mt-5">
    <div class="card shadow-lg rounded-4">
      <div class="card-body p-4">

        <h3 class="text-center text-primary mb-4">
          Ajouter une réservation
        </h3>

        <form @submit.prevent="addReservation">

          <!-- Année universitaire -->
          <div class="mb-3">
            <label class="form-label">Année universitaire</label>

            <input
              v-model="form.anneeUniversitaire"
              type="text"
              class="form-control"
              placeholder="2025-2026"
            />

            <small v-if="errors.anneeUniversitaire" class="text-danger">
              {{ errors.anneeUniversitaire }}
            </small>
          </div>

          <!-- Bloc -->
          <div class="mb-3">
            <label class="form-label">Bloc</label>

            <select v-model="form.nomBloc" class="form-select">
              <option disabled value="">Choisir un bloc</option>
              <option v-for="b in blocs" :key="b.nomBloc" :value="b.nomBloc">
                {{ b.nomBloc }}
              </option>
            </select>

            <small v-if="errors.nomBloc" class="text-danger">
              {{ errors.nomBloc }}
            </small>
          </div>

          <!-- Chambre -->
          <div class="mb-3">
            <label class="form-label">Chambre</label>

            <select
              v-model.number="form.numeroChambre"
              class="form-select"
              :disabled="loadingChambres || chambres.length === 0"
            >
              <option disabled value="">
                {{ loadingChambres ? "Chargement..." : "Choisir une chambre" }}
              </option>

              <option
                v-for="c in chambres"
                :key="c.numeroChambre"
                :value="c.numeroChambre"
              >
                Chambre {{ c.numeroChambre }}
              </option>
            </select>

            <small v-if="errors.numeroChambre" class="text-danger">
              {{ errors.numeroChambre }}
            </small>
          </div>

          <!-- Étudiants -->
          <div class="mb-3">
            <label class="form-label">Étudiants</label>

            <select
              v-model="form.etudiantsCINs"
              multiple
              class="form-select"
            >
              <option v-for="e in etudiants" :key="e.cin" :value="e.cin">
                {{ e.nom }} {{ e.prenom }} ({{ e.cin }})
              </option>
            </select>

            <small v-if="errors.etudiantsCINs" class="text-danger">
              {{ errors.etudiantsCINs }}
            </small>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn btn-success w-100 mt-3"
            :disabled="!isValid"
          >
            Ajouter
          </button>

        </form>
        <!-- MODAL -->
<!-- MODAL -->
<div
  class="modal fade"
  tabindex="-1"
  aria-hidden="true"
  ref="modalRef"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header" :class="modalTypeClass">
        <h5 class="modal-title">
          {{ modalTitle }}
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
        ></button>
      </div>

      <div class="modal-body">
        <p class="mb-0">{{ modalMessage }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">
          Fermer
        </button>
      </div>

    </div>
  </div>
</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { Modal } from "bootstrap";
interface Bloc {
  idBloc: number;
  nomBloc: string;
}

interface Chambre {
  numeroChambre: number;
  type: string;
}

interface Etudiant {
  cin: string;
  nom: string;
  prenom: string;
}

/* ---------------- FORM ---------------- */
const form = reactive({
  anneeUniversitaire: "",
  nomBloc: "",
  numeroChambre: null as number | null,
  etudiantsCINs: [] as string[],
});

/* ---------------- ERRORS ---------------- */
const errors = reactive({
  anneeUniversitaire: "",
  nomBloc: "",
  numeroChambre: "",
  etudiantsCINs: "",
});

/* ---------------- VALIDATION ---------------- */
const validateForm = (): boolean => {
  let valid = true;

  errors.anneeUniversitaire = "";
  errors.nomBloc = "";
  errors.numeroChambre = "";
  errors.etudiantsCINs = "";

  // DATE
  if (!form.anneeUniversitaire) {
    errors.anneeUniversitaire = "Année universitaire obligatoire";
    valid = false;
  } else if (!isValidYear(form.anneeUniversitaire)) {
    errors.anneeUniversitaire =
      "Format invalide (ex: 2025-2026, année consécutive requise)";
    valid = false;
  }

  // Bloc
  if (!form.nomBloc) {
    errors.nomBloc = "Bloc obligatoire";
    valid = false;
  }

  // Chambre
  if (form.numeroChambre === null) {
    errors.numeroChambre = "Chambre obligatoire";
    valid = false;
  }

  // Étudiants
  if (form.etudiantsCINs.length === 0) {
    errors.etudiantsCINs = "Choisir au moins un étudiant";
    valid = false;
  }

  return valid;
};

/* ---------------- DATA ---------------- */
const blocs = ref<Bloc[]>([]);
const chambres = ref<Chambre[]>([]);
const etudiants = ref<Etudiant[]>([]);
const loadingChambres = ref(false);

/* ---------------- MODAL ---------------- */
const modalRef = ref<HTMLDivElement | null>(null);
const modalTitle = ref("");
const modalMessage = ref("");
const modalType = ref<"success" | "error">("success");

const showModal = (type: "success" | "error", message: string) => {
  modalType.value = type;
  modalTitle.value = type === "success" ? "Succès" : "Erreur";
  modalMessage.value = message;

  if (!modalRef.value) return;

  const modal = new Modal(modalRef.value);
  modal.show();
};
const modalTypeClass = computed(() =>
  modalType.value === "success"
    ? "bg-success text-white"
    : "bg-danger text-white"
);
const closeModal = () => {
  if (!modalRef.value) return;

  const modal = Modal.getInstance(modalRef.value);
  modal?.hide();
};
const isValidYear = (value: string): boolean => {
  const match = value.match(/^(\d{4})-(\d{4})$/);

  if (!match) return false;

  const start = Number(match[1]);
  const end = Number(match[2]);

  return end === start + 1;
};
const isValid = computed(() => {
  return (
    isValidYear(form.anneeUniversitaire) &&
    form.nomBloc.trim() !== "" &&
    form.numeroChambre !== null &&
    form.etudiantsCINs.length > 0
  );
});

/* ---------------- API ---------------- */
const fetchBlocs = async () => {
  const res = await fetch("http://localhost:8080/api/blocs");
  blocs.value = await res.json();
};

const fetchChambresByBloc = async (bloc: string) => {
  loadingChambres.value = true;

  const res = await fetch(
    `http://localhost:8080/api/chambres/bloc/${bloc}`
  );

  chambres.value = await res.json();
  loadingChambres.value = false;
};

const fetchEtudiants = async () => {
  const res = await fetch("http://localhost:8080/etudiant/");
  etudiants.value = await res.json();
};

/* ---------------- WATCH ---------------- */
watch(
  () => form.nomBloc,
  (newBloc) => {
    form.numeroChambre = null;
    chambres.value = [];

    if (newBloc) fetchChambresByBloc(newBloc);
  }
);

/* ---------------- INIT ---------------- */
onMounted(() => {
  fetchBlocs();
  fetchEtudiants();
});

/* ---------------- SUBMIT ---------------- */
const addReservation = async () => {
  if (!validateForm()) {
    showModal("error", "Veuillez corriger les erreurs du formulaire");
    return;
  }

  try {
    const payload = {
      anneeUniversitaire: form.anneeUniversitaire,
      nomBloc: form.nomBloc,
      numeroChambre: form.numeroChambre,
      etudiantsCINs: form.etudiantsCINs,
    };

    const res = await fetch("http://localhost:8080/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      showModal("error", error.message || "Erreur lors de l'ajout");
      return;
    }

    showModal("success", "Réservation ajoutée avec succès");

    // reset
    form.anneeUniversitaire = "";
    form.nomBloc = "";
    form.numeroChambre = null;
    form.etudiantsCINs = [];
  } catch (err) {
    console.error(err);
    showModal("error", "Erreur serveur");
  }
};
</script>