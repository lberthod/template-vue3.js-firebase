# Firebase Realtime Database Rules

## Structure de base

```
/app/
  ├─ public/                         # Lecture publique, aucune écriture
  ├─ private/{uid}/...               # Lecture/écriture réservée à {uid}
  ├─ settings/
  │   ├─ current/                    # Version publiée
  │   ├─ draft/                      # Version en édition
  │   └─ audit/{timestamp}/          # Snapshots complets + résumé
  └─ i18n/
      ├─ live/{locale}/...           # Traductions publiées
      ├─ draft/{locale}/...          # Traductions en édition
      └─ audit/{timestamp}/          # Snapshots complets + résumé
/users/
  └─ {uid}/role                      # "user" | "editor" | "admin"
```

## Règles de sécurité

### Helpers

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "app": {
      "settings": {
        "current": {
          ".read": true,
          ".write": "auth != null"
        },
        "draft": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "audit": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      },
      
      "i18n": {
        "live": {
          ".read": true,
          ".write": "auth != null"
        },
        "draft": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "audit": {
          ".read": "auth != null",
          ".write": "auth != null"
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

## Résumé des permissions

| Chemin | Lecture | Écriture | Rôle requis |
|--------|---------|----------|-------------|
| `/app/settings/current` | Publique | Authentifié | ✳️ |
| `/app/settings/draft` | Authentifié | Authentifié | ⚙️ |
| `/app/settings/audit/**` | Authentifié | Authentifié | 🕒 |
| `/app/i18n/live/**` | Publique | Authentifié | ✳️ |
| `/app/i18n/draft/**` | Authentifié | Authentifié | ⚙️ |
| `/app/i18n/audit/**` | Authentifié | Authentifié | 🕒 |
| `/app/private/{uid}/**` | {uid} | {uid} | 🔒 |
| `/users/{uid}` | {uid}/Admin | Admin | 👤 |

## Instructions d'installation

1. Aller dans la console Firebase
2. Sélectionner votre projet
3. Aller dans Realtime Database > Règles
4. Copier-coller les règles ci-dessus
5. Publier les règles
