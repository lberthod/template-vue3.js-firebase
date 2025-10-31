# CMS Settings - Spécifications

## Vue d'ensemble

Le CMS Settings est une interface d'administration permettant de gérer en ligne tous les aspects visuels et textuels de l'application sans redéploiement.

---

## Flux principal : Draft → Preview → Publish → Audit → Restore

```
┌─────────┐
│ CURRENT │ ← État publié (lecture publique)
└─────────┘
     ↑
     │ Publish
     │
┌─────────┐
│  DRAFT  │ ← Modifications en cours (admin/editor)
└─────────┘
     │
     │ Preview (mémoire uniquement)
     ↓
┌─────────┐
│  AUDIT  │ ← Historique horodaté
└─────────┘
     │
     │ Restore
     └──→ DRAFT
```

### Actions disponibles

| Action | Description | Effet |
|--------|-------------|-------|
| **Preview** | Applique draft en mémoire | Visualisation sans publication |
| **Publish** | Copie draft → current + snapshot audit | Publication définitive |
| **Reset** | Copie current → draft | Annule les modifications non publiées |
| **Restore** | Copie audit[timestamp] → draft | Restaure une version antérieure |

---

## Structure des données Settings

### `/app/settings/current` (publié)

```json
{
  "theme": {
    "colors": {
      "bg": "#ffffff",
      "bgElev": "#f8f9fa",
      "fg": "#212529",
      "border": "#dee2e6",
      "muted": "#6c757d",
      "primary": "#0d6efd",
      "success": "#198754",
      "danger": "#dc3545"
    }
  },
  "navbar": {
    "items": [
      { "id": "home", "visible": true, "order": 0, "labelKey": "nav.home", "path": "/" },
      { "id": "about", "visible": true, "order": 1, "labelKey": "nav.about", "path": "/about" },
      { "id": "contact", "visible": true, "order": 2, "labelKey": "nav.contact", "path": "/contact" },
      { "id": "product", "visible": true, "order": 3, "labelKey": "nav.product", "path": "/product" },
      { "id": "price", "visible": true, "order": 4, "labelKey": "nav.price", "path": "/price" }
    ]
  },
  "footer": {
    "visible": true,
    "textKey": "footer.copyright"
  },
  "general": {
    "siteTitle": "Vue Firebase CMS",
    "localeDefault": "fr",
    "localesEnabled": ["fr", "en"],
    "features": {
      "darkMode": false,
      "analytics": false
    }
  }
}
```

### `/app/settings/draft` (brouillon)

Structure identique à `current`.

### `/app/settings/audit/{timestamp}` (historique)

```json
{
  "timestamp": 1710345678000,
  "summary": "Mise à jour du thème principal - couleurs bleues",
  "user": "uid-de-l-editeur",
  "data": {
    /* snapshot complet de settings */
  }
}
```

---

## Structure des données i18n

### `/app/i18n/live/{locale}` (publié)

```json
{
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "nav.contact": "Contact",
  "nav.product": "Produit",
  "nav.price": "Tarifs",
  "footer.copyright": "© 2024 Vue Firebase CMS. Tous droits réservés.",
  "home.title": "Bienvenue",
  "home.subtitle": "Template Vue 3 avec Firebase et CMS intégré"
}
```

### `/app/i18n/draft/{locale}` (brouillon)

Structure identique à `live`.

### `/app/i18n/audit/{timestamp}` (historique)

```json
{
  "timestamp": 1710345678000,
  "summary": "Ajout traductions page contact",
  "user": "uid-de-l-editeur",
  "locale": "fr",
  "data": {
    /* snapshot complet i18n[locale] */
  }
}
```

---

## Organisation de la page Settings

### Onglets

1. **Theme**
   - Édition des couleurs (color pickers)
   - Preview en temps réel
   - Reset/Publish

2. **Navigation & Footer**
   - Navbar : liste triable avec visible/order/labelKey/path
   - Footer : visible + textKey
   - Preview/Publish/Reset

3. **i18n**
   - Sélecteur locale (FR/EN)
   - Sélecteur namespace (optionnel)
   - Table clé/valeur éditable
   - Recherche/filtre
   - Import/Export JSON
   - Preview/Publish/Reset

4. **Général**
   - siteTitle
   - localeDefault
   - localesEnabled (multi-select)
   - features flags (checkboxes)

5. **Historique**
   - Liste des snapshots audit (settings + i18n)
   - Affichage : timestamp, summary, user
   - Actions : Restore vers draft

---

## Politique de rétention

- **Nombre max de snapshots** : 20 (configurable)
- **Durée de conservation** : 30 jours (optionnel)
- **Nettoyage** : via script backend `db-maintenance.js`

---

## Validations

### Theme.colors
- Format hexadécimal valide (#RRGGBB)
- Contraste minimum AA (optionnel)

### Navbar.items
- `id` : unique, alphanumerique
- `labelKey` : doit exister dans i18n
- `path` : doit correspondre à une route
- `order` : entier >= 0

### i18n keys
- Format dot-case : `^[a-z0-9]+(\.[a-z0-9]+)*$`
- Longueur max : 64 caractères
- Valeur max : 200 caractères (recommandé)

### General
- `siteTitle` : 1-100 caractères
- `localeDefault` : doit être dans localesEnabled
- `localesEnabled` : minimum 1 locale

---

## Permissions

- **Lecture** : admin + editor (draft, audit)
- **Écriture** : admin + editor (draft, current, audit)
- **Gestion rôles** : admin uniquement

---

## Exemples d'usage

### Modifier le thème

1. Aller dans Settings > Theme
2. Modifier les couleurs
3. Cliquer "Preview" → visualisation immédiate
4. Si OK : "Publish" → persiste en DB + snapshot audit
5. Si KO : "Reset" → annule les modifications

### Ajouter une traduction

1. Aller dans Settings > i18n
2. Sélectionner locale (ex: FR)
3. Cliquer "Ajouter clé"
4. Saisir : clé = `forms.contact.phone.label`, valeur = `Téléphone`
5. Preview (vérifier dans l'app)
6. Publish

### Restaurer une version

1. Aller dans Settings > Historique
2. Trouver le snapshot souhaité
3. Cliquer "Restore" → copie dans draft
4. Vérifier dans les onglets Theme/Nav/i18n
5. Publish si OK

---

## Notes techniques

- **Preview** : état local (Pinia store `previewMode`)
- **Publish** : écrit en DB + crée snapshot
- **Audit summary** : généré automatiquement ou saisi manuellement
- **Import i18n** : accepte JSON plat ou arborescent (conversion auto)
- **Export i18n** : toujours en JSON plat
