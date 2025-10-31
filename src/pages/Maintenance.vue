<template>
  <div class="container" style="padding: 4rem 0; text-align: center;">
    <h1 style="margin-bottom: 1rem;">🛠️ {{ $t('settings.general.maintenance') }}</h1>
    <p style="color: var(--muted); max-width: 720px; margin: 0 auto;">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const message = computed(() => settingsStore.active?.general?.maintenance?.message || 'Site en maintenance. Nous revenons bientôt !')
</script>
