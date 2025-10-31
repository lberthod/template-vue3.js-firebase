#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Orchestrator for backend scripts
 */

const scripts = [
  { name: 'Hello', path: './scripts/hello.js' },
  { name: 'DB Maintenance', path: './scripts/db-maintenance.js', args: ['--dryRun'] },
  { name: 'Backup i18n', path: './scripts/backup-i18n.js' },
  { name: 'Backup Settings', path: './scripts/backup-settings.js' }
]

console.log('🚀 Starting backend orchestrator...\n')

const runScript = (script) => {
  return new Promise((resolve, reject) => {
    console.log(`▶️  Running: ${script.name}`)
    
    const scriptPath = join(__dirname, script.path)
    const child = spawn('node', [scriptPath, ...(script.args || [])], {
      stdio: 'inherit',
      cwd: __dirname
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${script.name} completed\n`)
        resolve()
      } else {
        console.error(`❌ ${script.name} failed with code ${code}\n`)
        reject(new Error(`Script ${script.name} failed`))
      }
    })
    
    child.on('error', (error) => {
      console.error(`❌ ${script.name} error:`, error)
      reject(error)
    })
  })
}

const runAll = async () => {
  const startTime = Date.now()
  
  for (const script of scripts) {
    try {
      await runScript(script)
    } catch (error) {
      console.error('Script failed, continuing...')
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n🏁 All scripts completed in ${duration}s`)
}

runAll().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
