import { ref } from 'vue'

/**
 * Toast notification system
 */

const toasts = ref([])
let idCounter = 0

export const useToast = () => {
  const show = (message, type = 'info', ttl = 3000) => {
    const id = ++idCounter
    const toast = { id, message, type, ttl }
    
    toasts.value.push(toast)
    
    // Auto-dismiss
    if (ttl > 0) {
      setTimeout(() => {
        remove(id)
      }, ttl)
    }
    
    return id
  }
  
  const success = (message, ttl = 3000) => {
    return show(message, 'success', ttl)
  }
  
  const error = (message, ttl = 5000) => {
    return show(message, 'error', ttl)
  }
  
  const info = (message, ttl = 3000) => {
    return show(message, 'info', ttl)
  }
  
  const warning = (message, ttl = 4000) => {
    return show(message, 'warning', ttl)
  }
  
  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove,
    clear
  }
}

export default useToast
