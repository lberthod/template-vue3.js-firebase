import { createI18n } from 'vue-i18n'

/**
 * Default i18n messages (fallback bundle)
 */
const messages = {
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.product': 'Produit',
    'nav.price': 'Tarifs',
    'nav.settings': 'Paramètres',
    
    'auth.login': 'Se connecter',
    'auth.logout': 'Se déconnecter',
    'auth.loginEmail': 'Email / Mot de passe',
    'auth.loginGoogle': 'Google',
    'auth.loginAnonymous': 'Anonyme',
    'auth.register': "S'inscrire",
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    
    'footer.copyright': '© 2024 Vue Firebase CMS. Tous droits réservés.',
    
    'home.title': 'Bienvenue',
    'home.subtitle': 'Template Vue 3 avec Firebase et CMS intégré',
    'home.description': 'Ce template fournit une base complète pour développer des applications Vue 3 avec Firebase Realtime Database et un CMS intégré.',
    
    'about.title': 'À propos',
    'about.description': 'Template Vue 3 + Firebase Realtime Database avec CMS intégré pour la gestion du contenu.',
    
    'contact.title': 'Contact',
    'contact.email.label': 'Email',
    'contact.email.placeholder': 'votre@email.com',
    'contact.message.label': 'Message',
    'contact.message.placeholder': 'Votre message...',
    'contact.submit': 'Envoyer',
    'contact.success': 'Message envoyé avec succès !',
    
    'product.title': 'Produit',
    'product.description': 'Cette page est protégée et nécessite une authentification.',
    
    'price.title': 'Tarifs',
    
    'settings.title': 'Paramètres',
    'settings.theme': 'Thème',
    'settings.navigation': 'Navigation & Footer',
    'settings.i18n': 'Traductions',
    'settings.general': 'Général',
    'settings.history': 'Historique',
    'settings.preview': 'Prévisualiser',
    'settings.publish': 'Publier',
    'settings.reset': 'Réinitialiser',
    'settings.restore': 'Restaurer',
    'settings.save': 'Enregistrer',
    
    'errors.required': 'Ce champ est requis',
    'errors.email': 'Email invalide',
    'errors.minLength': 'Minimum {min} caractères',
    'errors.maxLength': 'Maximum {max} caractères',
    'errors.generic': 'Une erreur est survenue'
  },
  
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.product': 'Product',
    'nav.price': 'Pricing',
    'nav.settings': 'Settings',
    
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.loginEmail': 'Email / Password',
    'auth.loginGoogle': 'Google',
    'auth.loginAnonymous': 'Anonymous',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    
    'footer.copyright': '© 2024 Vue Firebase CMS. All rights reserved.',
    
    'home.title': 'Welcome',
    'home.subtitle': 'Vue 3 Template with Firebase and integrated CMS',
    'home.description': 'This template provides a complete foundation for developing Vue 3 applications with Firebase Realtime Database and an integrated CMS.',
    
    'about.title': 'About',
    'about.description': 'Vue 3 + Firebase Realtime Database template with integrated CMS for content management.',
    
    'contact.title': 'Contact',
    'contact.email.label': 'Email',
    'contact.email.placeholder': 'your@email.com',
    'contact.message.label': 'Message',
    'contact.message.placeholder': 'Your message...',
    'contact.submit': 'Send',
    'contact.success': 'Message sent successfully!',
    
    'product.title': 'Product',
    'product.description': 'This page is protected and requires authentication.',
    
    'price.title': 'Pricing',
    
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.navigation': 'Navigation & Footer',
    'settings.i18n': 'Translations',
    'settings.general': 'General',
    'settings.history': 'History',
    'settings.preview': 'Preview',
    'settings.publish': 'Publish',
    'settings.reset': 'Reset',
    'settings.restore': 'Restore',
    'settings.save': 'Save',
    
    'errors.required': 'This field is required',
    'errors.email': 'Invalid email',
    'errors.minLength': 'Minimum {min} characters',
    'errors.maxLength': 'Maximum {max} characters',
    'errors.generic': 'An error occurred'
  }
}

/**
 * Create i18n instance
 */
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})

export default i18n
