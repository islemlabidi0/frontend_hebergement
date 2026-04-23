<template>
  <nav class="admin-navbar">
    <div class="container-fluid px-4">

      <!-- Brand -->
      <router-link to="/dashboard" class="navbar-brand-link">
        <div class="brand-icon"><i class="bi bi-building-fill"></i></div>
        <div class="brand-text">
          <span class="brand-name">HebergU</span>
          <span class="brand-sub">Administration</span>
        </div>
      </router-link>

      <!-- Nav Links (desktop) -->
      <div class="navbar-links">
        <router-link to="/listEtudiants" class="nav-link-item" active-class="active">
          <i class="bi bi-mortarboard-fill"></i>
          <span>Etudiants</span>
        </router-link>
        <router-link to="/universites" class="nav-link-item" active-class="active">
          <i class="bi bi-bank2"></i>
          <span>Universites</span>
        </router-link>
        <router-link to="/foyers" class="nav-link-item" active-class="active">
          <i class="bi bi-buildings-fill"></i>
          <span>Foyers</span>
        </router-link>
        <router-link to="/blocs" class="nav-link-item" active-class="active">
          <i class="bi bi-grid-3x3-gap-fill"></i>
          <span>Blocs</span>
        </router-link>
          <router-link to="/reservations" class="nav-link-item" active-class="active">
          <i class="bi bi-grid-3x3-gap-fill"></i>
          <span>Réservations</span>
        </router-link>
      </div>

      <!-- Right actions -->
      <div class="navbar-right">
        <router-link to="/dashboard" class="btn-dashboard">
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </router-link>

        <!-- Mobile toggle -->
        <button class="mobile-toggle" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ open: menuOpen }" @click.self="menuOpen = false">
      <div class="mobile-menu-inner">
        <router-link to="/listEtudiants" class="mobile-link" @click="menuOpen = false">
          <i class="bi bi-mortarboard-fill"></i> Etudiants
        </router-link>
        <router-link to="/universites" class="mobile-link" @click="menuOpen = false">
          <i class="bi bi-bank2"></i> Universites
        </router-link>
        <router-link to="/foyers" class="mobile-link" @click="menuOpen = false">
          <i class="bi bi-buildings-fill"></i> Foyers
        </router-link>
        <router-link to="/blocs" class="mobile-link" @click="menuOpen = false">
          <i class="bi bi-grid-3x3-gap-fill"></i> Blocs
        </router-link>
        <div class="mobile-divider"></div>
        <router-link to="/dashboard" class="mobile-link dashboard" @click="menuOpen = false">
          <i class="bi bi-speedometer2"></i> Dashboard
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()
watch(route, () => { menuOpen.value = false })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Navbar shell ─────────────────────────── */
.admin-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.admin-navbar > .container-fluid {
  height: 62px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Brand ────────────────────────────────── */
.navbar-brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-right: 8px;
  flex-shrink: 0;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1a56db, #2563eb);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.brand-sub {
  font-size: 0.65rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Nav links ────────────────────────────── */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  margin-left: 16px;
}

.nav-link-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.nav-link-item i { font-size: 0.9rem; }

.nav-link-item:hover {
  background: #f1f5f9;
  color: #1a56db;
}

.nav-link-item.active {
  background: #eff6ff;
  color: #1a56db;
  font-weight: 600;
}

.nav-link-item.active i { color: #1a56db; }

/* ── Right ────────────────────────────────── */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
}

.btn-dashboard {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  background: #1a56db;
  color: #ffffff;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;
  border: none;
  white-space: nowrap;
}

.btn-dashboard:hover {
  background: #1342b0;
  color: #fff;
  box-shadow: 0 4px 12px rgba(26,86,219,0.3);
  transform: translateY(-1px);
}

/* ── Mobile toggle ────────────────────────── */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.mobile-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: #475569;
  border-radius: 2px;
  transition: all 0.25s ease;
  transform-origin: center;
}

.mobile-toggle.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-toggle.open span:nth-child(2) { opacity: 0; }
.mobile-toggle.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
.mobile-toggle:hover { border-color: #1a56db; }

/* ── Mobile menu ──────────────────────────── */
.mobile-menu {
  display: none;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 8px 16px 16px;
  flex-direction: column;
}

.mobile-menu.open { display: flex; }

.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.18s ease;
}

.mobile-link:hover, .mobile-link.router-link-active {
  background: #eff6ff;
  color: #1a56db;
}

.mobile-link.dashboard {
  color: #1a56db;
  font-weight: 600;
}

.mobile-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* ── Responsive ───────────────────────────── */
@media (max-width: 768px) {
  .navbar-links { display: none; }
  .btn-dashboard span { display: none; }
  .btn-dashboard { padding: 8px 10px; }
  .mobile-toggle { display: flex; }
  .brand-sub { display: none; }
}
</style>