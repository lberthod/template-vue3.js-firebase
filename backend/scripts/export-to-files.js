#!/usr/bin/env node

import admin from 'firebase-admin'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

// Args: --dir=./data --scope=live
const args = process.argv.slice(2)
const exportDir = (args.find(a => a.startsWith('--dir='))?.split('=')[1]) || './data-export'
const scope = (args.find(a => a.startsWith('--scope='))?.split('=')[1] || 'live').toLowerCase() // live|draft

const DB_DOT = '·'
const decodeKeys = (obj = {}) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [String(k).replace(new RegExp(DB_DOT, 'g'), '.'), v])
)

function log(msg) { console.log(msg) }
function err(msg) { console.error(msg) }

// Init Admin SDK
try {
  const serviceAccount = JSON.parse(
    readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json', 'utf8')
  )
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })
  log('✅ Firebase Admin initialized')
} catch (e) {
  err('❌ Failed to initialize Firebase Admin: ' + e.message)
  process.exit(1)
}

const db = admin.database()

async function exportDb() {
  const dir = join(process.cwd(), exportDir)
  mkdirSync(dir, { recursive: true })
  log(`📁 Exporting to ${dir}`)

  // Settings
  const settingsPath = scope === 'live' ? '/app/settings/current' : '/app/settings/draft'
  const settingsSnap = await db.ref(settingsPath).once('value')
  if (settingsSnap.exists()) {
    const settings = settingsSnap.val()
    writeFileSync(join(dir, 'settings.json'), JSON.stringify(settings, null, 2), 'utf8')
    log('✅ Exported settings.json')
  }

  // i18n (all locales)
  const i18nPath = `/app/i18n/${scope}`
  const i18nSnap = await db.ref(i18nPath).once('value')
  if (i18nSnap.exists()) {
    const locales = i18nSnap.val()
    for (const [locale, data] of Object.entries(locales)) {
      const decoded = decodeKeys(data)
      writeFileSync(join(dir, `i18n-${locale}.json`), JSON.stringify(decoded, null, 2), 'utf8')
      log(`✅ Exported i18n-${locale}.json`)
    }
  }

  log('🎉 Export completed')
}

exportDb()
  .then(() => process.exit(0))
  .catch((e) => { err('❌ Export failed: ' + e.message); process.exit(1) })
