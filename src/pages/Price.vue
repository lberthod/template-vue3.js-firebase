<template>
  <div class="container">
    <div class="price-page">
      <h1>{{ $t('price.title') }}</h1>
      
      <div class="pricing-plans">
        <div class="plan card">
          <h2>{{ $t('price.free.title') }}</h2>
          <div class="price">
            <span class="amount">{{ $t('price.free.price') }}</span>
            <span class="period">{{ $t('price.free.period') }}</span>
          </div>
          <ul class="features">
            <li>{{ $t('price.free.f1') }}</li>
            <li>{{ $t('price.free.f2') }}</li>
            <li>{{ $t('price.free.f3') }}</li>
            <li>{{ $t('price.free.f4') }}</li>
            <li>{{ $t('price.free.f5') }}</li>
          </ul>
          <button class="btn btn-outline">{{ $t('price.free.cta') }}</button>
        </div>
        
        <div class="plan card plan-featured">
          <div class="badge">{{ $t('price.pro.badge') }}</div>
          <h2>{{ $t('price.pro.title') }}</h2>
          <div class="price">
            <span class="amount">{{ $t('price.pro.price') }}</span>
            <span class="period">{{ $t('price.pro.period') }}</span>
          </div>
          <ul class="features">
            <li>{{ $t('price.pro.f1') }}</li>
            <li>{{ $t('price.pro.f2') }}</li>
            <li>{{ $t('price.pro.f3') }}</li>
            <li>{{ $t('price.pro.f4') }}</li>
            <li>{{ $t('price.pro.f5') }}</li>
          </ul>
          <button class="btn">{{ $t('price.pro.cta') }}</button>
        </div>
        
        <div class="plan card">
          <h2>{{ $t('price.enterprise.title') }}</h2>
          <div class="price">
            <span class="amount">{{ $t('price.enterprise.price') }}</span>
          </div>
          <ul class="features">
            <li>{{ $t('price.enterprise.f1') }}</li>
            <li>{{ $t('price.enterprise.f2') }}</li>
            <li>{{ $t('price.enterprise.f3') }}</li>
            <li>{{ $t('price.enterprise.f4') }}</li>
            <li>{{ $t('price.enterprise.f5') }}</li>
          </ul>
          <button class="btn btn-outline">{{ $t('price.enterprise.cta') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-page {
  padding: var(--spacing-xl) 0;
}

.price-page h1 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.plan {
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-base);
}

.plan:hover {
  transform: translateY(-8px);
}

.plan-featured {
  border: 2px solid var(--primary);
  box-shadow: var(--shadow-lg);
}

.badge {
  position: absolute;
  top: -12px;
  right: var(--spacing-lg);
  background-color: var(--primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
}

.plan h2 {
  margin-bottom: var(--spacing-md);
}

.price {
  margin-bottom: var(--spacing-xl);
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

.period {
  font-size: 1rem;
  color: var(--muted);
}

.features {
  list-style: none;
  padding: 0;
  margin: var(--spacing-xl) 0;
  flex: 1;
  text-align: left;
}

.features li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border);
}

.features li:last-child {
  border-bottom: none;
}

.plan button {
  width: 100%;
  margin-top: auto;
}
</style>
