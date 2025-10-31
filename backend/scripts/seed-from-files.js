#!/usr/bin/env node

import admin from 'firebase-admin'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

// Args: --dir=./data --scope=both --overwrite
const args = process.argv.slice(2)
const dataDir = (args.find(a => a.startsWith('--dir='))?.split('=')[1]) || './data'
const scope = (args.find(a => a.startsWith('--scope='))?.split('=')[1] || 'both').toLowerCase() // live|draft|both
const overwrite = args.includes('--overwrite')

const DB_DOT = '·' // U+00B7 safe replacement for '.' in RTDB keys
const encodeKeys = (obj = {}) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [String(k).replace(/\./g, DB_DOT), v])
)

function log(msg) { console.log(msg) }
function err(msg) { console.error(msg) }

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'))
}

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

async function write(path, value) {
  const ref = db.ref(path)
  if (!overwrite) {
    const snap = await ref.once('value')
    if (snap.exists()) {
      log(`↩︎ Skipped ${path} (exists) — use --overwrite to replace`)
      return
    }
  }
  await ref.set(value)
  log(`✅ Wrote ${path}`)
}

async function seed() {
  const dir = join(process.cwd(), dataDir)
  log(`📁 Loading data from ${dir}`)

  // Settings
  try {
    const settings = readJson(join(dir, 'settings.json'))
    if (scope === 'live' || scope === 'both') {
      await write('/app/settings/current', settings)
    }
    if (scope === 'draft' || scope === 'both') {
      await write('/app/settings/draft', settings)
    }
  } catch (e) {
    log('ℹ️  No settings.json found (skip settings)')
  }

  // i18n files pattern: i18n-<locale>.json
  const files = readdirSync(dir).filter(f => /^i18n-[a-zA-Z_\-]+\.json$/.test(f))
  for (const f of files) {
    const locale = f.replace(/^i18n-/, '').replace(/\.json$/, '')
    const data = readJson(join(dir, f))
    const encoded = encodeKeys(data)
    if (scope === 'live' || scope === 'both') {
      await write(`/app/i18n/live/${locale}`, encoded)
    }
    if (scope === 'draft' || scope === 'both') {
      await write(`/app/i18n/draft/${locale}`, encoded)
    }
  }
}

seed()
  .then(() => { log('🎉 Seed from files completed'); process.exit(0) })
  .catch((e) => { err('❌ Seed from files failed: ' + e.message); process.exit(1) })
