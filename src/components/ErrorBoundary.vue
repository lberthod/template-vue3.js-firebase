<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h1>{{ $t('error.title') }}</h1>
      <p>{{ error?.message || $t('error.unknown') }}</p>
      <button @click="retry" class="btn">{{ $t('error.retry') }}</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err) => {
  console.error('ErrorBoundary caught:', err)
  error.value = err
  hasError.value = true
  return false
})

const retry = () => {
  hasError.value = false
  error.value = null
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-elev);
  padding: var(--spacing-lg);
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.error-content h1 {
  color: var(--danger);
  margin-bottom: var(--spacing-lg);
}

.error-content p {
  color: var(--muted);
  margin-bottom: var(--spacing-xl);
}
</style>
