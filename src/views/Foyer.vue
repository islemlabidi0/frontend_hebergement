<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAllFoyers,
  addFoyer,
  updateFoyer,
  deleteFoyer,
  type Foyer,
} from "@/services/foyerService";

const foyers = ref<Foyer[]>([]);

const form = ref<Foyer>({
  nomFoyer: "",
  capaciteFoyer: 0,
});

const isEditing = ref(false);

const loadFoyers = async () => {
  const res = await getAllFoyers();
  foyers.value = res.data;
};

const submitForm = async () => {
  if (!form.value.nomFoyer || form.value.capaciteFoyer <= 0) {
    alert("Veuillez remplir correctement les champs");
    return;
  }

  if (isEditing.value) {
    await updateFoyer(form.value);
  } else {
    await addFoyer(form.value);
  }

  resetForm();
  loadFoyers();
};

const editFoyer = (foyer: Foyer) => {
  form.value = { ...foyer };
  isEditing.value = true;
};

const removeFoyer = async (id?: number) => {
  if (!id) return;

  if (confirm("Supprimer ce foyer ?")) {
    await deleteFoyer(id);
    loadFoyers();
  }
};

const resetForm = () => {
  form.value = { nomFoyer: "", capaciteFoyer: 0 };
  isEditing.value = false;
};

onMounted(loadFoyers);
</script>

<template>
  <div class="container py-4">

    <h2 class="text-center foyer-title mb-4">
      🏫 Gestion des foyers universitaires
    </h2>

    <div class="foyer-card p-4 mb-4">
      <h5 class="mb-3">
        {{ isEditing ? "Modifier un foyer" : "Ajouter un foyer" }}
      </h5>

      <div class="row g-2">
        <div class="col-md-6">
          <input
            v-model="form.nomFoyer"
            placeholder="Nom du foyer"
            class="form-control foyer-input"
          />
        </div>

        <div class="col-md-4">
          <input
            v-model="form.capaciteFoyer"
            type="number"
            placeholder="Capacité"
            class="form-control foyer-input"
          />
        </div>

        <div class="col-md-2">
          <button class="btn btn-foyer w-100" @click="submitForm">
            {{ isEditing ? "Enregistrer" : "Ajouter" }}
          </button>
        </div>
      </div>

      <button
        v-if="isEditing"
        class="btn btn-soft btn-sm mt-2"
        @click="resetForm"
      >
        Annuler
      </button>
    </div>

    <div class="foyer-card p-4">
      <h5 class="mb-3">Liste des foyers</h5>

      <table class="table table-borderless">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Capacité</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="f in foyers" :key="f.idFoyer">
            <td>{{ f.nomFoyer }}</td>
            <td>{{ f.capaciteFoyer }}</td>
            <td>
              <button class="btn btn-soft btn-sm me-2" @click="editFoyer(f)">
                ✏️
              </button>
              <button class="btn btn-danger btn-sm" @click="removeFoyer(f.idFoyer)">
                🗑
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="foyers.length === 0" class="text-center empty-state">
        Aucun foyer disponible
      </div>
    </div>

  </div>
</template>