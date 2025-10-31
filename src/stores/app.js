import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Global app state
 */
export const useAppStore = defineStore('app', () => {
  const ready = ref(false)
  const loading = ref(false)
  
  const setReady = (value) => {
    ready.value = value
  }
  
  const setLoading = (value) => {
    loading.value = value
  }
  
  return {
    ready,
    loading,
    setReady,
    setLoading
  }
})

export default useAppStore
