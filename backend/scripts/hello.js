#!/usr/bin/env node

/**
 * Hello script - test that pipeline works
 */

console.log('👋 Hello from backend scripts!')
console.log('📅 Timestamp:', new Date().toISOString())
console.log('🖥️  Node version:', process.version)
console.log('📁 Working directory:', process.cwd())

// Simulate some work
await new Promise(resolve => setTimeout(resolve, 500))

console.log('✅ Hello script completed')
process.exit(0)
