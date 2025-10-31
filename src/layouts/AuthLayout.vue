<template>
  <div class="layout-auth">
    <div class="auth-container">
      <slot />
    </div>
    
    <Toasts />
  </div>
</template>

<script setup>
import Toasts from '../components/Toasts.vue'
</script>

<style scoped>
.layout-auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-elev);
  padding: var(--spacing-lg);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}
</style>
