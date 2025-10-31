// Dynamically load Google Fonts and apply font-family CSS variables
import { watch } from 'vue'

// Build a Google Fonts CSS2 URL for given font map and subsets
// families is an array of { name: 'Inter', weights: [400,700] }
const buildGoogleFontsUrl = (families = [], subsets = []) => {
  // normalize and merge duplicates by family name
  const map = new Map()
  families
    .filter(f => f && f.name)
    .forEach(f => {
      const name = String(f.name).split(',')[0].trim().replace(/\"|'|;/g, '')
      const w = Array.isArray(f.weights) ? f.weights : []
      const prev = map.get(name) || []
      map.set(name, prev.concat(w))
    })
  const cleaned = Array.from(map.entries()).map(([name, ws]) => ({
    name,
    weights: (ws.length ? Array.from(new Set(ws)) : [400]).sort((a,b)=>a-b)
  }))
  if (cleaned.length === 0) return ''
  const familyParam = cleaned
    .map(({ name, weights }) => `${name.replace(/\s+/g, '+')}:wght@${weights.join(';')}`)
    .join('&family=')
  const subsetParam = (subsets && subsets.length) ? `&subset=${Array.from(new Set(subsets)).join(',')}` : ''
  return `https://fonts.googleapis.com/css2?family=${familyParam}${subsetParam}&display=swap`
}

const ensureLink = (id, href) => {
  let link = document.getElementById(id)
  if (!href) {
    if (link) link.remove()
    return null
  }
  if (!link) {
    link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  if (link.href !== href) link.href = href
  return link
}

const ensurePreconnect = () => {
  const add = (href, crossorigin = false) => {
    const id = `preconnect-${href}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'preconnect'
    link.href = href
    if (crossorigin) link.crossOrigin = ''
    document.head.appendChild(link)
  }
  add('https://fonts.googleapis.com')
  add('https://fonts.gstatic.com', true)
}

export const useGoogleFonts = (settingsStore) => {
  const applyFontVars = (fonts = {}) => {
    const root = document.documentElement
    if (fonts.body) root.style.setProperty('--font-body', fonts.body)
    if (fonts.heading) root.style.setProperty('--font-heading', fonts.heading)
    if (fonts.mono) root.style.setProperty('--font-mono', fonts.mono)
  }

  const loadFonts = () => {
    const theme = settingsStore.active?.theme || {}
    const fonts = theme.fonts || {}
    const weights = theme.fontWeights || {}
    const subsets = theme.fontSubsets || []
    applyFontVars(fonts)
    const families = [
      { name: fonts.body, weights: weights.body },
      { name: fonts.heading, weights: weights.heading },
      { name: fonts.mono, weights: weights.mono }
    ]
    const href = buildGoogleFontsUrl(families, subsets)
    ensurePreconnect()
    ensureLink('gf-dynamic', href)
  }

  if (typeof window !== 'undefined') {
    loadFonts()
    const getter = () => ({
      fonts: settingsStore.active?.theme?.fonts,
      weights: settingsStore.active?.theme?.fontWeights,
      subsets: settingsStore.active?.theme?.fontSubsets
    })
    watch(getter, () => loadFonts(), { deep: true })
  }

  return { loadFonts }
}

export default useGoogleFonts
