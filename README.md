# Vue 3 + Firebase Realtime Database + CMS Template

Template complet Vue 3 avec Firebase Realtime Database et CMS intégré pour la gestion du contenu.

## 🎯 Fonctionnalités

### Authentification
- Email/Password
- Google OAuth
- Connexion anonyme
- Guards de routes avec gestion des rôles (user/editor/admin)

### CMS Intégré
- **Thème** : Personnalisation des couleurs en ligne
- **Navigation** : Gestion de la navbar et du footer
- **i18n** : Édition des traductions FR/EN en ligne
- **Général** : Configuration du site
- **Historique** : Audit complet avec restauration

### Workflow CMS
```
Draft → Preview → Publish → Audit → Restore
```

### Base de données temps réel
- Firebase Realtime Database
- Écoute en temps réel des modifications
- Sécurité via rules (lecture publique pour settings/i18n live)

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Firebase avec projet configuré
- Firebase Realtime Database activé
- Firebase Authentication activé (Email, Google, Anonyme)

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd template
npm install
```

### 2. Configuration Firebase

#### Frontend

Copier `.env.development` et remplir avec vos credentials Firebase :

```bash
cp .env.development .env.development.local
```

Éditer `.env.development.local` :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://votre_projet.firebaseio.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Télécharger votre Service Account Key depuis Firebase Console :
- Aller dans Project Settings > Service Accounts
- Cliquer "Generate new private key"
- Sauvegarder le fichier comme `backend/serviceAccountKey.json`

Éditer `backend/.env` :

```env
FIREBASE_DATABASE_URL=https://votre_projet.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
BACKUP_DIR=../backups
```

### 3. Configuration Firebase Console

#### Activer Authentication

1. Aller dans **Authentication** > **Sign-in method**
2. Activer :
   - Email/Password
   - Google
   - Anonymous
3. Ajouter les domaines autorisés (localhost, votre domaine de production)

#### Configurer Realtime Database

1. Créer une database (région EU conseillée)
2. Aller dans **Rules**
3. Copier-coller les règles depuis `docs/realtime-rules.md`
4. Publier les règles

#### Créer le premier admin

Dans **Realtime Database**, créer manuellement :

```
/users/
  {votre_uid}/
    role: "admin"
```

Pour obtenir votre UID, connectez-vous une fois à l'app puis regardez dans la console navigateur ou Firebase Console > Authentication.

## 🏃 Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
```

## 🏗️ Build

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

## 🧪 Tests

```bash
# Lancer les tests
npm test
```

## 🔧 Backend Scripts

```bash
cd backend

# Seed & Sync
npm run seed                   # Seed initial (ne remplace pas l'existant)
npm run seed:force             # Seed avec écrasement
npm run seed:files             # Seed depuis fichiers JSON (backend/data)
npm run i18n:sync:en           # Copier FR → EN
npm run export:files           # Exporter DB → fichiers JSON

# Maintenance
npm start                      # Orchestrateur (lance tous les scripts)
npm run hello                  # Test pipeline
npm run maintenance            # Nettoyage et vérifications
npm run backup:i18n           # Backup traductions
npm run backup:settings       # Backup paramètres
```

### Workflow contenu

#### Initialisation DB
```bash
cd backend
npm run seed:files -- --overwrite
```

#### Édition en ligne
- Ouvrir `/settings?tab=i18n`
- Modifier les traductions
- Publier

#### Export pour versioning
```bash
cd backend
npm run export:files -- --dir=./data-export --scope=live
# Les fichiers sont dans backend/data-export/
```

## 📁 Structure du projet

```
template/
├── .github/workflows/         # CI/CD
├── backend/                   # Scripts Node.js
│   ├── scripts/
│   │   ├── hello.js
│   │   ├── db-maintenance.js
│   │   ├── backup-i18n.js
│   │   └── backup-settings.js
│   └── index.js
├── docs/                      # Documentation
│   ├── realtime-rules.md
│   ├── architecture-decisions.md
│   └── cms-settings.md
├── src/
│   ├── assets/css/           # Styles globaux
│   ├── components/           # Composants Vue
│   ├── composables/          # Hooks réutilisables
│   ├── firebase/             # Config Firebase
│   ├── helpers/              # Utilitaires
│   ├── i18n/                 # Internationalisation
│   ├── layouts/              # Layouts
│   ├── pages/                # Pages
│   ├── router/               # Vue Router
│   ├── stores/               # Pinia stores
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 📖 Documentation

- [Règles de sécurité](docs/realtime-rules.md)
- [Décisions d'architecture](docs/architecture-decisions.md)
- [Spécifications CMS](docs/cms-settings.md)
- [Schéma i18n](src/i18n/i18n-schema.md)

## 🎨 Usage du CMS

### 1. Se connecter en tant qu'admin/editor

L'accès à `/settings` nécessite le rôle `editor` ou `admin`.

### 2. Modifier le thème

1. Aller dans **Settings > Theme**
2. Modifier les couleurs avec les color pickers
3. Cliquer **Prévisualiser** pour voir les changements
4. Cliquer **Publier** pour sauvegarder

### 3. Gérer la navigation

1. Aller dans **Settings > Navigation & Footer**
2. Réorganiser les items (↑↓)
3. Modifier les propriétés (visible, labelKey, path)
4. **Publier** les changements

### 4. Éditer les traductions

1. Aller dans **Settings > i18n**
2. Sélectionner la langue (FR/EN)
3. Modifier/ajouter des clés
4. Import/Export JSON possible
5. **Publier** pour mettre en ligne

### 5. Restaurer une version

1. Aller dans **Settings > Historique**
2. Trouver la version souhaitée
3. Cliquer **Restaurer** → copie dans le brouillon
4. Vérifier puis **Publier**

## 🔐 Gestion des rôles

### Rôles disponibles

- **user** : Utilisateur standard (accès pages publiques + Product)
- **editor** : Peut éditer settings et i18n
- **admin** : Accès complet + gestion des rôles

### Attribuer un rôle

Dans Firebase Realtime Database :

```
/users/
  {uid}/
    role: "editor"  // ou "admin" ou "user"
```

## 🚀 Déploiement

### Netlify / Vercel

1. Connecter votre repo GitHub
2. Configurer les variables d'environnement (VITE_*)
3. Build command : `npm run build`
4. Publish directory : `dist`

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📝 Bonnes pratiques

### Sécurité
- ❌ Ne jamais stocker de secrets dans `/app/settings/current` ou `/app/i18n/live`
- ✅ Lecture publique uniquement pour contenus visuels
- ✅ Toujours vérifier les rôles côté serveur (rules)

### i18n
- ✅ Utiliser format dot-case : `nav.home`
- ✅ Respecter les namespaces : `nav.*`, `forms.*`, `errors.*`
- ✅ Clés ≤ 64 chars, valeurs ≤ 200 chars

### CMS
- ✅ Toujours prévisualiser avant de publier
- ✅ Ajouter un résumé explicite lors de la publication
- ✅ Backups réguliers via scripts backend

## 🐛 Troubleshooting

### Firebase connection failed

Vérifier que toutes les variables VITE_FIREBASE_* sont définies et correctes.

### Permission denied

Vérifier les règles Firebase Realtime Database et que l'utilisateur a le bon rôle.

### Settings not loading

Vérifier que `/app/settings/current` existe dans Firebase Database. Si vide, le template créera des settings par défaut.

## 📄 Licence

MIT

## 👥 Contribution

Les contributions sont bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

---

**Template créé avec ❤️ utilisant Vue 3, Firebase et des bonnes pratiques**
