# Debug i18n - Vérifier ce qui est chargé

## 1. Vérifier dans la console navigateur

Ouvrez la console (F12) et tapez:

```js
// Voir toutes les traductions chargées en FR
window.$nuxt?.$i18n?.messages?.fr || window.$i18n?.global?.messages?.value?.fr

// Ou pour Vue 3
const app = document.querySelector('#app').__vueParentComponent
app.appContext.config.globalProperties.$i18n.messages.value.fr

// Version simple - vérifier une clé spécifique
console.log('home.title =', window.location)
// Puis dans la console:
$t('home.title')
```

## 2. Voir les logs de chargement

Dans la console, cherchez:
```
[i18n-live] Received update for fr XXX keys
[i18n-live] Merged fr into runtime
```

Ces logs montrent QUAND les traductions sont chargées depuis Firebase.

## 3. Vérifier Firebase Console

### Ce qui est stocké en DB
- Ouvrez Firebase Console > Realtime Database
- Allez dans `/app/i18n/live/fr`
- Les clés sont encodées avec `·` au lieu de `.`:
  - `home·title` = "Bienvenue"
  - `contact·email·placeholder` = "votre＠email.com" (notez le @ fullwidth)

### Pourquoi c'est différent?

**En base de données (Firebase):**
- Clés: `home·title` (point médian · U+00B7)
- Emails: `votre＠email.com` (arobase pleine chasse ＠ U+FF20)

**Dans l'application (runtime):**
- Clés: `home.title` (point normal)
- Emails: `votre＠email.com` (arobase pleine chasse ＠)
- Le décodage transforme `·` → `.` automatiquement
- Les `@` restent en fullwidth pour éviter les erreurs de parsing

## 4. Vérifier le flux complet

### A. Vérifier que le listener Firebase est actif

Console:
```js
// Si vous voyez ces logs, le listener fonctionne
[i18n-live] Received update for fr 250 keys
[i18n-live] Merged fr into runtime
```

### B. Vérifier le contenu chargé

Ajoutez temporairement dans `src/composables/useI18nLive.js` ligne 36:

```js
console.log('[i18n-live] Merged ${localeCode} into runtime')
console.log('[i18n-live] Sample keys:', Object.keys(sanitized).slice(0, 5))
console.log('[i18n-live] home.title =', sanitized['home.title'])
```

### C. Comparer draft vs live

**Draft** (en édition):
- Path: `/app/i18n/draft/fr`
- Visible seulement en mode Preview ou après publication

**Live** (affiché aux utilisateurs):
- Path: `/app/i18n/live/fr`
- C'est ce que l'app charge automatiquement

**Pour publier draft → live:**
1. Settings > i18n > Modifier
2. Cliquer **"✓ Publier"**
3. Confirmer le résumé

## 5. Forcer le rechargement

Si vous ne voyez pas vos modifications:

```bash
# 1. Arrêter le dev server
Ctrl+C

# 2. Vider le cache navigateur
Shift+F5 (hard reload)

# 3. Relancer
npm run dev

# 4. Ouvrir directement
http://localhost:5173
```

## 6. Script de debug rapide

Ajoutez dans la console:

```js
// Inspecter i18n
const i18n = document.querySelector('#app').__vueParentComponent.appContext.config.globalProperties.$i18n
console.log('Locale:', i18n.locale.value)
console.log('Messages FR:', i18n.messages.value.fr)
console.log('Messages EN:', i18n.messages.value.en)
console.log('home.title FR:', i18n.t('home.title', {}, { locale: 'fr' }))
console.log('home.title EN:', i18n.t('home.title', {}, { locale: 'en' }))
```

## 7. Vérifier l'encodage

Les caractères spéciaux sont remplacés pour la sécurité:

| Original | En DB Firebase | Dans l'app |
|----------|----------------|------------|
| `home.title` | `home·title` | `home.title` |
| `user@email.com` | `user＠email.com` | `user＠email.com` |
| `{count}` | `{{count}}` | `{{count}}` |

## 8. Différence entre ce que vous voyez?

### Cas 1: Vous éditez mais ça ne change pas
→ Vous modifiez le **draft** mais l'app affiche le **live**
→ Solution: Cliquer **"✓ Publier"**

### Cas 2: Firebase montre autre chose
→ Les clés sont encodées en DB (· au lieu de .)
→ C'est normal, le décodage se fait à la lecture

### Cas 3: Les emails ont un @ bizarre
→ L'@ est remplacé par ＠ (fullwidth) pour éviter les erreurs vue-i18n
→ C'est intentionnel

## 9. Vérification complète

```bash
# 1. Vérifier Firebase Console
/app/i18n/live/fr/home·title = "Bienvenue"

# 2. Vérifier dans Settings > i18n
Locale: FR
Chercher: home.title
Valeur: "Bienvenue"

# 3. Vérifier sur la page
/ (Home) → titre doit afficher "Bienvenue"

# 4. Si différent, publier
Settings > i18n > Modifier home.title → "Bonjour"
Cliquer "✓ Publier"
Retourner sur / → titre devient "Bonjour"
```

## 10. Obtenir un snapshot complet

Dans la console:

```js
// Exporter toutes les traductions FR
const i18n = document.querySelector('#app').__vueParentComponent.appContext.config.globalProperties.$i18n
const fr = i18n.messages.value.fr
console.log(JSON.stringify(fr, null, 2))

// Copier-coller le résultat pour voir exactement ce qui est chargé
```

## Dites-moi ce que vous voyez

1. **Dans Firebase Console** `/app/i18n/live/fr` → quelle valeur pour `home·title` ?
2. **Dans Settings > i18n** (FR) → quelle valeur pour `home.title` ?
3. **Sur la page Home** → quel titre s'affiche ?
4. **Dans la console navigateur** → tapez `$t('home.title')` → que voyez-vous ?

Avec ces infos, je pourrai vous dire exactement où est le décalage.
