import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n/i18n'
import './assets/css/main.css'

// Create app
const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Mount
app.mount('#app')
