#!/usr/bin/env node

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Database maintenance script
 * - Clean old audit entries
 * - Verify data integrity
 * - Run migrations if needed
 */

const isDryRun = process.argv.includes('--dryRun')

console.log('🔧 Database Maintenance')
console.log('Mode:', isDryRun ? 'DRY RUN' : 'LIVE')
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

/**
 * Clean old audit entries (keep last 20)
 */
async function cleanAudit() {
  console.log('\n📋 Cleaning audit entries...')
  
  try {
    // Settings audit
    const settingsAuditRef = db.ref('/app/settings/audit')
    const settingsSnapshot = await settingsAuditRef.once('value')
    const settingsAudit = settingsSnapshot.val() || {}
    
    const settingsEntries = Object.entries(settingsAudit)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
    
    if (settingsEntries.length > 20) {
      const toDelete = settingsEntries.slice(20)
      console.log(`  Settings: ${toDelete.length} old entries to delete`)
      
      if (!isDryRun) {
        for (const [key] of toDelete) {
          await settingsAuditRef.child(key).remove()
        }
      }
    } else {
      console.log(`  Settings: ${settingsEntries.length} entries (OK)`)
    }
    
    // i18n audit
    const i18nAuditRef = db.ref('/app/i18n/audit')
    const i18nSnapshot = await i18nAuditRef.once('value')
    const i18nAudit = i18nSnapshot.val() || {}
    
    const i18nEntries = Object.entries(i18nAudit)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
    
    if (i18nEntries.length > 20) {
      const toDelete = i18nEntries.slice(20)
      console.log(`  i18n: ${toDelete.length} old entries to delete`)
      
      if (!isDryRun) {
        for (const [key] of toDelete) {
          await i18nAuditRef.child(key).remove()
        }
      }
    } else {
      console.log(`  i18n: ${i18nEntries.length} entries (OK)`)
    }
    
    console.log('✅ Audit cleanup completed')
  } catch (error) {
    console.error('❌ Audit cleanup failed:', error)
  }
}

/**
 * Verify data integrity
 */
async function verifyIntegrity() {
  console.log('\n🔍 Verifying data integrity...')
  
  try {
    // Check that current settings exist
    const currentSettings = await db.ref('/app/settings/current').once('value')
    if (!currentSettings.exists()) {
      console.log('⚠️  No current settings found')
    } else {
      console.log('✅ Current settings exist')
    }
    
    // Check that i18n/live exists for enabled locales
    const locales = ['fr', 'en']
    for (const locale of locales) {
      const i18nLive = await db.ref(`/app/i18n/live/${locale}`).once('value')
      if (!i18nLive.exists()) {
        console.log(`⚠️  No live i18n for ${locale}`)
      } else {
        const count = Object.keys(i18nLive.val() || {}).length
        console.log(`✅ i18n ${locale}: ${count} keys`)
      }
    }
    
    console.log('✅ Integrity verification completed')
  } catch (error) {
    console.error('❌ Integrity verification failed:', error)
  }
}

/**
 * Run migrations (placeholder)
 */
async function runMigrations() {
  console.log('\n🔄 Checking for migrations...')
  
  // TODO: Add migrations here as needed
  console.log('  No migrations to run')
  
  console.log('✅ Migrations completed')
}

// Main execution
async function main() {
  try {
    await cleanAudit()
    await verifyIntegrity()
    await runMigrations()
    
    console.log('\n✅ Database maintenance completed')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Maintenance failed:', error)
    process.exit(1)
  }
}

main()
