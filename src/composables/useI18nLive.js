import { useDb } from './useDb'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeI18nMessages } from '../helpers/i18n-sanitize'
import { decodeI18nKeys } from '../helpers/db-i18n'

/**
 * Live i18n updates from Firebase
 */

export const useI18nLive = () => {
  const db = useDb()
  const { locale, mergeLocaleMessage } = useI18n()
  const liveMessages = ref({})
  const unlisteners = {}
  
  /**
   * Load and listen to live translations for a locale
   */
  const loadLive = (localeCode) => {
    const path = `/app/i18n/live/${localeCode}`
    
    // Unlisten previous if exists
    if (unlisteners[localeCode]) {
      unlisteners[localeCode]()
    }
    
    // Listen to updates
    unlisteners[localeCode] = db.listen(path, (data) => {
      if (data) {
        console.log(`[i18n-live] Received update for ${localeCode}`, Object.keys(data).length, 'keys')
        console.log(`[i18n-live] Sample DB keys (encoded):`, Object.keys(data).slice(0, 3))
        const decoded = decodeI18nKeys(data)
        console.log(`[i18n-live] Sample decoded keys:`, Object.keys(decoded).slice(0, 3))
        const sanitized = sanitizeI18nMessages(decoded)
        console.log(`[i18n-live] Sample values:`, {
          'home.title': sanitized['home.title'],
          'nav.home': sanitized['nav.home'],
          'contact.email.placeholder': sanitized['contact.email.placeholder']
        })
        liveMessages.value[localeCode] = sanitized
        mergeLocaleMessage(localeCode, sanitized)
        console.log(`[i18n-live] ✅ Merged ${localeCode} into runtime`)
      }
    })
  }
  
  /**
   * Load draft translations (for preview)
   */
  const loadDraft = async (localeCode) => {
    const path = `/app/i18n/draft/${localeCode}`
    try {
      const data = await db.get(path)
      if (data) {
        const decoded = decodeI18nKeys(data)
        return sanitizeI18nMessages(decoded)
      }
    } catch (error) {
      console.error(`Error loading draft i18n for ${localeCode}:`, error)
    }
    return null
  }
  
  /**
   * Merge draft into runtime (preview mode)
   */
  const mergeDraft = (localeCode, draftData) => {
    if (draftData) {
      const decoded = decodeI18nKeys(draftData)
      const sanitized = sanitizeI18nMessages(decoded)
      mergeLocaleMessage(localeCode, sanitized)
    }
  }
  
  /**
   * Cleanup listeners
   */
  const cleanup = () => {
    Object.values(unlisteners).forEach(unlisten => unlisten())
  }
  
  // Watch locale changes to load appropriate live data
  watch(locale, (newLocale) => {
    if (newLocale && !liveMessages.value[newLocale]) {
      loadLive(newLocale)
    }
  }, { immediate: true })
  
  return {
    liveMessages,
    loadLive,
    loadDraft,
    mergeDraft,
    cleanup
  }
}

export default useI18nLive
