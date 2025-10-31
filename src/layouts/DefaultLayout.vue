<template>
  <div class="layout-default">
    <NavBar />
    
    <main class="main-content">
      <slot />
    </main>
    
    <AppFooter />
    
    <Toasts />
    
    <!-- Preview mode indicator -->
    <div v-if="settingsStore.previewMode" class="preview-mode-indicator">
      {{ $t('preview.indicator') }}
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/settings'
import NavBar from '../components/NavBar.vue'
import AppFooter from '../components/AppFooter.vue'
import Toasts from '../components/Toasts.vue'

const settingsStore = useSettingsStore()
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}
</style>
