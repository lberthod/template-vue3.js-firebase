# 🎨 Fonctionnalités de personnalisation avancées

Le CMS offre maintenant une personnalisation complète de tous les aspects du site, éditable en ligne via `/settings`.

## 📋 Vue d'ensemble

Toutes ces options sont stockées dans Firebase Realtime Database (`/app/settings/current`) et éditables via l'interface CMS sans toucher au code.

## 🎨 Thème (Tab: Theme)

### Couleurs
- **bg** - Couleur de fond principale
- **bgElev** - Couleur de fond élevée (cards, etc.)
- **fg** - Couleur du texte principal
- **border** - Couleur des bordures
- **muted** - Couleur du texte secondaire
- **primary** - Couleur primaire (boutons, liens)
- **success** - Couleur de succès
- **danger** - Couleur de danger
- **warning** - Couleur d'avertissement
- **info** - Couleur d'information

### Polices (Nouveau)
- **body** - Police du texte courant
- **heading** - Police des titres (h1, h2, etc.)
- **mono** - Police monospace (code)

Exemple:
```json
"fonts": {
  "body": "Inter, system-ui, sans-serif",
  "heading": "Poppins, sans-serif",
  "mono": "Fira Code, monospace"
}
```

### Espacement (Nouveau)
- **container** - Largeur max du conteneur (ex: `1200px`, `90rem`)
- **padding** - Padding par défaut (ex: `1rem`, `16px`)
- **gap** - Gap entre les éléments (ex: `1.5rem`)

### Bordures (Nouveau)
- **borderRadius** - Arrondi des bordures (ex: `0.375rem`, `8px`, `0`)

### Mode sombre (Nouveau)
- **enabled** - Activer/désactiver le mode sombre
- **colors** - Palette de couleurs pour le mode sombre
  - bg, bgElev, fg, border, muted

Usage:
```json
"darkMode": {
  "enabled": true,
  "colors": {
    "bg": "#1a1a1a",
    "fg": "#f0f0f0"
  }
}
```

## 🧭 Navigation (Tab: Navigation & Footer)

### Options de la navbar (Nouveau)
- **position** - Position de la navbar (`top`, `bottom`)
- **sticky** - Navigation fixe en haut (true/false)
- **logoUrl** - URL du logo
- **logoAlt** - Texte alternatif du logo
- **showLogo** - Afficher/masquer le logo

### Items de navigation
- **id** - Identifiant unique
- **visible** - Visible/caché
- **order** - Ordre d'affichage
- **labelKey** - Clé i18n du label (ex: `nav.home`)
- **path** - Chemin de la route (ex: `/`, `/about`)

## 👣 Footer (Tab: Navigation & Footer)

- **visible** - Afficher/masquer le footer
- **textKey** - Clé i18n du texte (ex: `footer.copyright`)

## 🌍 i18n (Tab: i18n)

Édition complète de toutes les traductions:
- Ajouter/modifier/supprimer des clés
- Import/Export JSON
- Prévisualisation en temps réel
- Publication draft → live

## ⚙️ Général (Tab: Général)

### Informations du site (Nouveau)
- **siteTitle** - Titre du site
- **siteDescription** - Description du site
- **siteLogo** - URL du logo principal
- **siteFavicon** - URL du favicon

### Langues
- **localeDefault** - Langue par défaut (`fr`, `en`)
- **localesEnabled** - Langues activées (array: `["fr", "en"]`)

### Fonctionnalités (Nouveau)
- **darkMode** - Mode sombre
- **analytics** - Analytics
- **cookieConsent** - Consentement cookies
- **newsletter** - Newsletter
- **search** - Recherche sur le site
- **comments** - Système de commentaires

### Informations de contact (Nouveau)
- **email** - Email de contact
- **phone** - Téléphone
- **address** - Adresse physique

### Réseaux sociaux (Nouveau)
- **facebook** - URL du profil Facebook
- **twitter** - URL du profil Twitter
- **linkedin** - URL du profil LinkedIn
- **instagram** - URL du profil Instagram
- **github** - URL du profil GitHub

### SEO (Nouveau)
- **metaDescription** - Meta description pour les moteurs de recherche
- **metaKeywords** - Meta keywords (séparés par virgule)
- **ogImage** - Image Open Graph pour les partages sociaux
- **twitterCard** - Type de Twitter Card (`summary`, `summary_large_image`)

### Mode maintenance (Nouveau)
- **enabled** - Activer/désactiver le mode maintenance
- **message** - Message affiché en mode maintenance

Exemple:
```json
"maintenance": {
  "enabled": true,
  "message": "Site en maintenance. Nous revenons bientôt !"
}
```

## 📜 Historique (Tab: Historique)

- Audit complet de toutes les modifications
- Voir qui a modifié quoi et quand
- Restaurer une version antérieure en 1 clic
- Snapshots automatiques à chaque publication

## 🎯 Cas d'usage

### 1. Changer la palette de couleurs
```
Settings > Theme > Modifier les couleurs
→ Prévisualiser
→ Publier
→ Tout le site adopte les nouvelles couleurs
```

### 2. Ajouter un logo
```
Settings > Navigation & Footer
→ logoUrl: "https://example.com/logo.png"
→ showLogo: true
→ Publier
```

### 3. Activer le mode sombre
```
Settings > Theme > darkMode
→ enabled: true
→ Personnaliser les couleurs dark
→ Publier
```

### 4. Configurer les réseaux sociaux
```
Settings > Général > Social
→ facebook: "https://facebook.com/monsite"
→ twitter: "https://twitter.com/monsite"
→ Publier
```

### 5. Mode maintenance
```
Settings > Général > Maintenance
→ enabled: true
→ message: "Maintenance en cours..."
→ Publier
→ Le site affiche uniquement la page de maintenance
```

### 6. SEO
```
Settings > Général > SEO
→ metaDescription: "Mon super site..."
→ ogImage: "https://example.com/og.jpg"
→ Publier
→ Les balises meta sont mises à jour
```

## 🔄 Workflow

### Édition
1. Aller dans `/settings`
2. Choisir l'onglet (Theme, Navigation, i18n, Général, Historique)
3. Modifier les valeurs
4. Auto-save dans draft (400ms debounce)

### Prévisualisation
1. Cliquer **"👁️ Prévisualiser"**
2. Les changements s'appliquent temporairement
3. Naviguer sur le site pour voir le rendu
4. Désactiver le preview pour revenir au live

### Publication
1. Cliquer **"✓ Publier"**
2. Entrer un résumé de la modification
3. Confirmer
4. Les changements sont appliqués pour tous les utilisateurs
5. Un snapshot est créé dans l'historique

### Restauration
1. Aller dans Settings > Historique
2. Trouver la version souhaitée
3. Cliquer **"↺ Restaurer"**
4. La version est copiée dans le draft
5. Prévisualiser puis publier

## 📊 Structure Firebase

```
/app/settings
  /current           → Version live (lecture publique)
    /theme
      /colors
      /fonts
      /spacing
      /borderRadius
      /darkMode
    /navbar
      /position
      /sticky
      /logoUrl
      /items[]
    /footer
    /general
      /siteTitle
      /contact
      /social
      /seo
      /maintenance
      
  /draft             → Version en édition (auth requise)
    [même structure]
    
  /audit             → Historique des modifications
    /{timestamp}
      - timestamp
      - summary
      - user
      - data
```

## 🔐 Permissions

- **Lecture publique** : `/app/settings/current`
- **Lecture/Écriture auth** : `/app/settings/draft`, `/app/settings/audit`
- **Rôles requis** : `editor` ou `admin` pour modifier

## 🎨 Intégration dans le code

### Accéder aux settings dans un composant

```vue
<script setup>
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

// Accéder aux valeurs
const siteTitle = computed(() => settings.current.general?.siteTitle)
const primaryColor = computed(() => settings.current.theme?.colors?.primary)
const logoUrl = computed(() => settings.current.navbar?.logoUrl)
const socialLinks = computed(() => settings.current.general?.social)
</script>

<template>
  <h1>{{ siteTitle }}</h1>
  <img :src="logoUrl" alt="Logo">
  <a :href="socialLinks.facebook">Facebook</a>
</template>
```

### Appliquer les couleurs dynamiquement

```vue
<template>
  <div :style="themeStyles">
    <!-- contenu -->
  </div>
</template>

<script setup>
const themeStyles = computed(() => ({
  '--color-primary': settings.current.theme?.colors?.primary,
  '--color-bg': settings.current.theme?.colors?.bg,
  '--font-body': settings.current.theme?.fonts?.body,
  '--border-radius': settings.current.theme?.borderRadius
}))
</script>
```

## 🚀 Commandes de gestion

### Seed avec les nouvelles options
```bash
cd backend
npm run seed:files -- --overwrite
```

### Export pour backup
```bash
cd backend
npm run export:files
# Les fichiers sont dans backend/data-export/
```

### Sync i18n
```bash
cd backend
npm run i18n:sync:en
```

## ✅ Résumé

Le CMS permet maintenant de personnaliser:
- ✅ **Thème** : Couleurs, polices, espacement, bordures, mode sombre
- ✅ **Navigation** : Position, logo, items, sticky
- ✅ **Footer** : Visibilité, texte
- ✅ **i18n** : Toutes les traductions FR/EN
- ✅ **Général** : Site info, contact, réseaux sociaux, SEO, maintenance
- ✅ **Historique** : Audit complet avec restauration

**Tout est éditable en ligne, sans toucher au code, avec preview instantané et historique complet !** 🎉
