<template>
  <div class="container">
    <div class="home-page">
      <h1>{{ $t('home.title') }}</h1>
      <p class="subtitle">{{ $t('home.subtitle') }}</p>
      <p>{{ $t('home.description') }}</p>
      
      <div v-if="authStore.isAuthenticated" class="user-info card">
        <h3>{{ $t('home.session.title') }}</h3>
        <p><strong>{{ $t('home.session.uid') }}:</strong> <code>{{ authStore.user?.uid }}</code></p>
        <p><strong>{{ $t('home.session.email') }}:</strong> {{ authStore.user?.email || $t('home.session.anonymous') }}</p>
        <p><strong>{{ $t('home.session.type') }}:</strong> {{ authStore.isAnonymous ? $t('home.session.anonymous') : $t('home.session.authenticated') }}</p>
      </div>
      
      <div class="features">
        <div class="feature-card card">
          <h3>{{ $t('home.feature.auth.icon') }} {{ $t('home.feature.auth.title') }}</h3>
          <p>{{ $t('home.feature.auth.desc') }}</p>
        </div>
        
        <div class="feature-card card">
          <h3>{{ $t('home.feature.theme.icon') }} {{ $t('home.feature.theme.title') }}</h3>
          <p>{{ $t('home.feature.theme.desc') }}</p>
        </div>
        
        <div class="feature-card card">
          <h3>{{ $t('home.feature.i18n.icon') }} {{ $t('home.feature.i18n.title') }}</h3>
          <p>{{ $t('home.feature.i18n.desc') }}</p>
        </div>
        
        <div class="feature-card card">
          <h3>{{ $t('home.feature.cms.icon') }} {{ $t('home.feature.cms.title') }}</h3>
          <p>{{ $t('home.feature.cms.desc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.home-page h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.subtitle {
  font-size: 1.5rem;
  color: var(--muted);
  margin-bottom: var(--spacing-xl);
}

.user-info {
  max-width: 600px;
  margin: var(--spacing-xl) auto;
  text-align: left;
}

.user-info code {
  background-color: var(--bg-elev);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.feature-card {
  text-align: center;
}

.feature-card h3 {
  margin-bottom: var(--spacing-sm);
}
</style>
