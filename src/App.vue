<template>
  <ErrorBoundary>
    <component :is="layout">
      <router-view />
    </component>
  </ErrorBoundary>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'
import { useAppStore } from './stores/app'
import { useI18nLive } from './composables/useI18nLive'
import ErrorBoundary from './components/ErrorBoundary.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const appStore = useAppStore()
const i18nLive = useI18nLive()

// Determine layout
const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layoutName === 'auth' ? AuthLayout : DefaultLayout
})

const ensureMeta = (name, attr = 'name') => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  return el
}

const applySeo = () => {
  const g = settingsStore.active?.general
  if (!g) return
  const title = g.siteTitle || 'Site'
  const desc = g.seo?.metaDescription || g.siteDescription || ''
  const keywords = g.seo?.metaKeywords || ''
  const ogImage = g.seo?.ogImage || ''
  const twitterCard = g.seo?.twitterCard || 'summary'
  
  document.title = title
  ensureMeta('description').setAttribute('content', desc)
  ensureMeta('keywords').setAttribute('content', keywords)
  // Open Graph
  ensureMeta('og:title', 'property').setAttribute('content', title)
  ensureMeta('og:description', 'property').setAttribute('content', desc)
  ensureMeta('og:image', 'property').setAttribute('content', ogImage)
  // Twitter
  ensureMeta('twitter:card', 'name').setAttribute('content', twitterCard)
  ensureMeta('twitter:title', 'name').setAttribute('content', title)
  ensureMeta('twitter:description', 'name').setAttribute('content', desc)
  ensureMeta('twitter:image', 'name').setAttribute('content', ogImage)
}

// Initialize app
onMounted(async () => {
  try {
    // Initialize auth
    await authStore.init()
    
    // Initialize settings (load current)
    await settingsStore.init()

    // Initialize i18n live (starts watchers for all locales)
    i18nLive.loadLive('fr')
    i18nLive.loadLive('en')
    
    // Apply SEO once settings are loaded
    applySeo()
    // Re-apply when settings change
    watch(() => settingsStore.active, () => applySeo(), { deep: true })

    // Mark app as ready
    appStore.setReady(true)
  } catch (error) {
    console.error('Error initializing app:', error)
  }
})

// Cleanup
onUnmounted(() => {
  settingsStore.cleanup()
  i18nLive.cleanup()
})
</script>

<style>
/* App-level styles in assets/css/main.css */
</style>
