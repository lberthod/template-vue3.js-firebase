import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase/firebase'

/**
 * Authentication store
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  const isAnonymous = computed(() => user.value?.isAnonymous || false)
  
  /**
   * Initialize auth listener
   */
  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        resolve(firebaseUser)
      })
    })
  }
  
  /**
   * Login with email and password
   */
  const loginEmail = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Register with email and password
   */
  const register = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Login with Google
   */
  const loginGoogle = async () => {
    try {
      loading.value = true
      error.value = null
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      return result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Login anonymously
   */
  const loginAnonymous = async () => {
    try {
      loading.value = true
      error.value = null
      const result = await signInAnonymously(auth)
      user.value = result.user
      return result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Logout
   */
  const logout = async () => {
    try {
      loading.value = true
      error.value = null
      await signOut(auth)
      user.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAnonymous,
    init,
    loginEmail,
    register,
    loginGoogle,
    loginAnonymous,
    logout
  }
})

export default useAuthStore
