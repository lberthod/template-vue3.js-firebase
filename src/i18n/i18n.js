import { createI18n } from 'vue-i18n'

// DB-only i18n: start with empty bundles; everything comes from Realtime DB
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: { fr: {}, en: {} },
  // Disable linked messages (e.g., @:key) to avoid parsing emails like user@email.com
  // Return null so no linked key is recognized
  linkKeyMatcher: () => null
})

export default i18n
