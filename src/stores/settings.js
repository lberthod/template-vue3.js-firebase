import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDb } from '../composables/useDb'
import { useThemeVars } from '../composables/useThemeVars'
import { useAuthStore } from './auth'
import { encodeI18nKeys, decodeI18nKeys } from '../helpers/db-i18n'

/**
 * Settings CMS store
 * Manages theme, navbar, footer, i18n, and audit
 */
export const useSettingsStore = defineStore('settings', () => {
  const db = useDb()
  const themeVars = useThemeVars()
  const authStore = useAuthStore()
  
  // State
  const current = ref(null)
  const draft = ref(null)
  const i18nLive = ref({})
  const i18nDraft = ref({})
  const audit = ref([])
  const previewMode = ref(false)
  const loading = ref(false)
  
  // Unlisteners
  let unlistenCurrent = null
  let unlistenDraft = null
  const unlistenI18n = {}
  
  // Computed
  const active = computed(() => previewMode.value ? draft.value : current.value)
  
  /**
   * Initialize - load current settings
   */
  const init = async () => {
    await loadCurrent()
  }
  
  /**
   * Load and listen to current settings (public)
   */
  const loadCurrent = () => {
    return new Promise((resolve) => {
      if (unlistenCurrent) unlistenCurrent()
      
      unlistenCurrent = db.listen('/app/settings/current', (data) => {
        if (data) {
          current.value = data
          
          // Apply theme if not in preview mode
          if (!previewMode.value && data.theme?.colors) {
            themeVars.applyTheme(data.theme.colors)
          }
        } else {
          // Set default settings if none exist
          current.value = getDefaultSettings()
        }
        resolve(data)
      })
    })
  }
  
  /**
   * Load and listen to draft settings (editor/admin only)
   */
  const loadDraft = () => {
    return new Promise((resolve) => {
      if (unlistenDraft) unlistenDraft()
      
      unlistenDraft = db.listen('/app/settings/draft', (data) => {
        if (data) {
          draft.value = data
        } else {
          // Initialize draft from current
          draft.value = JSON.parse(JSON.stringify(current.value || getDefaultSettings()))
          saveDraft()
        }
        resolve(data)
      })
    })
  }
  
  /**
   * Load and listen to live i18n for a locale
   */
  const loadI18nLive = (locale) => {
    return new Promise((resolve) => {
      if (unlistenI18n[locale]) unlistenI18n[locale]()
      
      const path = `/app/i18n/live/${locale}`
      unlistenI18n[locale] = db.listen(path, (data) => {
        if (data) {
          i18nLive.value[locale] = data
        }
        resolve(data)
      })
    })
  }
  
  /**
   * Load draft i18n for a locale
   */
  const loadI18nDraft = async (locale) => {
    try {
      const data = await db.get(`/app/i18n/draft/${locale}`)
      if (data) {
        i18nDraft.value[locale] = decodeI18nKeys(data)
      } else {
        // Initialize from live
        i18nDraft.value[locale] = { ...(i18nLive.value[locale] || {}) }
        await db.set(`/app/i18n/draft/${locale}`, encodeI18nKeys(i18nDraft.value[locale]))
      }
    } catch (error) {
      console.error(`Error loading i18n draft for ${locale}:`, error)
    }
  }
  
  /**
   * Load audit history
   */
  const loadAudit = async () => {
    try {
      const settingsAudit = await db.get('/app/settings/audit') || {}
      const i18nAudit = await db.get('/app/i18n/audit') || {}
      
      // Merge and sort by timestamp
      const allAudit = [
        ...Object.entries(settingsAudit).map(([key, value]) => ({ ...value, id: key, type: 'settings' })),
        ...Object.entries(i18nAudit).map(([key, value]) => ({ ...value, id: key, type: 'i18n' }))
      ]
      
      audit.value = allAudit.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Error loading audit:', error)
    }
  }
  
  /**
   * Save draft settings
   */
  const saveDraft = async () => {
    try {
      await db.set('/app/settings/draft', draft.value)
    } catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  }
  
  /**
   * Save draft i18n for a locale
   */
  const saveI18nDraft = async (locale) => {
    try {
      await db.set(`/app/i18n/draft/${locale}`, encodeI18nKeys(i18nDraft.value[locale]))
    } catch (error) {
      console.error(`Error saving i18n draft for ${locale}:`, error)
      throw error
    }
  }
  
  /**
   * Apply preview (in-memory only)
   */
  const applyPreview = () => {
    previewMode.value = true
    
    // Apply draft theme
    if (draft.value?.theme?.colors) {
      themeVars.snapshot()
      themeVars.applyTheme(draft.value.theme.colors)
    }
  }
  
  /**
   * Exit preview mode
   */
  const exitPreview = () => {
    previewMode.value = false
    
    // Revert theme
    if (current.value?.theme?.colors) {
      themeVars.applyTheme(current.value.theme.colors)
    }
  }
  
  /**
   * Publish settings (draft → current + audit snapshot)
   */
  const publishSettings = async (summary = 'Mise à jour des paramètres') => {
    try {
      loading.value = true
      
      // Create audit snapshot
      const timestamp = Date.now()
      const auditEntry = {
        timestamp,
        summary,
        user: authStore.user?.uid || 'unknown',
        data: JSON.parse(JSON.stringify(draft.value))
      }
      
      // Save to audit
      await db.set(`/app/settings/audit/${timestamp}`, auditEntry)
      
      // Publish draft to current
      await db.set('/app/settings/current', draft.value)
      
      // Exit preview mode
      if (previewMode.value) {
        exitPreview()
      }
      
      // Reload audit
      await loadAudit()
      
      return timestamp
    } catch (error) {
      console.error('Error publishing settings:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Publish i18n (draft → live + audit snapshot)
   */
  const publishI18n = async (locale, summary = `Mise à jour i18n ${locale}`) => {
    try {
      loading.value = true
      
      const draftData = i18nDraft.value[locale]
      if (!draftData) {
        throw new Error(`No draft data for locale ${locale}`)
      }
      
      // Create audit snapshot (encode keys for Firebase)
      const timestamp = Date.now()
      const auditEntry = {
        timestamp,
        summary,
        user: authStore.user?.uid || 'unknown',
        locale,
        data: encodeI18nKeys(draftData)
      }
      
      // Save to audit
      await db.set(`/app/i18n/audit/${timestamp}`, auditEntry)
      
      // Publish draft to live
      await db.set(`/app/i18n/live/${locale}`, encodeI18nKeys(draftData))
      
      // Reload audit
      await loadAudit()
      
      return timestamp
    } catch (error) {
      console.error(`Error publishing i18n for ${locale}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Reset draft to current
   */
  const resetDraft = async () => {
    try {
      draft.value = JSON.parse(JSON.stringify(current.value))
      await saveDraft()
      
      if (previewMode.value) {
        exitPreview()
      }
    } catch (error) {
      console.error('Error resetting draft:', error)
      throw error
    }
  }
  
  /**
   * Reset i18n draft to live
   */
  const resetI18nDraft = async (locale) => {
    try {
      i18nDraft.value[locale] = { ...(i18nLive.value[locale] || {}) }
      await saveI18nDraft(locale)
    } catch (error) {
      console.error(`Error resetting i18n draft for ${locale}:`, error)
      throw error
    }
  }
  
  /**
   * Restore audit entry to draft
   */
  const restoreFromAudit = async (auditEntry) => {
    try {
      if (auditEntry.type === 'settings') {
        draft.value = JSON.parse(JSON.stringify(auditEntry.data))
        await saveDraft()
      } else if (auditEntry.type === 'i18n') {
        // Decode keys from audit (stored as encoded for Firebase)
        const decoded = decodeI18nKeys(auditEntry.data)
        i18nDraft.value[auditEntry.locale] = decoded
        await saveI18nDraft(auditEntry.locale)
      }
    } catch (error) {
      console.error('Error restoring from audit:', error)
      throw error
    }
  }
  
  /**
   * Update draft theme colors
   */
  const updateThemeColors = (colors) => {
    if (!draft.value.theme) draft.value.theme = {}
    draft.value.theme.colors = { ...draft.value.theme.colors, ...colors }
  }

  /**
   * Update other theme config (fonts, spacing, borderRadius, darkMode)
   */
  const updateThemeConfig = (config) => {
    if (!draft.value.theme) draft.value.theme = {}
    draft.value.theme = { ...draft.value.theme, ...config }
  }

  /**
   * Update navbar items
   */
  const updateNavbarItems = (items) => {
    if (!draft.value.navbar) draft.value.navbar = {}
    draft.value.navbar.items = items
  }

  /**
   * Update navbar config (position, sticky, logo)
   */
  const updateNavbarConfig = (config) => {
    if (!draft.value.navbar) draft.value.navbar = {}
    draft.value.navbar = { ...draft.value.navbar, ...config }
  }
  
  /**
   * Update footer config
   */
  const updateFooter = (config) => {
    draft.value.footer = { ...draft.value.footer, ...config }
  }
  
  /**
   * Update general settings
   */
  const updateGeneral = (config) => {
    draft.value.general = { ...draft.value.general, ...config }
  }
  
  /**
   * Update i18n draft key
   */
  const updateI18nKey = (locale, key, value) => {
    if (!i18nDraft.value[locale]) {
      i18nDraft.value[locale] = {}
    }
    i18nDraft.value[locale][key] = value
  }
  
  /**
   * Delete i18n draft key
   */
  const deleteI18nKey = (locale, key) => {
    if (i18nDraft.value[locale]) {
      delete i18nDraft.value[locale][key]
    }
  }
  
  /**
   * Get default settings structure
   */
  const getDefaultSettings = () => ({
    theme: {
      colors: {
        bg: '#ffffff',
        bgElev: '#f8f9fa',
        fg: '#212529',
        border: '#dee2e6',
        muted: '#6c757d',
        primary: '#0d6efd',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0'
      },
      fonts: {
        body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        heading: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        mono: "'Courier New', monospace"
      },
      spacing: {
        container: '1200px',
        padding: '1rem',
        gap: '1.5rem'
      },
      borderRadius: '0.375rem',
      darkMode: {
        enabled: false,
        colors: {
          bg: '#1a1a1a',
          bgElev: '#2d2d2d',
          fg: '#f0f0f0',
          border: '#404040',
          muted: '#999999'
        }
      }
    },
    navbar: {
      position: 'top',
      sticky: true,
      logoUrl: '',
      logoAlt: 'Logo',
      showLogo: true,
      items: [
        { id: 'home', visible: true, order: 0, labelKey: 'nav.home', path: '/' },
        { id: 'about', visible: true, order: 1, labelKey: 'nav.about', path: '/about' },
        { id: 'contact', visible: true, order: 2, labelKey: 'nav.contact', path: '/contact' },
        { id: 'product', visible: true, order: 3, labelKey: 'nav.product', path: '/product' },
        { id: 'price', visible: true, order: 4, labelKey: 'nav.price', path: '/price' }
      ]
    },
    footer: {
      visible: true,
      textKey: 'footer.copyright'
    },
    general: {
      siteTitle: 'Vue Firebase CMS',
      siteDescription: 'Template Vue 3 avec Firebase et CMS intégré',
      siteLogo: '',
      siteFavicon: '/favicon.ico',
      localeDefault: 'fr',
      localesEnabled: ['fr', 'en'],
      features: {
        darkMode: false,
        analytics: false,
        cookieConsent: true,
        newsletter: false,
        search: false,
        comments: false
      },
      contact: {
        email: 'contact@example.com',
        phone: '+33 1 23 45 67 89',
        address: 'Paris, France'
      },
      social: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        github: ''
      },
      seo: {
        metaDescription: 'Template Vue 3 avec Firebase Realtime Database et CMS intégré',
        metaKeywords: 'vue3, firebase, cms, template',
        ogImage: '',
        twitterCard: 'summary_large_image'
      },
      maintenance: {
        enabled: false,
        message: 'Site en maintenance. Nous revenons bientôt !'
      }
    }
  })
  
  /**
   * Cleanup listeners
   */
  const cleanup = () => {
    if (unlistenCurrent) unlistenCurrent()
    if (unlistenDraft) unlistenDraft()
    Object.values(unlistenI18n).forEach(unlisten => unlisten())
  }
  
  return {
    // State
    current,
    draft,
    i18nLive,
    i18nDraft,
    audit,
    previewMode,
    loading,
    active,
    
    // Actions
    init,
    loadCurrent,
    loadDraft,
    loadI18nLive,
    loadI18nDraft,
    loadAudit,
    saveDraft,
    saveI18nDraft,
    applyPreview,
    exitPreview,
    publishSettings,
    publishI18n,
    resetDraft,
    resetI18nDraft,
    restoreFromAudit,
    updateThemeColors,
    updateNavbarItems,
    updateNavbarConfig,
    updateFooter,
    updateThemeConfig,
    updateGeneral,
    updateI18nKey,
    deleteI18nKey,
    cleanup
  }
})

export default useSettingsStore
