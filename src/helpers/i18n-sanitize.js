// Sanitize i18n key-value map to avoid vue-i18n parse errors
// - Coerce non-string values to strings
// - Neutralize stray link tokens like "@:key" or "@.mod:key" by escaping @
// - Balance or escape lone braces to avoid ICU parse issues

// Replace ASCII '@' with FULLWIDTH '@' (U+FF20) to avoid vue-i18n linked parsing
const escapeAt = (str) => str
  // Normalize legacy escape sequences like \@ → @
  .replace(/\\@/g, '@')
  // Then replace all '@' with fullwidth variant
  .replace(/@/g, '＠')
const escapeLoneBraces = (str) => {
  // Replace single { with {{ and single } with }} to avoid ICU parse errors
  return str.replace(/\{/g, '{{').replace(/\}/g, '}}')
}

export function sanitizeI18nMessages(obj = {}) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    let val = v
    if (val === null || val === undefined) {
      val = ''
    }
    if (typeof val !== 'string') {
      try { val = String(val) } catch { val = '' }
    }
    // Basic neutralization of tokens that often cause runtime parser errors
    val = escapeAt(val)
    val = escapeLoneBraces(val)
    out[k] = val
  }
  return out
}

export default sanitizeI18nMessages
