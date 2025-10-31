<template>
  <div class="toasts-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button @click="remove(toast.id)" class="toast-close">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toasts-container {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  background-color: var(--bg);
  border: 1px solid var(--border);
  color: var(--fg);
}

.toast-success {
  background-color: var(--success);
  color: white;
  border-color: var(--success);
}

.toast-error {
  background-color: var(--danger);
  color: white;
  border-color: var(--danger);
}

.toast-warning {
  background-color: var(--warning);
  color: #000;
  border-color: var(--warning);
}

.toast-info {
  background-color: var(--info);
  color: #000;
  border-color: var(--info);
}

.toast-message {
  flex: 1;
  font-size: 0.9375rem;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.toast-close:hover {
  opacity: 1;
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toasts-container {
    left: var(--spacing-md);
    right: var(--spacing-md);
    max-width: none;
  }
}
</style>
