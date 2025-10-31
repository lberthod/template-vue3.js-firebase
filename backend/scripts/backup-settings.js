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
 * Backup settings current data to JSON files
 */

console.log('📥 Backup Settings')
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

async function backupSettings() {
  try {
    const backupDir = process.env.BACKUP_DIR || join(__dirname, '../../backups')
    mkdirSync(backupDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    // Get current settings
    const settingsRef = db.ref('/app/settings/current')
    const snapshot = await settingsRef.once('value')
    const data = snapshot.val()
    
    if (!data) {
      console.log('⚠️  No settings data to backup')
      return
    }
    
    // Write to file
    const filename = `settings-backup-${timestamp}.json`
    const filepath = join(backupDir, filename)
    
    const backup = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      data
    }
    
    writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf8')
    
    // Log summary
    const summary = {
      theme: data.theme ? 'Yes' : 'No',
      navbar: data.navbar?.items?.length || 0,
      footer: data.footer?.visible ? 'Visible' : 'Hidden',
      general: data.general?.siteTitle || 'N/A'
    }
    
    console.log(`✅ Backup saved: ${filename}`)
    console.log(`   Theme: ${summary.theme}`)
    console.log(`   Navbar items: ${summary.navbar}`)
    console.log(`   Footer: ${summary.footer}`)
    console.log(`   Site title: ${summary.general}`)
    console.log(`   Path: ${filepath}`)
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  }
}

async function main() {
  try {
    await backupSettings()
    console.log('\n✅ Settings backup completed')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Backup failed:', error)
    process.exit(1)
  }
}

main()
