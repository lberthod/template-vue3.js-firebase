import { ref as dbRef, get, set, update, remove, push, onValue, off } from 'firebase/database'
import { db } from '../firebase/firebase'
import { useAuthStore } from '../stores/auth'

/**
 * Generic Realtime Database composable
 */

export const useDb = () => {
  const authStore = useAuthStore()
  
  /**
   * Get data at path
   */
  const getData = async (path) => {
    try {
      const snapshot = await get(dbRef(db, path))
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error(`Error getting data at ${path}:`, error)
      throw error
    }
  }
  
  /**
   * Set data at path
   */
  const setData = async (path, data) => {
    try {
      await set(dbRef(db, path), data)
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error)
      throw error
    }
  }
  
  /**
   * Update data at path
   */
  const updateData = async (path, updates) => {
    try {
      await update(dbRef(db, path), updates)
    } catch (error) {
      console.error(`Error updating data at ${path}:`, error)
      throw error
    }
  }
  
  /**
   * Remove data at path
   */
  const removeData = async (path) => {
    try {
      await remove(dbRef(db, path))
    } catch (error) {
      console.error(`Error removing data at ${path}:`, error)
      throw error
    }
  }
  
  /**
   * Push data (auto-generated key)
   */
  const pushData = async (path, data) => {
    try {
      const newRef = push(dbRef(db, path))
      await set(newRef, data)
      return newRef.key
    } catch (error) {
      console.error(`Error pushing data to ${path}:`, error)
      throw error
    }
  }
  
  /**
   * Listen to realtime updates
   */
  const listen = (path, callback) => {
    const reference = dbRef(db, path)
    onValue(reference, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null)
    })
    
    // Return unlisten function
    return () => off(reference)
  }
  
  /**
   * Private path helper - /app/private/{uid}/{relativePath}
   */
  const mine = (relativePath = '') => {
    if (!authStore.user?.uid) {
      throw new Error('User must be authenticated to access private data')
    }
    return `/app/private/${authStore.user.uid}${relativePath ? `/${relativePath}` : ''}`
  }
  
  return {
    get: getData,
    set: setData,
    update: updateData,
    remove: removeData,
    push: pushData,
    listen,
    mine
  }
}

export default useDb
