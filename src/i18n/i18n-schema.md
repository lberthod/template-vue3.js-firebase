# i18n Schema - Conventions

## Format des clés

### Règles
- **dot-case** : `lowercase.dot.separated`
- Pas d'espaces, pas de majuscules, pas de caractères spéciaux
- Namespaces obligatoires

### Pattern regex
```
^[a-z0-9]+(\.[a-z0-9]+)*$
```

### Limites recommandées
- Clé : ≤ 64 caractères
- Valeur : ≤ 200 caractères (500 max)

---

## Namespaces

### `nav.*`
Navigation principale

Exemples :
- `nav.home`
- `nav.about`
- `nav.contact`
- `nav.product`
- `nav.price`
- `nav.settings`

### `auth.*`
Authentification

Exemples :
- `auth.login`
- `auth.logout`
- `auth.email`
- `auth.password`
- `auth.loginGoogle`
- `auth.loginAnonymous`

### `footer.*`
Footer

Exemples :
- `footer.copyright`
- `footer.links`

### `home.*`
Page d'accueil

Exemples :
- `home.title`
- `home.subtitle`
- `home.description`

### `about.*`
Page À propos

Exemples :
- `about.title`
- `about.description`

### `contact.*`
Page Contact

Exemples :
- `contact.title`
- `contact.email.label`
- `contact.email.placeholder`
- `contact.message.label`
- `contact.submit`
- `contact.success`

### `product.*`
Page Produit

Exemples :
- `product.title`
- `product.description`

### `price.*`
Page Tarifs

Exemples :
- `price.title`
- `price.plan.free`
- `price.plan.pro`

### `settings.*`
Page Settings (CMS)

Exemples :
- `settings.title`
- `settings.theme`
- `settings.navigation`
- `settings.i18n`
- `settings.preview`
- `settings.publish`

### `errors.*`
Messages d'erreur

Exemples :
- `errors.required`
- `errors.email`
- `errors.minLength`
- `errors.maxLength`
- `errors.generic`

---

## Exemples de bonnes pratiques

### ✅ Correct
```
nav.home
forms.contact.email.label
errors.validation.required
settings.theme.colors.primary
```

### ❌ Incorrect
```
navHome                     // Pas de camelCase
NAV.HOME                    // Pas de majuscules
nav.home-page               // Pas de tirets
nav home                    // Pas d'espaces
nav.home.                   // Pas de point final
```

---

## Ajout de nouvelles clés

### Process
1. Définir le namespace approprié
2. Utiliser la convention dot-case
3. Ajouter dans le bundle local (`i18n/i18n.js`) pour les deux locales
4. Documenter dans ce fichier si c'est un nouveau namespace
5. Tester dans l'interface
6. Publier via le CMS si nécessaire

### Exemple complet
```javascript
// Dans i18n/i18n.js
const messages = {
  fr: {
    'blog.title': 'Blog',
    'blog.readMore': 'Lire la suite',
    'blog.author': 'Auteur',
    'blog.publishedAt': 'Publié le'
  },
  en: {
    'blog.title': 'Blog',
    'blog.readMore': 'Read more',
    'blog.author': 'Author',
    'blog.publishedAt': 'Published on'
  }
}
```

---

## Import/Export

### Format plat (recommandé)
```json
{
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "contact.title": "Contact"
}
```

### Format arborescent (supporté)
```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos"
  },
  "contact": {
    "title": "Contact"
  }
}
```

Le CMS convertira automatiquement le format arborescent en format plat.
