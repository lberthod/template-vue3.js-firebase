#!/usr/bin/env node

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// Flags
const args = process.argv.slice(2)
const target = (args.find(a => a.startsWith('--target='))?.split('=')[1] || 'en').toLowerCase()
const scope = (args.find(a => a.startsWith('--scope='))?.split('=')[1] || 'both').toLowerCase() // live|draft|both

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

async function copyPath(src, dst) {
  const srcRef = db.ref(src)
  const dstRef = db.ref(dst)
  const snap = await srcRef.once('value')
  if (!snap.exists()) {
    log(`⚠️  Source is empty: ${src}`)
    return
  }
  const data = snap.val()
  await dstRef.set(data) // keys are already encoded in DB (·), keep as-is
  log(`✅ Copied ${src} → ${dst}`)
}

async function main() {
  try {
    if (target === 'fr') {
      err('❌ Target cannot be fr (source and target must differ)')
      process.exit(1)
    }

    log(`🔁 Sync i18n from fr → ${target} (scope: ${scope})`)

    if (scope === 'live' || scope === 'both') {
      await copyPath(`/app/i18n/live/fr`, `/app/i18n/live/${target}`)
    }

    if (scope === 'draft' || scope === 'both') {
      await copyPath(`/app/i18n/draft/fr`, `/app/i18n/draft/${target}`)
    }

    log('🎉 Sync completed')
    process.exit(0)
  } catch (e) {
    err('❌ Sync failed: ' + e.message)
    process.exit(1)
  }
}

main()
