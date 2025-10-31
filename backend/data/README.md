# Data Files for Database Seeding

Ce dossier contient les fichiers JSON utilisés pour initialiser et remplir la base de données Firebase Realtime Database.

## Fichiers

- **settings.json** - Configuration globale (thème, navbar, footer, général)
- **i18n-fr.json** - Traductions françaises (toutes les clés i18n)
- **i18n-en.json** - Traductions anglaises (toutes les clés i18n)

## Format des fichiers i18n

Les fichiers i18n utilisent des clés au format dot-case (ex: `nav.home`, `contact.title`).
Les points sont automatiquement encodés en `·` lors de l'écriture en DB (Firebase ne supporte pas les points dans les clés).

Exemple:
```json
{
  "nav.home": "Accueil",
  "contact.title": "Contact",
  "home.feature.auth.title": "Authentification"
}
```

## Commandes de seed

### Remplir la DB avec ces fichiers
```bash
cd backend
npm run seed:files
```

### Options disponibles
```bash
# Écraser l'existant (--overwrite)
npm run seed:files -- --overwrite

# Choisir le scope (live|draft|both)
npm run seed:files -- --scope=live
npm run seed:files -- --scope=draft
npm run seed:files -- --scope=both

# Utiliser un autre dossier
npm run seed:files -- --dir=./mon-dossier

# Combiner les options
npm run seed:files -- --dir=./data --scope=both --overwrite
```

## Workflow recommandé

1. **Développement initial**: utiliser ces fichiers pour seed la DB
2. **Édition en ligne**: modifier le contenu via Settings > Traductions
3. **Export** (optionnel): exporter la DB pour versionner les modifications dans Git
4. **Re-seed**: utiliser `--overwrite` pour réinitialiser complètement la DB

## Structure de la DB après seed

```
/app
  /settings
    /current    → settings.json
    /draft      → settings.json
  /i18n
    /live
      /fr       → i18n-fr.json (clés encodées avec ·)
      /en       → i18n-en.json (clés encodées avec ·)
    /draft
      /fr       → i18n-fr.json (clés encodées avec ·)
      /en       → i18n-en.json (clés encodées avec ·)
```

## Notes

- Les fichiers JSON doivent être valides (pas de virgules traînantes, guillemets corrects)
- Les caractères spéciaux (@, {, }) dans les valeurs sont automatiquement échappés par l'app
- Pour ajouter une nouvelle locale, créez `i18n-XX.json` (ex: `i18n-es.json` pour l'espagnol)
