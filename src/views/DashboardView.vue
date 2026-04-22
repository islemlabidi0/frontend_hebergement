<template>
  <div class="admin-page">

    <!-- Header -->
    <div class="dash-header">
      <div class="dash-header-bg"></div>
      <div class="container position-relative">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <div class="dash-eyebrow">
              <span class="dash-dot"></span>
              Espace Administrateur
            </div>
            <h1 class="dash-title">Plateforme de Gestion<br/>d'Hebergement Universitaire</h1>
            <p class="dash-subtitle">Tableau de bord central — selectionnez un module pour commencer</p>
          </div>
          <div class="dash-badge-wrap">
            <div class="dash-stat-pill">
              <i class="bi bi-grid-3x3-gap-fill"></i>
              3 Modules actifs
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container dash-body">

      <!-- Section label -->
      <div class="dash-section-label">
        <span>Modules disponibles</span>
        <div class="dash-line"></div>
      </div>

      <!-- Cards -->
      <div class="row g-4">

        <!-- Etudiant -->
        <div class="col-12 col-md-4">
          <div class="dash-module-card" @click="$router.push('/listEtudiants')">
            <div class="dash-card-top blue">
              <div class="dash-card-icon">
                <i class="bi bi-mortarboard-fill"></i>
              </div>
              <span class="dash-card-num">01</span>
            </div>
            <div class="dash-card-body">
              <h3 class="dash-card-title">Etudiant Management</h3>
              <p class="dash-card-desc">Gerez les profils etudiants, inscriptions et affectations aux foyers.</p>
              <router-link to="/listEtudiants" class="dash-card-btn blue-btn">
                Acceder au module
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Universite -->
        <div class="col-12 col-md-4">
          <div class="dash-module-card" @click="$router.push('/universites')">
            <div class="dash-card-top indigo">
              <div class="dash-card-icon">
                <i class="bi bi-bank2"></i>
              </div>
              <span class="dash-card-num">02</span>
            </div>
            <div class="dash-card-body">
              <h3 class="dash-card-title">Universite Management</h3>
              <p class="dash-card-desc">Administrez les universites partenaires et leurs liaisons avec les foyers.</p>
              <router-link to="/universites" class="dash-card-btn indigo-btn">
                Acceder au module
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Foyer -->
        <div class="col-12 col-md-4">
          <div class="dash-module-card" @click="$router.push('/foyers')">
            <div class="dash-card-top teal">
              <div class="dash-card-icon">
                <i class="bi bi-buildings-fill"></i>
              </div>
              <span class="dash-card-num">03</span>
            </div>
            <div class="dash-card-body">
              <h3 class="dash-card-title">Foyer Management</h3>
              <p class="dash-card-desc">Suivez les foyers, capacites disponibles et reservations actives.</p>
              <router-link to="/foyers" class="dash-card-btn teal-btn">
                Acceder au module
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="dash-footer">
        <span>Plateforme de Gestion d'Hebergement Universitaire</span>
        <span class="dash-footer-sep">·</span>
        <span>2025</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Base ─────────────────────────────────── */
.admin-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding-bottom: 48px;
}

/* ── Header ───────────────────────────────── */
.dash-header {
  background: linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%);
  padding: 40px 0 36px;
  position: relative;
  overflow: hidden;
  margin-bottom: 36px;
}

.dash-header-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 90% 20%, rgba(255,255,255,0.07) 0%, transparent 50%),
    radial-gradient(circle at 10% 80%, rgba(255,255,255,0.05) 0%, transparent 40%);
}

.dash-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.dash-dot {
  width: 7px;
  height: 7px;
  background: #93c5fd;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.dash-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
  line-height: 1.25;
}

.dash-subtitle {
  color: rgba(255,255,255,0.65);
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
}

.dash-stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.85);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 12px;
}

/* ── Section label ────────────────────────── */
.dash-section-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.dash-section-label span {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  white-space: nowrap;
}

.dash-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

/* ── Module Cards ─────────────────────────── */
.dash-module-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dash-module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}

/* Card top banner */
.dash-card-top {
  padding: 28px 24px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.dash-card-top.blue   { background: linear-gradient(135deg, #1a56db, #2563eb); }
.dash-card-top.indigo { background: linear-gradient(135deg, #4338ca, #6366f1); }
.dash-card-top.teal   { background: linear-gradient(135deg, #0d9488, #14b8a6); }

.dash-card-icon {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.25);
}

.dash-card-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: rgba(255,255,255,0.15);
  line-height: 1;
  letter-spacing: -0.02em;
}

/* Card body */
.dash-card-body {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
}

.dash-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.dash-card-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

/* Card button */
.dash-card-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.blue-btn {
  background: #eff6ff;
  color: #1a56db;
  border: 1.5px solid #bfdbfe;
}
.blue-btn:hover {
  background: #1a56db;
  color: #ffffff;
  border-color: #1a56db;
}

.indigo-btn {
  background: #eef2ff;
  color: #4338ca;
  border: 1.5px solid #c7d2fe;
}
.indigo-btn:hover {
  background: #4338ca;
  color: #ffffff;
  border-color: #4338ca;
}

.teal-btn {
  background: #f0fdfa;
  color: #0d9488;
  border: 1.5px solid #99f6e4;
}
.teal-btn:hover {
  background: #0d9488;
  color: #ffffff;
  border-color: #0d9488;
}

/* ── Footer ───────────────────────────────── */
.dash-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
  color: #94a3b8;
  font-size: 0.8rem;
}

.dash-footer-sep { opacity: 0.4; }

/* ── Responsive ───────────────────────────── */
@media (max-width: 768px) {
  .dash-header { padding: 28px 0 24px; }
  .dash-title  { font-size: 1.4rem; }
  .dash-badge-wrap { display: none; }
}
</style>