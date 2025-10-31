<template>
  <div class="container">
    <div class="product-page">
      <h1>{{ $t('product.title') }}</h1>
      <p>{{ $t('product.description') }}</p>
      
      <div class="protected-content card">
        <h2>{{ $t('product.protected.title') }}</h2>
        <p>{{ $t('product.protected.desc') }}</p>
        
        <div class="product-features">
          <div class="feature">
            <h3>{{ $t('product.feature1.title') }}</h3>
            <p>{{ $t('product.feature1.desc') }}</p>
          </div>
          
          <div class="feature">
            <h3>{{ $t('product.feature2.title') }}</h3>
            <p>{{ $t('product.feature2.desc') }}</p>
          </div>
          
          <div class="feature">
            <h3>{{ $t('product.feature3.title') }}</h3>
            <p>{{ $t('product.feature3.desc') }}</p>
          </div>
        </div>
        
        <div class="user-details">
          <h3>{{ $t('product.user.title') }}</h3>
          <p><strong>{{ $t('product.user.uid') }}:</strong> <code>{{ authStore.user?.uid }}</code></p>
          <p><strong>{{ $t('product.user.email') }}:</strong> {{ authStore.user?.email || $t('auth.anonymous') }}</p>
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
.product-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
}

.product-page h1 {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.product-page > p {
  text-align: center;
  color: var(--muted);
  margin-bottom: var(--spacing-xl);
}

.protected-content {
  text-align: center;
}

.product-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.feature {
  padding: var(--spacing-lg);
  background-color: var(--bg-elev);
  border-radius: var(--radius-md);
}

.feature h3 {
  color: var(--primary);
  margin-bottom: var(--spacing-sm);
}

.user-details {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border);
  text-align: left;
}

.user-details code {
  background-color: var(--bg-elev);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}
</style>
