import { createRouter, createWebHistory } from 'vue-router'
import { useAuthGuard } from '../composables/useAuthGuard'
import { useSettingsStore } from '../stores/settings'

const { requireAuth } = useAuthGuard()

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../pages/Contact.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../pages/Product.vue'),
    meta: { layout: 'default' },
    beforeEnter: requireAuth
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import('../pages/Price.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/Settings.vue'),
    meta: { layout: 'default' },
    beforeEnter: requireAuth
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../pages/Maintenance.vue'),
    meta: { layout: 'default' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Global maintenance guard
router.beforeEach((to, from, next) => {
  const settingsStore = useSettingsStore()
  const maintenanceEnabled = settingsStore.active?.general?.maintenance?.enabled
  if (maintenanceEnabled && to.name !== 'Settings' && to.name !== 'Maintenance') {
    next({ name: 'Maintenance' })
  } else {
    next()
  }
})

export default router
