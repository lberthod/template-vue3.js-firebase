<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo / Title -->
        <router-link to="/" class="navbar-brand">
          <template v-if="showLogo">
            <img :src="logoSrc" :alt="logoAlt" class="navbar-logo" />
          </template>
          <template v-else>
            {{ settingsStore.active?.general?.siteTitle || 'Vue CMS' }}
          </template>
        </router-link>
        
        <!-- Navigation items -->
        <div class="navbar-items">
          <router-link
            v-for="item in visibleItems"
            :key="item.id"
            :to="item.path"
            class="nav-link"
            active-class="nav-link-active"
          >
            {{ $t(item.labelKey) }}
          </router-link>
          
          <!-- Settings link (visible si connecté) -->
          <router-link
            v-if="authStore.isAuthenticated"
            to="/settings"
            class="nav-link"
            active-class="nav-link-active"
          >
            {{ $t('nav.settings') }}
          </router-link>
        </div>
        
        <!-- Right section: Language + Auth -->
        <div class="navbar-right">
          <!-- Language switcher -->
          <div class="lang-switcher">
            <button
              v-for="loc in availableLocales"
              :key="loc"
              @click="switchLocale(loc)"
              :class="['lang-btn', { active: locale === loc }]"
            >
              {{ loc.toUpperCase() }}
            </button>
          </div>
          
          <!-- Auth section -->
          <div class="auth-section">
            <template v-if="authStore.isAuthenticated">
              <span class="user-email">
                {{ authStore.isAnonymous ? 'Anonyme' : authStore.user?.email }}
              </span>
              <button @click="handleLogout" class="btn btn-sm btn-outline">
                {{ $t('auth.logout') }}
              </button>
            </template>
            <template v-else>
              <button @click="handleLoginAnonymous" class="btn btn-sm">
                {{ $t('auth.loginAnonymous') }}
              </button>
              <button @click="handleLoginGoogle" class="btn btn-sm btn-outline">
                {{ $t('auth.loginGoogle') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useSettingsStore } from '../stores/settings'
import { useToast } from '../composables/useToast'

const { locale, t } = useI18n()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toast = useToast()

// Computed
const visibleItems = computed(() => {
  const items = settingsStore.active?.navbar?.items || []
  return items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order)
})

const availableLocales = computed(() => {
  return settingsStore.active?.general?.localesEnabled || ['fr', 'en']
})

// Logo helpers (fallback to general.siteLogo)
const logoSrc = computed(() => settingsStore.active?.navbar?.logoUrl || settingsStore.active?.general?.siteLogo || '')
const logoAlt = computed(() => settingsStore.active?.navbar?.logoAlt || 'Logo')
const showLogo = computed(() => {
  const explicit = settingsStore.active?.navbar?.showLogo
  // default to true if a logo URL exists
  const hasLogo = !!logoSrc.value
  return (explicit === undefined ? hasLogo : explicit) && hasLogo
})

// Plus de vérification de rôle : accès aux paramètres si authentifié

// Methods
const switchLocale = (loc) => {
  locale.value = loc
  // Optionally persist to localStorage
  localStorage.setItem('locale', loc)
}

const handleLoginAnonymous = async () => {
  try {
    await authStore.loginAnonymous()
    toast.success(t('auth.success.anonymous'))
  } catch (error) {
    toast.error(t('auth.error.login'))
  }
}

const handleLoginGoogle = async () => {
  try {
    await authStore.loginGoogle()
    toast.success(t('auth.success.google'))
  } catch (error) {
    toast.error(t('auth.error.google'))
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.info(t('auth.success.logout'))
  } catch (error) {
    toast.error(t('auth.error.logout'))
  }
}
</script>

<style scoped>
.navbar {
  background-color: var(--bg-elev);
  border-bottom: 1px solid var(--border);
  padding: var(--spacing-md) 0;
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--fg);
  text-decoration: none;
}

.navbar-logo {
  height: 28px;
  width: auto;
  display: block;
}

.navbar-items {
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
}

.nav-link {
  color: var(--fg);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background-color: var(--bg);
  color: var(--primary);
}

.nav-link-active {
  background-color: var(--primary);
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.lang-switcher {
  display: flex;
  gap: var(--spacing-xs);
}

.lang-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
  border: 1px solid var(--border);
  background-color: var(--bg);
  color: var(--muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.lang-btn:hover {
  background-color: var(--bg-elev);
}

.lang-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-email {
  font-size: 0.875rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .navbar-items {
    flex-direction: column;
  }
  
  .navbar-right {
    flex-direction: column;
  }
}
</style>
