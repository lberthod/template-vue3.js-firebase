import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Vérification des variables d'environnement
const missingVars = []
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value || value.includes('your_')) {
    missingVars.push(key)
  }
})

if (missingVars.length > 0) {
  console.error('❌ Firebase configuration incomplete. Missing or invalid variables:', missingVars)
  console.error('Please configure your .env.development or .env.production file')
}

// Initialisation Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export let analytics = null

// Initialize Analytics only in browser and when supported/measurementId present
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
      }
    })
  } catch (err) {
    // No-op: analytics is optional
  }
}

export default app
