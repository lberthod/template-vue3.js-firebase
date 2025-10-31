# Test de la mise à jour en temps réel

## 🔧 Corrections appliquées

1. ✅ Chargement des deux locales (FR et EN) au démarrage
2. ✅ Cleanup des listeners i18n
3. ✅ Logs de debug pour voir les mises à jour

## 🧪 Comment tester

### 1. Redémarrer le serveur dev

```bash
# Ctrl+C pour arrêter
npm run dev
```

### 2. Ouvrir deux onglets

**Onglet 1**: Page d'accueil
- http://localhost:5173/

**Onglet 2**: Settings i18n
- http://localhost:5173/settings?tab=i18n

### 3. Tester la mise à jour en temps réel

Dans **Onglet 2** (Settings):
1. Chercher la clé `home.title`
2. Modifier "Bienvenue" → "Bonjour"
3. La modification est auto-sauvegardée (debounce 400ms)

Dans **Onglet 1** (Home):
- Le titre devrait changer automatiquement après quelques secondes
- Ouvrir la console (F12) pour voir les logs:
  ```
  [i18n-live] Received update for fr 250 keys
  [i18n-live] Merged fr into runtime
  ```

### 4. Si ça ne marche pas

#### Vérifier dans la console
```
[i18n-live] Received update for fr ...
```
- ✅ Si ce message apparaît: le listener Firebase fonctionne
- ❌ Si pas de message: problème de connexion Firebase

#### Publier le draft

Si vous êtes en mode draft et que ça ne met pas à jour:
1. Dans Settings > i18n
2. Cliquer sur **"✓ Publier"**
3. Confirmer
4. Ça va copier draft → live
5. Le changement devrait apparaître immédiatement

#### Vérifier Firebase Console

1. Ouvrir Firebase Console > Realtime Database
2. Aller dans `/app/i18n/live/fr`
3. Chercher `home·title` (notez le point médian ·)
4. La valeur doit être "Bonjour" (ou votre modification)

## 🔍 Debug

### Vérifier que les listeners sont actifs

Console navigateur:
```js
// Vérifier que l'app écoute bien Firebase
// Les logs [i18n-live] doivent apparaître
```

### Forcer un rechargement

Si vraiment rien ne se passe:
```bash
# 1. Arrêter le dev server (Ctrl+C)
# 2. Vider le cache navigateur (Shift+F5)
# 3. Relancer
npm run dev
```

## 📝 Workflow normal

### Draft → Preview → Publish

**Mode normal** (sans publier):
- Modifications dans Settings > i18n
- Auto-save dans `/app/i18n/draft/fr`
- **PAS de mise à jour sur les autres pages** (seulement en mode preview)

**Mode preview** (bouton "👁️ Prévisualiser"):
- Active le mode preview dans Settings
- Charge les drafts et les merge dans le runtime
- Les changements sont visibles PARTOUT temporairement
- Désactiver le preview pour revenir au live

**Mode publish** (bouton "✓ Publier"):
- Copie `/app/i18n/draft/fr` → `/app/i18n/live/fr`
- Crée un snapshot dans l'audit
- **Les changements sont maintenant live pour TOUS les utilisateurs**
- Mise à jour automatique en temps réel sur toutes les pages

## ✅ Ce qui devrait marcher maintenant

1. **Au démarrage**: Charge FR et EN depuis `/app/i18n/live`
2. **En édition**: Auto-save dans draft (400ms debounce)
3. **En preview**: Voir les changements du draft partout
4. **Après publish**: Mise à jour temps réel sur toutes les pages ouvertes

## 🎯 Test rapide

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Seed la DB
cd backend
npm run seed:files -- --overwrite

# Navigateur:
# 1. Ouvrir http://localhost:5173
# 2. Se connecter (Anonyme)
# 3. Créer admin: Firebase Console > /users/{uid}/role: "admin"
# 4. Rafraîchir la page
# 5. Aller dans Settings > i18n
# 6. Modifier home.title
# 7. Publier
# 8. Retourner à Home → titre mis à jour
```

## 🐛 Si le problème persiste

Vérifier:
1. Firebase Realtime Database Rules sont bien déployées
2. L'utilisateur est authentifié
3. La connexion Firebase est active (pas de CORS, pas de firewall)
4. Les logs console montrent bien `[i18n-live] Received update`

## 📞 Aide supplémentaire

Envoyer les logs console si ça ne marche toujours pas:
- Console (F12) > Copier tous les logs qui commencent par `[i18n-live]`
- Vérifier aussi s'il y a des erreurs Firebase en rouge
