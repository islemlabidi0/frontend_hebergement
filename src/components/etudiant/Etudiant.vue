<template>
  <div class="container mt-4">
    <EtudiantForm :selected="selected" @refresh="reload" />
    <EtudiantList ref="list" @edit="editEtudiant" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import EtudiantForm from "./AddEtudiant.vue";

import type { Etudiant } from "../../models/Etudiant";

const selected = ref<Etudiant | null>(null);

// edit handler
const editEtudiant = (e: Etudiant) => {
  selected.value = e;
};

// call child method via ref
const listRef = ref<any>(null);

const reload = () => {
  listRef.value?.load();
};
</script>