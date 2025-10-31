#!/usr/bin/env node

import admin from 'firebase-admin'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Backup i18n live data to JSON files
 */

console.log('📥 Backup i18n')
console.log('')

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(
    readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json', 'utf8')
  )
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })
  
  console.log('✅ Firebase Admin initialized')
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message)
  process.exit(1)
}

const db = admin.database()

async function backupI18n() {
  try {
    const backupDir = process.env.BACKUP_DIR || join(__dirname, '../../backups')
    mkdirSync(backupDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    // Get all i18n live data
    const i18nRef = db.ref('/app/i18n/live')
    const snapshot = await i18nRef.once('value')
    const data = snapshot.val()
    
    if (!data) {
      console.log('⚠️  No i18n data to backup')
      return
    }
    
    // Count total keys
    let totalKeys = 0
    for (const locale in data) {
      totalKeys += Object.keys(data[locale] || {}).length
    }
    
    // Write to file
    const filename = `i18n-backup-${timestamp}.json`
    const filepath = join(backupDir, filename)
    
    const backup = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      data
    }
    
    writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf8')
    
    console.log(`✅ Backup saved: ${filename}`)
    console.log(`   Locales: ${Object.keys(data).join(', ')}`)
    console.log(`   Total keys: ${totalKeys}`)
    console.log(`   Path: ${filepath}`)
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  }
}

async function main() {
  try {
    await backupI18n()
    console.log('\n✅ i18n backup completed')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Backup failed:', error)
    process.exit(1)
  }
}

main()
