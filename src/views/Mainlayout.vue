<template>
  <div class="main-layout">
    <Navbar />
    <main class="layout-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/shared/Navbar.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f4f8;
}

.layout-content {
  flex: 1;
}
</style>