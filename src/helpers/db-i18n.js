// Encode/decode i18n keys for Firebase Realtime DB (no dots allowed in keys)
// Strategy: replace '.' with '·' (U+00B7) when writing to DB, and reverse on read.
// This character is safe for RTDB keys and visually distinct.

export const DB_DOT = '·'

export function encodeI18nKeys(obj = {}) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const encKey = String(k).replace(/\./g, DB_DOT)
    out[encKey] = v
  }
  return out
}

export function decodeI18nKeys(obj = {}) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const decKey = String(k).replace(new RegExp(DB_DOT, 'g'), '.')
    out[decKey] = v
  }
  return out
}
