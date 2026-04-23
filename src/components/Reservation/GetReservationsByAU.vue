<template>
  <div class="container mt-5">

    <div class="card shadow-lg rounded-4">
      <div class="card-body p-4">

        <h3 class="text-center text-primary mb-4">
          Réservations par période
        </h3>

        <!-- DATE DEBUT -->
        <div class="mb-3">
          <label class="form-label">Date début</label>
          <input
            v-model="debut"
            type="date"
            class="form-control"
          />
        </div>

        <!-- DATE FIN -->
        <div class="mb-3">
          <label class="form-label">Date fin</label>
          <input
            v-model="fin"
            type="date"
            class="form-control"
          />
        </div>

        <!-- BUTTON -->
        <button
          class="btn btn-primary w-100"
          :disabled="!isValid"
          @click="fetchReservations"
        >
          Rechercher
        </button>

      </div>
    </div>

    <!-- RESULTS -->
    <div v-if="searched" class="mt-4">

      <div
        v-for="r in reservations"
        :key="r.idReservation"
        class="card mt-3 shadow-sm"
      >
        <div class="card-body">

          <h5 class="text-primary">
            {{ r.idReservation }}
          </h5>

          <p><strong>Date de réservation:</strong> {{ r.dateReservation }}</p>

          <p>
            <strong>Étudiants :</strong>
            <span v-for="e in r.etudiants" :key="e.cin">
              {{ e.nom }} {{ e.prenom }}
            </span>
          </p>

        </div>
      </div>

      <p v-if="reservations.length === 0" class="text-center text-muted mt-3">
        Aucune réservation trouvée
      </p>

    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";

interface Reservation {
  idReservation: string;
  dateReservation: string;
  chambre: {
    numeroChambre: number;
    bloc: {
      nomBloc: string;
    };
  };
  etudiants: {
    cin: string;
    nom: string;
    prenom: string;
  }[];
}

const debut = ref("");
const fin = ref("");
const reservations = ref<Reservation[]>([]);
const searched = ref(false);

/* ---------------- VALIDATION ---------------- */
const isValid = computed(() => {
  return debut.value !== "" && fin.value !== "" && debut.value <= fin.value;
});

/* ---------------- FETCH ---------------- */
const fetchReservations = async () => {
  try {
    const url = `http://localhost:8080/reservations/periode?debut=${debut.value}&fin=${fin.value}`;

    const res = await fetch(url);

    if (!res.ok) {
      reservations.value = [];
      searched.value = true;
      return;
    }

    reservations.value = await res.json();
    searched.value = true;

  } catch (err) {
    console.error(err);
    reservations.value = [];
    searched.value = true;
  }
};
</script>