# Guide de Déploiement

## 🎯 Checklist avant déploiement

### 1. Configuration Firebase

- [ ] Projet Firebase créé
- [ ] Realtime Database activée
- [ ] Authentication activée (Email, Google, Anonyme)
- [ ] Rules Firebase déployées (voir `docs/realtime-rules.md`)
- [ ] Variables d'environnement configurées

### 2. Base de données initialisée

```bash
cd backend
npm run seed:files -- --overwrite
```

Vérifier dans Firebase Console que :
- `/app/settings/current` et `/app/settings/draft` existent
- `/app/i18n/live/fr` et `/app/i18n/live/en` contiennent les traductions
- `/app/i18n/draft/fr` et `/app/i18n/draft/en` contiennent les traductions

### 3. Build de production

```bash
npm run build
```

Vérifier qu'il n'y a pas d'erreurs et que le dossier `dist/` est créé.

### 4. Variables d'environnement production

Créer `.env.production` :

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 Options de déploiement

### Option 1: Firebase Hosting (Recommandé)

#### Installation
```bash
npm install -g firebase-tools
firebase login
```

#### Initialisation
```bash
firebase init hosting
```

Répondre:
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deploys: `No` (ou `Yes` si vous voulez CI/CD)

#### Déploiement
```bash
npm run build
firebase deploy --only hosting
```

#### URL
Votre site sera disponible sur `https://your-project.web.app`

### Option 2: Netlify

#### Via l'interface

1. Connecter votre repo GitHub sur netlify.com
2. Configurer:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Ajouter les variables d'environnement (VITE_*)
4. Déployer

#### Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option 3: Vercel

#### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## ⚙️ Configuration post-déploiement

### 1. Créer le premier admin

Dans Firebase Console > Realtime Database:

```json
{
  "users": {
    "YOUR_USER_UID": {
      "role": "admin"
    }
  }
}
```

Pour obtenir votre UID:
1. Se connecter sur l'app déployée
2. Ouvrir la console navigateur
3. L'UID est affiché dans les logs ou dans Firebase Console > Authentication

### 2. Tester l'accès Settings

1. Se connecter avec le compte admin
2. Naviguer vers `/settings`
3. Vérifier que tous les onglets sont accessibles
4. Faire une modification test et publier

### 3. Configurer les domaines autorisés

Firebase Console > Authentication > Settings > Authorized domains
- Ajouter votre domaine de production

## 🔐 Sécurité

### Firebase Rules

Vérifier que les règles sont bien déployées :

```bash
firebase deploy --only database
```

Les règles doivent suivre ce pattern:
- `/app/settings/current` : lecture publique, écriture auth
- `/app/i18n/live/{locale}` : lecture publique, écriture auth
- `/app/settings/draft` : lecture/écriture auth
- `/app/i18n/draft/{locale}` : lecture/écriture auth
- `/users/{uid}` : lecture/écriture propriétaire uniquement

### Variables sensibles

❌ Ne jamais commiter:
- `.env.local`
- `.env.production`
- `backend/serviceAccountKey.json`
- `backend/.env`

✅ Ajouter au `.gitignore`:
```
.env.local
.env.production
backend/serviceAccountKey.json
backend/.env
```

## 🔄 Workflow de mise à jour

### 1. Développement local

```bash
# Créer une branche
git checkout -b feature/new-feature

# Développer et tester
npm run dev

# Commit
git commit -m "Add new feature"
git push origin feature/new-feature
```

### 2. Review et merge

- Créer une Pull Request
- Review du code
- Merger dans `main`

### 3. Déploiement

```bash
# Pull la dernière version
git checkout main
git pull

# Build
npm run build

# Deploy
firebase deploy --only hosting
# ou netlify deploy --prod
# ou vercel --prod
```

## 📊 Monitoring

### Firebase Console

- **Authentication**: Suivre les connexions
- **Realtime Database**: Monitorer les écritures/lectures
- **Hosting**: Trafic et performance

### Analytics (optionnel)

Si `VITE_FIREBASE_MEASUREMENT_ID` est configuré:
- Firebase Analytics activé automatiquement
- Dashboard disponible dans Firebase Console

## 🐛 Troubleshooting déploiement

### Build fail

```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build
```

### Firebase deploy fail

```bash
# Re-login
firebase logout
firebase login
firebase deploy --only hosting
```

### Variables d'environnement non prises en compte

- Vérifier que les variables commencent par `VITE_`
- Rebuild après modification des variables
- Vérifier sur la plateforme que les variables sont bien configurées

### Database permission denied

- Vérifier les rules Firebase
- Vérifier que l'utilisateur a le bon rôle dans `/users/{uid}/role`

## 📝 Checklist finale

- [ ] Build passe sans erreur
- [ ] Variables d'environnement production configurées
- [ ] Firebase Rules déployées
- [ ] Base de données seedée
- [ ] Premier admin créé
- [ ] Test de connexion OK
- [ ] Test Settings OK
- [ ] Test i18n OK
- [ ] Analytics activé (optionnel)
- [ ] Domaines autorisés configurés
- [ ] .gitignore à jour

## 🎉 Site en production !

URL: `https://your-project.web.app` (ou votre domaine custom)

Pour toute question, consulter:
- README.md
- docs/
- Firebase Console logs
