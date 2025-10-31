# 🚀 Démarrage rapide

Guide pour démarrer avec le template en 10 minutes.

## ⚡ Installation ultra-rapide

### 1. Installation des dépendances (2 min)

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Configuration Firebase (5 min)

#### A. Créer un projet Firebase

1. Aller sur https://console.firebase.google.com
2. Créer un nouveau projet
3. Activer **Realtime Database** (mode test pour commencer)
4. Activer **Authentication** > Email/Password, Google, Anonyme

#### B. Configuration Frontend

```bash
# Copier le template
cp .env.development .env.development.local
```

Éditer `.env.development.local` avec vos credentials Firebase (trouvables dans Project Settings > General) :

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://votre-projet.firebaseio.com
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

#### C. Configuration Backend

1. Télécharger Service Account Key :
   - Firebase Console > Project Settings > Service Accounts
   - Cliquer "Generate new private key"
   - Sauvegarder comme `backend/serviceAccountKey.json`

2. Configurer l'environnement :

```bash
cd backend
cp .env.example .env
```

Éditer `backend/.env` :

```env
FIREBASE_DATABASE_URL=https://votre-projet.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
BACKUP_DIR=../backups
```

### 3. Règles de sécurité Firebase (2 min)

Dans Firebase Console > Realtime Database > Rules, copier-coller :

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "app": {
      "settings": {
        "current": {
          ".read": true,
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        },
        "draft": {
          ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')",
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        },
        "audit": {
          ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')",
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        }
      },
      
      "i18n": {
        "live": {
          ".read": true,
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        },
        "draft": {
          ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')",
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        },
        "audit": {
          ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')",
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'editor')"
        }
      },
      
      "private": {
        "$uid": {
          ".read": "auth != null && auth.uid === $uid",
          ".write": "auth != null && auth.uid === $uid"
        }
      }
    },
    
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

Cliquer **Publier**.

### 4. Initialiser la base de données (1 min)

```bash
cd backend
npm run seed:files -- --overwrite
cd ..
```

Cela va remplir automatiquement:
- `/app/settings` (thème, navigation, footer, général)
- `/app/i18n/live/fr` et `/app/i18n/live/en` (250+ clés de traductions)
- `/app/i18n/draft/fr` et `/app/i18n/draft/en`

### 5. Lancer l'application (1 min)

```bash
npm run dev
```

Ouvrir http://localhost:5173

## 🎯 Premiers pas

### Étape 1 : Se connecter

1. Cliquer sur **Anonyme** dans la navbar
2. Vous êtes maintenant connecté (UID visible dans la navbar)

### Étape 2 : Devenir admin

Pour accéder au CMS, vous devez être admin :

1. Copier votre UID depuis la navbar
2. Dans Firebase Console > Realtime Database
3. Créer manuellement cette structure :

```
/users/
  votre-uid-ici/
    role: "admin"
```

4. Recharger la page
5. Le lien **Paramètres** apparaît dans la navbar

### Étape 3 : Tester le CMS

1. Cliquer sur **Paramètres** dans la navbar
2. Aller dans **Theme**
3. Changer une couleur
4. Cliquer **Prévisualiser** → la couleur change immédiatement
5. Cliquer **Publier** → la couleur est sauvegardée

**Félicitations ! Le CMS fonctionne ! 🎉**

## 📚 Explorer les fonctionnalités

### Navigation & Footer

`Settings > Navigation & Footer`

- Réorganiser les items de navigation (↑↓)
- Masquer/afficher des items
- Modifier les liens

### Traductions

`Settings > i18n`

- Modifier les textes FR/EN
- Ajouter de nouvelles clés
- Import/Export JSON

### Historique

`Settings > Historique`

- Voir toutes les modifications
- Restaurer une version antérieure

## 🧪 Tester le backend

```bash
cd backend
npm start
```

Cela va :
- ✅ Tester la connexion (hello.js)
- 🔧 Vérifier la DB (maintenance)
- 💾 Créer des backups

Les backups sont dans `/backups` (à la racine du projet).

## 🎓 Aller plus loin

### Créer un utilisateur email/password

1. Implémenter un formulaire d'inscription
2. Ou créer manuellement dans Firebase Console > Authentication

### Connexion Google

1. Firebase Console > Authentication > Sign-in method > Google
2. Activer et configurer
3. Ajouter domaines autorisés
4. Tester avec le bouton Google dans la navbar

### Ajouter des pages

1. Créer `src/pages/MaPage.vue`
2. Ajouter la route dans `src/router/index.js`
3. Ajouter l'item dans le CMS via Settings > Navigation

### Personnaliser les traductions

1. Éditer `src/i18n/i18n.js` pour le bundle par défaut
2. Ou utiliser le CMS pour éditer en ligne

## 🚨 Troubleshooting rapide

### "Permission denied" dans Firebase

→ Vérifier que les règles sont bien publiées

### "Settings not loading"

→ Vérifier que `/app/settings/current` existe dans Firebase DB (l'app le crée automatiquement)

### "Cannot access /settings"

→ Vérifier que `/users/{votre-uid}/role` = "admin" ou "editor"

### Variables d'environnement non reconnues

→ Vérifier que le fichier est bien `.env.development.local` (pas `.env.local`)
→ Redémarrer le serveur après modification

## 📖 Documentation complète

- [README.md](README.md) - Documentation principale
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Structure du projet
- [docs/](docs/) - Documentation technique détaillée

## 🎉 Prêt à développer !

Vous avez maintenant :
- ✅ Un projet Vue 3 fonctionnel
- ✅ Firebase configuré
- ✅ Authentification opérationnelle
- ✅ CMS accessible
- ✅ Backend scripts fonctionnels

**Bon développement ! 🚀**
