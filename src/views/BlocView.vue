<template>
  <div class="bloc-page">

    <!-- ────── HEADER ────── -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <i class="bi bi-building me-2"></i>Gestion des Blocs
        </h1>
        <p class="page-subtitle">Plateforme de Gestion d'Hébergement Universitaire</p>
      </div>
    </div>

    <div class="container py-4">

      <!-- ────── FORMULAIRE ────── -->
      <div class="card form-card mb-5">
        <div class="card-body">
          <h5 class="card-title mb-4">
            <i :class="editMode ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2 text-primary"></i>
            {{ editMode ? 'Modifier le Bloc' : 'Ajouter un nouveau Bloc' }}
          </h5>

          <!-- Nom du bloc -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Nom du Bloc</label>
              <input
                v-model="nomBloc"
                type="text"
                class="form-control form-control-lg"
                placeholder="Ex: Bloc A, Bloc Nord..."
              />
            </div>
          </div>

          <!-- ────── Section Chambres ────── -->
          <div class="chambres-section mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0">
                <i class="bi bi-door-open me-2 text-primary"></i>Chambres
              </h6>
              <button class="btn btn-outline-primary btn-sm" @click="addChambreRow">
                <i class="bi bi-plus-lg me-1"></i>Ajouter une chambre
              </button>
            </div>

            <!-- Aucune chambre -->
            <div v-if="chambres.length === 0" class="empty-chambres text-center py-3">
              <i class="bi bi-door-closed text-muted fs-3"></i>
              <p class="text-muted mb-0 mt-1 small">Aucune chambre ajoutée</p>
            </div>

            <!-- Liste des chambres à saisir -->
            <div
              v-for="(chambre, index) in chambres"
              :key="index"
              class="chambre-row row g-2 align-items-center mb-2"
            >
              <div class="col-md-4">
                <label class="form-label small fw-semibold">N° Chambre</label>
                <input
                  v-model.number="chambre.numeroChambre"
                  type="number"
                  class="form-control"
                  placeholder="Ex: 101"
                  min="1"
                />
              </div>
              <div class="col-md-5">
                <label class="form-label small fw-semibold">Type</label>
                <select v-model="chambre.type" class="form-select">
                  <option value="" disabled>-- Choisir un type --</option>
                  <option value="SIMPLE">🔵 SIMPLE</option>
                  <option value="DOUBLE">🟢 DOUBLE</option>
                  <option value="TRIPLE">🟠 TRIPLE</option>
                </select>
              </div>
              <div class="col-md-3 d-flex align-items-end">
                <button
                  class="btn btn-outline-danger btn-sm w-100"
                  @click="removeChambreRow(index)"
                >
                  <i class="bi bi-trash me-1"></i>Retirer
                </button>
              </div>
            </div>
          </div>

          <!-- Boutons actions -->
          <div class="d-flex gap-2">
            <button
              class="btn btn-lg px-5"
              :class="editMode ? 'btn-warning' : 'btn-primary'"
              @click="editMode ? updateBloc() : addBloc()"
              :disabled="loading || !nomBloc.trim()"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else :class="editMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-2"></i>
              {{ editMode ? 'Modifier' : 'Ajouter' }}
            </button>
            <button v-if="editMode" class="btn btn-lg btn-secondary px-4" @click="cancelEdit">
              <i class="bi bi-x-lg me-1"></i>Annuler
            </button>
          </div>

          <!-- Messages -->
          <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0 py-2">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-3 mb-0 py-2">
            <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
          </div>
        </div>
      </div>

      <!-- ────── STATS ────── -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0 fw-bold text-secondary">
          <i class="bi bi-grid me-2"></i>
          Liste des Blocs
          <span class="badge bg-primary ms-2">{{ blocs.length }}</span>
        </h5>
        <button class="btn btn-outline-secondary btn-sm" @click="loadBlocs">
          <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
        </button>
      </div>

      <!-- ────── LOADING ────── -->
      <div v-if="loadingBlocs" class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted">Chargement des blocs...</p>
      </div>

      <!-- ────── LISTE VIDE ────── -->
      <div v-else-if="blocs.length === 0" class="empty-state text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <h5 class="mt-3 text-muted">Aucun bloc disponible</h5>
        <p class="text-muted">Commencez par ajouter un bloc ci-dessus.</p>
      </div>

      <!-- ────── CARDS BLOCS ────── -->
      <div v-else class="row g-4">
        <div v-for="bloc in blocs" :key="bloc.idBloc" class="col-sm-6 col-md-4 col-lg-4">
          <div class="card bloc-card h-100" :class="{ 'editing': selectedBlocId === bloc.idBloc }">
            <div class="card-body d-flex flex-column">

              <!-- Header -->
              <div class="d-flex align-items-center mb-3">
                <div class="bloc-icon me-3">
                  <i class="bi bi-building"></i>
                </div>
                <div>
                  <h5 class="card-title fw-bold mb-0">{{ bloc.nomBloc }}</h5>
                  <small class="text-muted"><i class="bi bi-hash"></i> ID : {{ bloc.idBloc }}</small>
                </div>
              </div>

              <!-- Foyer -->
              <div v-if="bloc.foyer" class="info-badge mb-2">
                <i class="bi bi-house me-1"></i>{{ bloc.foyer.nomFoyer }}
              </div>

              <!-- Résumé chambres -->
              <div class="mb-2">
                <span class="fw-semibold small">
                  <i class="bi bi-door-open me-1 text-primary"></i>
                  {{ bloc.chambres ? bloc.chambres.length : 0 }} chambre(s)
                </span>
                <div class="mt-2 d-flex flex-wrap gap-1" v-if="bloc.chambres && bloc.chambres.length > 0">
                  <span v-if="countByType(bloc.chambres, 'SIMPLE') > 0" class="badge-type badge-simple">
                    <i class="bi bi-person me-1"></i>Simple × {{ countByType(bloc.chambres, 'SIMPLE') }}
                  </span>
                  <span v-if="countByType(bloc.chambres, 'DOUBLE') > 0" class="badge-type badge-double">
                    <i class="bi bi-people me-1"></i>Double × {{ countByType(bloc.chambres, 'DOUBLE') }}
                  </span>
                  <span v-if="countByType(bloc.chambres, 'TRIPLE') > 0" class="badge-type badge-triple">
                    <i class="bi bi-people-fill me-1"></i>Triple × {{ countByType(bloc.chambres, 'TRIPLE') }}
                  </span>
                </div>
              </div>

              <!-- Toggle liste chambres -->
              <div v-if="bloc.chambres && bloc.chambres.length > 0">
                <button
                  class="btn btn-link btn-sm p-0 text-primary mb-2"
                  @click="toggleChambres(bloc.idBloc)"
                >
                  <i :class="showChambres[bloc.idBloc] ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="me-1"></i>
                  {{ showChambres[bloc.idBloc] ? 'Masquer' : 'Voir' }} les chambres
                </button>
                <div v-if="showChambres[bloc.idBloc]" class="chambres-list">
                  <div v-for="chambre in bloc.chambres" :key="chambre.numeroChambre" class="chambre-item">
                    <span class="chambre-numero">
                      <i class="bi bi-door-closed me-1"></i>N° {{ chambre.numeroChambre }}
                    </span>
                    <span :class="getTypeBadgeClass(chambre.type)">{{ chambre.type }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted small mb-2">
                <i class="bi bi-info-circle me-1"></i>Aucune chambre
              </div>

              <!-- Boutons -->
              <div class="mt-auto pt-3 d-flex gap-2">
                <button class="btn btn-warning btn-sm w-50" @click="startEdit(bloc)">
                  <i class="bi bi-pencil me-1"></i>Modifier
                </button>
                <button class="btn btn-danger btn-sm w-50" @click="deleteBloc(bloc.idBloc)">
                  <i class="bi bi-trash me-1"></i>Supprimer
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import blocService from '@/services/blocService'

export default {
  name: 'BlocView',

  data() {
    return {
      blocs: [],
      nomBloc: '',
      chambres: [],        // ← liste des chambres du formulaire
      loading: false,
      loadingBlocs: false,
      errorMessage: '',
      successMessage: '',
      editMode: false,
      selectedBlocId: null,
      showChambres: {}
    }
  },

  mounted() {
    this.loadBlocs()
  },

  methods: {

    // ── Ajouter une ligne chambre dans le formulaire ──
    addChambreRow() {
      this.chambres.push({ numeroChambre: null, type: '' })
    },

    // ── Retirer une ligne chambre ──
    removeChambreRow(index) {
      this.chambres.splice(index, 1)
    },

    // ── Valider les chambres ──
    validateChambres() {
      for (const c of this.chambres) {
        if (!c.numeroChambre || !c.type) {
          this.showError('Veuillez remplir tous les champs de chaque chambre.')
          return false
        }
      }
      return true
    },

    // ── Charger tous les blocs ──
    async loadBlocs() {
      this.loadingBlocs = true
      try {
        const response = await blocService.getAllBlocs()
        this.blocs = response.data
      } catch (error) {
        this.showError('Impossible de charger les blocs.')
      } finally {
        this.loadingBlocs = false
      }
    },

    // ── Ajouter un bloc avec ses chambres ──
    async addBloc() {
      if (!this.nomBloc.trim()) return
      if (!this.validateChambres()) return

      this.loading = true
      this.clearMessages()
      try {
        const payload = {
          nomBloc: this.nomBloc,
          chambres: this.chambres
        }
        await blocService.addBloc(payload)
        this.nomBloc = ''
        this.chambres = []
        this.showSuccess('Bloc ajouté avec succès !')
        await this.loadBlocs()
      } catch (error) {
        this.showError('Erreur lors de l\'ajout du bloc.')
      } finally {
        this.loading = false
      }
    },

    // ── Démarrer modification ──
    startEdit(bloc) {
      this.editMode = true
      this.selectedBlocId = bloc.idBloc
      this.nomBloc = bloc.nomBloc
      // Copier les chambres existantes dans le formulaire
      this.chambres = bloc.chambres
        ? bloc.chambres.map(c => ({ numeroChambre: c.numeroChambre, type: c.type }))
        : []
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // ── Annuler modification ──
    cancelEdit() {
      this.editMode = false
      this.selectedBlocId = null
      this.nomBloc = ''
      this.chambres = []
      this.clearMessages()
    },

    // ── Modifier un bloc ──
    async updateBloc() {
      if (!this.nomBloc.trim()) return
      if (!this.validateChambres()) return

      this.loading = true
      this.clearMessages()
      try {
        const payload = {
          nomBloc: this.nomBloc,
          chambres: this.chambres
        }
        await blocService.updateBloc(this.selectedBlocId, payload)
        this.showSuccess('Bloc modifié avec succès !')
        this.cancelEdit()
        await this.loadBlocs()
      } catch (error) {
        this.showError('Erreur lors de la modification du bloc.')
      } finally {
        this.loading = false
      }
    },

    // ── Supprimer un bloc ──
    async deleteBloc(id) {
      if (!confirm('Voulez-vous vraiment supprimer ce bloc ?')) return
      try {
        await blocService.deleteBloc(id)
        this.showSuccess('Bloc supprimé avec succès !')
        await this.loadBlocs()
      } catch (error) {
        this.showError('Erreur lors de la suppression du bloc.')
      }
    },

    toggleChambres(idBloc) {
      this.showChambres = { ...this.showChambres, [idBloc]: !this.showChambres[idBloc] }
    },

    countByType(chambres, type) {
      return chambres.filter(c => c.type === type).length
    },

    getTypeBadgeClass(type) {
      return { SIMPLE: 'badge-type badge-simple', DOUBLE: 'badge-type badge-double', TRIPLE: 'badge-type badge-triple' }[type] || 'badge bg-secondary'
    },

    showError(msg) {
      this.errorMessage = msg
      setTimeout(() => { this.errorMessage = '' }, 4000)
    },
    showSuccess(msg) {
      this.successMessage = msg
      setTimeout(() => { this.successMessage = '' }, 3000)
    },
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    }
  }
}
</script>

<style scoped>
.bloc-page {
  min-height: 100vh;
  background-color: #f0f4f8;
  font-family: 'Segoe UI', sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  padding: 2.5rem 0 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.page-title { font-size: 2rem; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 0.95rem; opacity: 0.8; margin: 0.3rem 0 0; }

.form-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 0.5rem;
}

/* Section chambres dans le formulaire */
.chambres-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  border: 1px dashed #c5d8fb;
}

.empty-chambres {
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.chambre-row {
  background: white;
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

/* Cards blocs */
.bloc-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: white;
}

.bloc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.14);
}

.bloc-card.editing {
  border: 2px solid #ffc107;
  box-shadow: 0 0 0 4px rgba(255,193,7,0.2);
}

.bloc-icon {
  width: 48px; height: 48px; min-width: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8f0fe, #c5d8fb);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: #1a73e8;
}

.info-badge {
  background: #f0f4f8;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.82rem;
  color: #555;
  display: inline-block;
}

.badge-type {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.badge-simple { background: #e3f2fd; color: #1565c0; }
.badge-double { background: #e8f5e9; color: #2e7d32; }
.badge-triple { background: #fff3e0; color: #e65100; }

.chambres-list {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
  max-height: 160px;
  overflow-y: auto;
}

.chambre-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  border-bottom: 1px solid #eee;
  font-size: 0.83rem;
}

.chambre-item:last-child { border-bottom: none; }
.chambre-numero { color: #444; font-weight: 500; }

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.btn-primary {
  background: linear-gradient(135deg, #1a73e8, #1558b0);
  border: none; border-radius: 10px; font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26,115,232,0.4);
}

.btn-warning { border-radius: 8px; font-weight: 500; }
.btn-danger  { border-radius: 8px; font-weight: 500; }
</style>