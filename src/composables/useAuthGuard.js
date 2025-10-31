import { useAuthStore } from '../stores/auth'
import { useDb } from './useDb'

/**
 * Route guards for authentication and roles
 */

export const useAuthGuard = () => {
  /**
   * Require authentication
   */
  const requireAuth = async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Wait for auth to initialize
    while (authStore.loading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    if (authStore.isAuthenticated) {
      next()
    } else {
      next('/')
    }
  }
  
  /**
   * Require specific role
   */
  const requireRole = (...allowedRoles) => {
    return async (to, from, next) => {
      const authStore = useAuthStore()
      const db = useDb()
      
      // Wait for auth to initialize
      while (authStore.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (!authStore.isAuthenticated) {
        next('/')
        return
      }
      
      try {
        // Check user role in database
        const role = await db.get(`/users/${authStore.user.uid}/role`)
        
        if (allowedRoles.includes(role)) {
          next()
        } else {
          console.warn(`User role "${role}" not authorized. Required: ${allowedRoles.join(' or ')}`)
          next('/')
        }
      } catch (error) {
        console.error('Error checking user role:', error)
        next('/')
      }
    }
  }
  
  return {
    requireAuth,
    requireRole
  }
}

export default useAuthGuard
