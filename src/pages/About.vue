<template>
  <div class="container">
    <div class="about-page">
      <h1>{{ $t('about.title') }}</h1>
      <p>{{ $t('about.description') }}</p>
      
      <div class="about-content card">
        <h2>{{ $t('about.tech.title') }}</h2>
        <ul>
          <li><strong>Vue 3</strong> - {{ $t('about.tech.vue') }}</li>
          <li><strong>Vite</strong> - {{ $t('about.tech.vite') }}</li>
          <li><strong>Pinia</strong> - {{ $t('about.tech.pinia') }}</li>
          <li><strong>Vue Router</strong> - {{ $t('about.tech.router') }}</li>
          <li><strong>Vue I18n</strong> - {{ $t('about.tech.i18n') }}</li>
          <li><strong>Firebase</strong> - {{ $t('about.tech.firebase') }}</li>
        </ul>
        
        <h2>{{ $t('about.features.title') }}</h2>
        <ul>
          <li>{{ $t('about.features.auth') }}</li>
          <li>{{ $t('about.features.realtime') }}</li>
          <li>{{ $t('about.features.cms') }}</li>
          <li>{{ $t('about.features.theme') }}</li>
          <li>{{ $t('about.features.i18n') }}</li>
          <li>{{ $t('about.features.audit') }}</li>
          <li>{{ $t('about.features.guards') }}</li>
        </ul>
        
        <h2>{{ $t('about.architecture.title') }}</h2>
        <p>{{ $t('about.architecture.desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
}

.about-page h1 {
  margin-bottom: var(--spacing-xl);
}

.about-content {
  text-align: left;
}

.about-content h2 {
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  color: var(--primary);
}

.about-content ul {
  list-style-position: inside;
  padding-left: var(--spacing-md);
}

.about-content li {
  margin-bottom: var(--spacing-sm);
}
</style>
