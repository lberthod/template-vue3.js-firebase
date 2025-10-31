<template>
  <footer v-if="isVisible" class="footer">
    <div class="container">
      <p class="footer-text">{{ $t(textKey) }}</p>

      <div v-if="hasSocial" class="social-links">
        <a v-if="social.facebook" :href="social.facebook" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
        <a v-if="social.twitter" :href="social.twitter" target="_blank" rel="noopener" aria-label="Twitter">Twitter</a>
        <a v-if="social.linkedin" :href="social.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
        <a v-if="social.instagram" :href="social.instagram" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
        <a v-if="social.github" :href="social.github" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const isVisible = computed(() => {
  return settingsStore.active?.footer?.visible !== false
})

const textKey = computed(() => {
  return settingsStore.active?.footer?.textKey || 'footer.copyright'
})

const social = computed(() => settingsStore.active?.general?.social || {})
const hasSocial = computed(() => {
  const s = social.value
  return !!(s.facebook || s.twitter || s.linkedin || s.instagram || s.github)
})
</script>

<style scoped>
.footer {
  background-color: var(--bg-elev);
  border-top: 1px solid var(--border);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-text {
  text-align: center;
  color: var(--muted);
  font-size: 0.875rem;
  margin: 0;
}

.social-links {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.social-links a {
  color: var(--muted);
  text-decoration: none;
}

.social-links a:hover {
  color: var(--primary);
}
</style>
