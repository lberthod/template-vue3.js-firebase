<template>
  <footer v-if="isVisible" class="footer">
    <div class="container">
      <p class="footer-text">{{ $t(textKey) }}</p>

      <div v-if="hasSocial" class="social-links">
        <a v-if="social.facebook" :href="social.facebook" target="_blank" rel="noopener" aria-label="Facebook" class="icon-link" title="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.63-1.3 1.3V12h2.2l-.35 3H14v7A10 10 0 0 0 22 12"/></svg>
        </a>
        <a v-if="social.twitter" :href="social.twitter" target="_blank" rel="noopener" aria-label="Twitter" class="icon-link" title="Twitter">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.87-2.36 8.47 8.47 0 0 1-2.7 1.03 4.24 4.24 0 0 0-7.23 3.86A12.05 12.05 0 0 1 3.16 4.9a4.23 4.23 0 0 0 1.31 5.66c-.65-.02-1.26-.2-1.8-.49v.05a4.24 4.24 0 0 0 3.4 4.16c-.31.08-.65.12-.99.12-.24 0-.48-.02-.71-.07a4.25 4.25 0 0 0 3.96 2.94A8.51 8.51 0 0 1 2 19.54a12.03 12.03 0 0 0 6.52 1.91c7.83 0 12.12-6.49 12.12-12.12v-.55c.83-.6 1.55-1.35 2.12-2.2z"/></svg>
        </a>
        <a v-if="social.linkedin" :href="social.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn" class="icon-link" title="LinkedIn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 17.34V9.75H6V17.34h2.34m-1.17-8.67c.75 0 1.35-.6 1.35-1.34c0-.74-.6-1.34-1.35-1.34c-.74 0-1.34.6-1.34 1.34c0 .74.6 1.34 1.34 1.34m10.83 8.67v-4.13c0-2.22-1.18-3.25-2.76-3.25c-1.27 0-1.84.7-2.16 1.19v-1.02H11.5c.03.67 0 7.21 0 7.21h2.34v-4.03c0-.22.02-.45.08-.61c.18-.45.57-.92 1.23-.92c.87 0 1.22.7 1.22 1.74v3.82h2.33Z"/></svg>
        </a>
        <a v-if="social.instagram" :href="social.instagram" target="_blank" rel="noopener" aria-label="Instagram" class="icon-link" title="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7m10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10m-5 3.5A5.5 5.5 0 1 0 17.5 13A5.5 5.5 0 0 0 12 7.5m0 2A3.5 3.5 0 1 1 8.5 13A3.5 3.5 0 0 1 12 9.5M18 6.25a.75.75 0 1 0 .75.75A.75.75 0 0 0 18 6.25Z"/></svg>
        </a>
        <a v-if="social.github" :href="social.github" target="_blank" rel="noopener" aria-label="GitHub" class="icon-link" title="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19c-.46-1.18-1.12-1.5-1.12-1.5c-.91-.62.07-.61.07-.61c1 .07 1.52 1.03 1.52 1.03c.9 1.52 2.36 1.08 2.94.83c.1-.66.35-1.1.64-1.35c-2.22-.25-4.55-1.11-4.55-4.95c0-1.1.39-2 .1-2.71c0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02c.2.71.1 1.61.1 2.7c0 3.85-2.34 4.7-4.57 4.95c.36.31.69.92.69 1.86v2.75c0 .27.18.59.69.49A10 10 0 0 0 12 2Z"/></svg>
        </a>
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
  display: inline-flex;
  align-items: center;
}

.social-links a:hover {
  color: var(--primary);
}

.icon-link svg {
  width: 20px;
  height: 20px;
}
</style>
