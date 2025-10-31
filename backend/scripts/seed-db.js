#!/usr/bin/env node

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const args = process.argv.slice(2)
const FORCE = args.includes('--force')

function log(msg) { console.log(msg) }
function err(msg) { console.error(msg) }

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(
    readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json', 'utf8')
  )
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })
  
  log('✅ Firebase Admin initialized')
} catch (error) {
  err('❌ Failed to initialize Firebase Admin: ' + error.message)
  process.exit(1)
}

const db = admin.database()

// Default settings and i18n seed
const defaultSettings = {
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
    }
  },
  navbar: {
    items: [
      { id: 'home', visible: true, order: 0, labelKey: 'nav.home', path: '/' },
      { id: 'about', visible: true, order: 1, labelKey: 'nav.about', path: '/about' },
      { id: 'contact', visible: true, order: 2, labelKey: 'nav.contact', path: '/contact' },
      { id: 'product', visible: true, order: 3, labelKey: 'nav.product', path: '/product' },
      { id: 'price', visible: true, order: 4, labelKey: 'nav.price', path: '/price' },
      { id: 'settings', visible: true, order: 5, labelKey: 'nav.settings', path: '/settings' }
    ]
  },
  footer: {
    visible: true,
    textKey: 'footer.copyright'
  },
  general: {
    siteTitle: 'Vue Firebase CMS',
    localeDefault: 'fr',
    localesEnabled: ['fr', 'en'],
    features: { darkMode: false, analytics: false }
  }
}

// Minimal i18n seed (enrich later via CMS)
const DOT = '.'
const DB_DOT = '·' // U+00B7
const encodeKeys = (obj = {}) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [String(k).replace(/\./g, DB_DOT), v])
)
const i18nFr = {
  'nav.home': 'Accueil',
  'nav.about': 'À propos',
  'nav.contact': 'Contact',
  'nav.product': 'Produit',
  'nav.price': 'Tarifs',
  'nav.settings': 'Paramètres',
  'footer.copyright': '© 2024 Vue Firebase CMS. Tous droits réservés.',
  'home.title': 'Bienvenue',
  'home.subtitle': 'Template Vue 3 avec Firebase et CMS intégré',
  'contact.title': 'Contact'
}

const i18nEn = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.product': 'Product',
  'nav.price': 'Pricing',
  'nav.settings': 'Settings',
  'footer.copyright': '© 2024 Vue Firebase CMS. All rights reserved.',
  'home.title': 'Welcome',
  'home.subtitle': 'Vue 3 Template with Firebase and integrated CMS',
  'contact.title': 'Contact'
}

async function setIfEmpty(refPath, value) {
  const ref = db.ref(refPath)
  const snap = await ref.once('value')
  if (!snap.exists() || FORCE) {
    await ref.set(value)
    log(`✅ Seeded ${refPath}${FORCE ? ' (force)' : ''}`)
  } else {
    log(`↩︎ Skipped ${refPath} (already exists) — use --force to overwrite`)
  }
}

async function main() {
  try {
    log('🌱 Seeding Realtime Database...')

    // Settings
    await setIfEmpty('/app/settings/current', defaultSettings)
    await setIfEmpty('/app/settings/draft', defaultSettings)

    // i18n live + draft
    await setIfEmpty('/app/i18n/live/fr', encodeKeys(i18nFr))
    await setIfEmpty('/app/i18n/live/en', encodeKeys(i18nEn))
    await setIfEmpty('/app/i18n/draft/fr', encodeKeys(i18nFr))
    await setIfEmpty('/app/i18n/draft/en', encodeKeys(i18nEn))

    log('🎉 Seed completed')
    process.exit(0)
  } catch (e) {
    err('❌ Seed failed: ' + e.message)
    process.exit(1)
  }
}

main()
