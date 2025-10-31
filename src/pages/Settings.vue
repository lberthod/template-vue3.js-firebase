<template>
  <div class="container-lg">
    <div class="settings-page">
      <h1>{{ $t('settings.title') }}</h1>
      
      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Tab content -->
      <div class="tab-content settings-grid">
        <!-- Theme -->
        <div v-show="activeTab === 'theme'" class="tab-panel">
          <ThemePreview
            v-if="settingsStore.draft?.theme?.colors"
            :colors="settingsStore.draft.theme.colors"
            @update="updateTheme"
            @preview="applyPreview"
            @reset="resetSettings"
          />

          <div class="card" style="margin-top: 1rem;">
            <details open>
              <summary class="section-summary">Polices</summary>
            <div class="form-group">
              <label>Police du texte (body)</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.fonts?.body"
                @input="updateThemeConfig({ fonts: { ...settingsStore.draft.theme.fonts, body: $event.target.value } })"
                placeholder="Inter, system-ui, sans-serif"
              />
            </div>
            <div class="form-group">
              <label>Police des titres (heading)</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.fonts?.heading"
                @input="updateThemeConfig({ fonts: { ...settingsStore.draft.theme.fonts, heading: $event.target.value } })"
                placeholder="Poppins, sans-serif"
              />
            </div>
            <div class="form-group">
              <label>Police monospace</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.fonts?.mono"
                @input="updateThemeConfig({ fonts: { ...settingsStore.draft.theme.fonts, mono: $event.target.value } })"
                placeholder="Fira Code, monospace"
              />
            </div>
            </details>

            <details open>
              <summary class="section-summary">Espacement</summary>
            <div class="form-group">
              <label>Largeur du conteneur</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.spacing?.container"
                @input="updateThemeConfig({ spacing: { ...settingsStore.draft.theme.spacing, container: $event.target.value } })"
                placeholder="1200px"
              />
            </div>
            <div class="form-group">
              <label>Padding</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.spacing?.padding"
                @input="updateThemeConfig({ spacing: { ...settingsStore.draft.theme.spacing, padding: $event.target.value } })"
                placeholder="1rem"
              />
            </div>
            <div class="form-group">
              <label>Gap</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.spacing?.gap"
                @input="updateThemeConfig({ spacing: { ...settingsStore.draft.theme.spacing, gap: $event.target.value } })"
                placeholder="1.5rem"
              />
            </div>
            </details>

            <details>
              <summary class="section-summary">Bordures</summary>
            <div class="form-group">
              <label>Arrondi des bordures</label>
              <input
                type="text"
                :value="settingsStore.draft?.theme?.borderRadius"
                @input="updateThemeConfig({ borderRadius: $event.target.value })"
                placeholder="0.375rem"
              />
            </div>
            </details>

            <details>
              <summary class="section-summary">Mode sombre</summary>
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  :checked="settingsStore.draft?.theme?.darkMode?.enabled"
                  @change="updateThemeConfig({ darkMode: { ...settingsStore.draft.theme.darkMode, enabled: $event.target.checked } })"
                />
                Activer le mode sombre
              </label>
            </div>
            </details>
          </div>
          
          <div class="panel-actions sticky-actions">
            <button @click="publishSettings" class="btn btn-success" :disabled="settingsStore.loading">
              {{ settingsStore.loading ? 'Publication...' : '✓ Publier' }}
            </button>
          </div>
        </div>
        
        <!-- Navigation & Footer -->
        <div v-show="activeTab === 'navigation'" class="tab-panel">
          <div class="section">
            <h2>Navbar</h2>
            <div class="card">
              <div class="form-group">
                <label>Position</label>
                <select
                  :value="settingsStore.draft?.navbar?.position"
                  @change="updateNavbarConfig({ position: $event.target.value })"
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    :checked="settingsStore.draft?.navbar?.sticky"
                    @change="updateNavbarConfig({ sticky: $event.target.checked })"
                  />
                  Navigation fixe (sticky)
                </label>
              </div>
              <div class="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  :value="settingsStore.draft?.navbar?.logoUrl"
                  @input="updateNavbarConfig({ logoUrl: $event.target.value })"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div v-if="settingsStore.draft?.navbar?.logoUrl" class="logo-preview">
                <label>Aperçu du logo</label>
                <div class="preview-box">
                  <img :src="settingsStore.draft.navbar.logoUrl" alt="Aperçu logo navbar" />
                </div>
              </div>
              <div class="form-group">
                <label>Logo alt</label>
                <input
                  type="text"
                  :value="settingsStore.draft?.navbar?.logoAlt"
                  @input="updateNavbarConfig({ logoAlt: $event.target.value })"
                  placeholder="Logo"
                />
              </div>
              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    :checked="settingsStore.draft?.navbar?.showLogo"
                    @change="updateNavbarConfig({ showLogo: $event.target.checked })"
                  />
                  Afficher le logo
                </label>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Navigation</h2>
            <ToggleList
              v-if="settingsStore.draft?.navbar?.items"
              :items="settingsStore.draft.navbar.items"
              title="Items de navigation"
              @update="updateNavbar"
            />
          </div>
          
          <div class="section">
            <h2>Footer</h2>
            <div class="card">
              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    :checked="settingsStore.draft?.footer?.visible"
                    @change="updateFooter({ visible: $event.target.checked })"
                  />
                  Footer visible
                </label>
              </div>
              
              <div class="form-group">
                <label>Clé i18n du texte</label>
                <input
                  type="text"
                  :value="settingsStore.draft?.footer?.textKey"
                  @input="updateFooter({ textKey: $event.target.value })"
                  placeholder="footer.copyright"
                />
              </div>
            </div>

            <h3>Contact</h3>
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                :value="settingsStore.draft?.general?.contact?.email"
                @input="updateGeneral({ contact: { ...settingsStore.draft.general.contact, email: $event.target.value } })"
              />
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                :value="settingsStore.draft?.general?.contact?.phone"
                @input="updateGeneral({ contact: { ...settingsStore.draft.general.contact, phone: $event.target.value } })"
              />
            </div>
            <div class="form-group">
              <label>Adresse</label>
              <input
                type="text"
                :value="settingsStore.draft?.general?.contact?.address"
                @input="updateGeneral({ contact: { ...settingsStore.draft.general.contact, address: $event.target.value } })"
              />
            </div>

            <h3>Réseaux sociaux</h3>
            <div class="form-group">
              <label>Facebook</label>
              <input type="url" :value="settingsStore.draft?.general?.social?.facebook" @input="updateGeneral({ social: { ...settingsStore.draft.general.social, facebook: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>Twitter</label>
              <input type="url" :value="settingsStore.draft?.general?.social?.twitter" @input="updateGeneral({ social: { ...settingsStore.draft.general.social, twitter: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>LinkedIn</label>
              <input type="url" :value="settingsStore.draft?.general?.social?.linkedin" @input="updateGeneral({ social: { ...settingsStore.draft.general.social, linkedin: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>Instagram</label>
              <input type="url" :value="settingsStore.draft?.general?.social?.instagram" @input="updateGeneral({ social: { ...settingsStore.draft.general.social, instagram: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>GitHub</label>
              <input type="url" :value="settingsStore.draft?.general?.social?.github" @input="updateGeneral({ social: { ...settingsStore.draft.general.social, github: $event.target.value } })" />
            </div>

            <h3>SEO</h3>
            <div class="form-group">
              <label>Meta description</label>
              <input type="text" :value="settingsStore.draft?.general?.seo?.metaDescription" @input="updateGeneral({ seo: { ...settingsStore.draft.general.seo, metaDescription: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>Meta keywords</label>
              <input type="text" :value="settingsStore.draft?.general?.seo?.metaKeywords" @input="updateGeneral({ seo: { ...settingsStore.draft.general.seo, metaKeywords: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>Open Graph image</label>
              <input type="url" :value="settingsStore.draft?.general?.seo?.ogImage" @input="updateGeneral({ seo: { ...settingsStore.draft.general.seo, ogImage: $event.target.value } })" />
            </div>
            <div class="form-group">
              <label>Twitter Card</label>
              <input type="text" :value="settingsStore.draft?.general?.seo?.twitterCard" @input="updateGeneral({ seo: { ...settingsStore.draft.general.seo, twitterCard: $event.target.value } })" />
            </div>

            <h3>Maintenance</h3>
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  :checked="settingsStore.draft?.general?.maintenance?.enabled"
                  @change="updateGeneral({ maintenance: { ...settingsStore.draft.general.maintenance, enabled: $event.target.checked } })"
                />
                Mode maintenance
              </label>
            </div>
            <div class="form-group">
              <label>Message de maintenance</label>
              <input type="text" :value="settingsStore.draft?.general?.maintenance?.message" @input="updateGeneral({ maintenance: { ...settingsStore.draft.general.maintenance, message: $event.target.value } })" />
            </div>
          </div>
          
          <div class="panel-actions sticky-actions">
            <button @click="applyPreview" class="btn btn-secondary">
              👁️ Prévisualiser
            </button>
            <button @click="publishSettings" class="btn btn-success" :disabled="settingsStore.loading">
              {{ settingsStore.loading ? 'Publication...' : '✓ Publier' }}
            </button>
            <button @click="resetSettings" class="btn btn-outline">
              🔄 Réinitialiser
            </button>
          </div>
        </div>
        
        <!-- i18n -->
        <div v-show="activeTab === 'i18n'" class="tab-panel">
          <I18nEditor
            :messages="settingsStore.i18nDraft"
            :locales="availableLocales"
            @update="updateI18nKey"
            @delete="deleteI18nKey"
          />
          
          <div class="panel-actions">
            <button @click="applyPreviewI18n" class="btn btn-secondary">
              👁️ Prévisualiser
            </button>
            <button @click="publishI18n" class="btn btn-success" :disabled="settingsStore.loading">
              {{ settingsStore.loading ? 'Publication...' : '✓ Publier' }}
            </button>
            <button @click="resetI18n" class="btn btn-outline">
              🔄 Réinitialiser
            </button>
          </div>
        </div>
        
        <!-- General -->
        <div v-show="activeTab === 'general'" class="tab-panel">
          <div class="card">
            <div class="form-group">
              <label>Titre du site</label>
              <input
                type="text"
                :value="settingsStore.draft?.general?.siteTitle"
                @input="updateGeneral({ siteTitle: $event.target.value })"
                placeholder="Vue Firebase CMS"
              />
            </div>
            <div class="form-group">
              <label>Description du site</label>
              <input
                type="text"
                :value="settingsStore.draft?.general?.siteDescription"
                @input="updateGeneral({ siteDescription: $event.target.value })"
                placeholder="Template Vue 3 avec Firebase et CMS intégré"
              />
            </div>
            <div class="form-group">
              <label>Logo du site (URL)</label>
              <input
                type="text"
                :value="settingsStore.draft?.general?.siteLogo"
                @input="updateGeneral({ siteLogo: $event.target.value })"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div v-if="settingsStore.draft?.general?.siteLogo" class="logo-preview">
              <label>Aperçu du logo du site</label>
              <div class="preview-box">
                <img :src="settingsStore.draft.general.siteLogo" alt="Aperçu logo site" />
              </div>
            </div>
            <div class="form-group">
              <label>Favicon (URL)</label>
              <input
                type="url"
                :value="settingsStore.draft?.general?.siteFavicon"
                @input="updateGeneral({ siteFavicon: $event.target.value })"
                placeholder="/favicon.ico"
              />
            </div>
            <div v-if="settingsStore.draft?.general?.siteFavicon" class="logo-preview">
              <label>Aperçu du favicon</label>
              <div class="preview-box small">
                <img :src="settingsStore.draft.general.siteFavicon" alt="Aperçu favicon" />
              </div>
            </div>
            
            <div class="form-group">
              <label>Langue par défaut</label>
              <select
                :value="settingsStore.draft?.general?.localeDefault"
                @change="updateGeneral({ localeDefault: $event.target.value })"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Langues activées</label>
              <div class="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="fr"
                    :checked="settingsStore.draft?.general?.localesEnabled?.includes('fr')"
                    @change="toggleLocale('fr', $event.target.checked)"
                  />
                  Français
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="en"
                    :checked="settingsStore.draft?.general?.localesEnabled?.includes('en')"
                    @change="toggleLocale('en', $event.target.checked)"
                  />
                  English
                </label>
              </div>
            </div>
            
            <h3>Features</h3>
            
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  :checked="settingsStore.draft?.general?.features?.darkMode"
                  @change="updateFeature('darkMode', $event.target.checked)"
                />
                Mode sombre
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  :checked="settingsStore.draft?.general?.features?.analytics"
                  @change="updateFeature('analytics', $event.target.checked)"
                />
                Analytics
              </label>
            </div>
          </div>
          
          <div class="panel-actions">
            <button @click="publishSettings" class="btn btn-success" :disabled="settingsStore.loading">
              {{ settingsStore.loading ? 'Publication...' : '✓ Publier' }}
            </button>
            <button @click="resetSettings" class="btn btn-outline">
              🔄 Réinitialiser
            </button>
          </div>
        </div>
        
        <!-- History -->
        <div v-show="activeTab === 'history'" class="tab-panel">
          <div class="card">
            <h2>Historique des modifications</h2>
            
            <div v-if="settingsStore.audit.length === 0" class="empty-state">
              Aucune modification enregistrée
            </div>
            
            <div v-else class="audit-list">
              <div
                v-for="entry in settingsStore.audit"
                :key="entry.id"
                class="audit-entry"
              >
                <div class="audit-info">
                  <div class="audit-date">
                    {{ formatDate(entry.timestamp) }}
                  </div>
                  <div class="audit-summary">{{ entry.summary }}</div>
                  <div class="audit-meta">
                    <span class="badge">{{ entry.type }}</span>
                    <span v-if="entry.locale" class="badge">{{ entry.locale }}</span>
                  </div>
                </div>
                <button @click="restoreAudit(entry)" class="btn btn-sm btn-outline">
                  ↺ Restaurer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '../stores/settings'
import { useToast } from '../composables/useToast'
import ThemePreview from '../components/ThemePreview.vue'
import ToggleList from '../components/ToggleList.vue'
import I18nEditor from '../components/I18nEditor.vue'
import { debounce } from '../helpers/debounce'
import { sanitizeI18nMessages } from '../helpers/i18n-sanitize'

const { t, mergeLocaleMessage } = useI18n()
const settingsStore = useSettingsStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const activeTab = ref('theme')

// Debounced savers to reduce DB writes (must be defined inside script before use)
const debouncedSaveDraft = debounce(async () => {
  try {
    await settingsStore.saveDraft()
  } catch (_) {}
}, 400)

const debouncedSaveI18nDraft = debounce(async (locale) => {
  try {
    await settingsStore.saveI18nDraft(locale)
  } catch (_) {}
}, 400)

const tabs = computed(() => [
  { id: 'theme', label: t('settings.theme') },
  { id: 'navigation', label: t('settings.navigation') },
  { id: 'i18n', label: t('settings.i18n') },
  { id: 'general', label: t('settings.general') },
  { id: 'history', label: t('settings.history') }
])

const availableLocales = computed(() => {
  return settingsStore.draft?.general?.localesEnabled || ['fr', 'en']
})

// Load draft and audit on mount
onMounted(async () => {
  try {
    // Initialize tab from route query if present
    const tabFromQuery = String(route.query.tab || '').toLowerCase()
    const allowed = ['theme','navigation','i18n','general','history']
    if (allowed.includes(tabFromQuery)) {
      activeTab.value = tabFromQuery
    }
    await settingsStore.loadDraft()
    await settingsStore.loadAudit()
    
    // Load i18n drafts for all locales
    for (const locale of availableLocales.value) {
      await settingsStore.loadI18nDraft(locale)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    toast.error('Erreur de chargement')
  }
})

// Keep URL in sync when tab changes (for deep links)
watch(activeTab, (tab) => {
  router.replace({ query: { ...route.query, tab } })
})

// Theme methods (auto-save + live preview)
const updateTheme = async (colors) => {
  settingsStore.updateThemeColors(colors)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

// Theme config (fonts, spacing, borderRadius, darkMode)
const updateThemeConfig = async (config) => {
  settingsStore.updateThemeConfig(config)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

// Navigation methods (auto-save + live preview)
const updateNavbar = async (items) => {
  settingsStore.updateNavbarItems(items)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

// Navbar config (position, sticky, logo)
const updateNavbarConfig = async (config) => {
  settingsStore.updateNavbarConfig(config)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

// Footer methods (auto-save + live preview)
const updateFooter = async (config) => {
  settingsStore.updateFooter(config)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

// General methods (auto-save + live preview)
const updateGeneral = async (config) => {
  settingsStore.updateGeneral(config)
  debouncedSaveDraft()
  settingsStore.applyPreview()
}

const toggleLocale = async (locale, enabled) => {
  const current = settingsStore.draft.general.localesEnabled || []
  const newLocales = enabled
    ? [...current, locale]
    : current.filter(l => l !== locale)
  
  if (newLocales.length === 0) {
    toast.error('Au moins une langue doit être activée')
    return
  }
  
  await updateGeneral({ localesEnabled: newLocales })
}

const updateFeature = (feature, value) => {
  const features = { ...settingsStore.draft.general.features, [feature]: value }
  updateGeneral({ features })
}

// i18n methods (auto-save + live merge)
const updateI18nKey = async (locale, key, value) => {
  settingsStore.updateI18nKey(locale, key, value)
  debouncedSaveI18nDraft(locale)
  // Live merge in runtime for immediate preview (sanitized)
  const sanitized = sanitizeI18nMessages(settingsStore.i18nDraft[locale] || {})
  mergeLocaleMessage(locale, sanitized)
}

const deleteI18nKey = async (locale, key) => {
  settingsStore.deleteI18nKey(locale, key)
  debouncedSaveI18nDraft(locale)
  const sanitized = sanitizeI18nMessages(settingsStore.i18nDraft[locale] || {})
  mergeLocaleMessage(locale, sanitized)
}

// Preview methods
const applyPreview = () => {
  settingsStore.applyPreview()
  toast.info('Mode prévisualisation activé')
}

const applyPreviewI18n = () => {
  // Déjà géré via mergeLocaleMessage après chaque modification
  toast.info('Prévisualisation i18n appliquée')
}

// Publish methods
const publishSettings = async () => {
  try {
    const summary = prompt('Résumé de la modification:', 'Mise à jour des paramètres')
    if (!summary) return
    
    await settingsStore.saveDraft()
    await settingsStore.publishSettings(summary)
    toast.success('Paramètres publiés')
    
    // Reload audit
    await settingsStore.loadAudit()
  } catch (error) {
    console.error('Error publishing settings:', error)
    toast.error('Erreur de publication')
  }
}

const publishI18n = async () => {
  try {
    const locale = prompt('Langue à publier (fr/en):', 'fr')
    if (!locale || !availableLocales.value.includes(locale)) {
      toast.error('Langue invalide')
      return
    }
    
    const summary = prompt('Résumé de la modification:', `Mise à jour i18n ${locale}`)
    if (!summary) return
    
    await settingsStore.saveI18nDraft(locale)
    await settingsStore.publishI18n(locale, summary)
    toast.success(`Traductions ${locale.toUpperCase()} publiées`)
    
    // Reload audit
    await settingsStore.loadAudit()
  } catch (error) {
    console.error('Error publishing i18n:', error)
    toast.error('Erreur de publication')
  }
}

// Reset methods
const resetSettings = async () => {
  if (!confirm('Réinitialiser le brouillon depuis la version publiée ?')) return
  
  try {
    await settingsStore.resetDraft()
    toast.info('Brouillon réinitialisé')
  } catch (error) {
    console.error('Error resetting settings:', error)
    toast.error('Erreur de réinitialisation')
  }
}

const resetI18n = async () => {
  const locale = prompt('Langue à réinitialiser (fr/en):', 'fr')
  if (!locale || !availableLocales.value.includes(locale)) {
    toast.error('Langue invalide')
    return
  }
  
  try {
    await settingsStore.resetI18nDraft(locale)
    toast.info(`Brouillon ${locale.toUpperCase()} réinitialisé`)
  } catch (error) {
    console.error('Error resetting i18n:', error)
    toast.error('Erreur de réinitialisation')
  }
}

// Audit methods
const restoreAudit = async (entry) => {
  if (!confirm(`Restaurer cette version dans le brouillon ?\n\n${entry.summary}`)) return
  
  try {
    await settingsStore.restoreFromAudit(entry)
    toast.success('Version restaurée dans le brouillon')
  } catch (error) {
    console.error('Error restoring audit:', error)
    toast.error('Erreur de restauration')
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.settings-page {
  padding: var(--spacing-xl) 0;
}

.settings-page h1 {
  margin-bottom: var(--spacing-xl);
}

/* Tabs */
.tabs {
  display: flex;
  gap: var(--spacing-sm);
  border-bottom: 2px solid var(--border);
  margin-bottom: var(--spacing-xl);
  overflow-x: auto;
}

.tab {
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--muted);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.tab:hover {
  color: var(--fg);
  background-color: var(--bg-elev);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* Tab content */
.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  margin-bottom: var(--spacing-xl);
}

.section h2 {
  margin-bottom: var(--spacing-lg);
}

.panel-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border);
}

/* Checkbox group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* Audit list */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.audit-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-elev);
  border-radius: var(--radius-md);
  gap: var(--spacing-md);
}

.audit-info {
  flex: 1;
}

.audit-date {
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: var(--spacing-xs);
}

.audit-summary {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.audit-meta {
  display: flex;
  gap: var(--spacing-sm);
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--muted);
}

@media (max-width: 768px) {
  .panel-actions {
    flex-direction: column;
  }
  
  .audit-entry {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
