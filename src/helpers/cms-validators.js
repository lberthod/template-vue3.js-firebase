/**
 * CMS-specific validators
 */

export const isValidHexColor = (str) => {
  if (!str) return false
  return /^#[0-9A-Fa-f]{6}$/.test(str)
}

export const isValidI18nKey = (str) => {
  if (!str) return false
  // Format dot-case: lowercase alphanumeric with dots
  return /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(str)
}

export const maxLen = (str, n) => {
  if (!str) return true
  return str.length <= n
}

export const validateThemeColors = (colors) => {
  const errors = {}
  const requiredColors = ['bg', 'bgElev', 'fg', 'border', 'muted', 'primary']
  
  for (const color of requiredColors) {
    if (!colors[color]) {
      errors[color] = 'Couleur requise'
    } else if (!isValidHexColor(colors[color])) {
      errors[color] = 'Format hexadécimal invalide (#RRGGBB)'
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}

export const validateNavbarItem = (item) => {
  const errors = {}
  
  if (!item.id || !/^[a-zA-Z0-9-_]+$/.test(item.id)) {
    errors.id = 'ID invalide (alphanumerique)'
  }
  
  if (!item.labelKey || !isValidI18nKey(item.labelKey)) {
    errors.labelKey = 'Clé i18n invalide (dot-case)'
  }
  
  if (!item.path || !item.path.startsWith('/')) {
    errors.path = 'Path invalide (doit commencer par /)'
  }
  
  if (typeof item.order !== 'number' || item.order < 0) {
    errors.order = 'Order doit être un entier >= 0'
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}

export const validateI18nKeyValue = (key, value) => {
  const errors = {}
  
  if (!isValidI18nKey(key)) {
    errors.key = 'Format invalide (dot-case requis)'
  }
  
  if (key.length > 64) {
    errors.key = 'Maximum 64 caractères'
  }
  
  if (!value || value.trim() === '') {
    errors.value = 'Valeur requise'
  }
  
  if (value && value.length > 500) {
    errors.value = 'Maximum 500 caractères (recommandé: 200)'
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}

export default {
  isValidHexColor,
  isValidI18nKey,
  maxLen,
  validateThemeColors,
  validateNavbarItem,
  validateI18nKeyValue
}
