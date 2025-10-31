# Décisions d'Architecture

## Vue d'ensemble

Ce document consigne les décisions techniques majeures prises pour ce template.

---

## 1. Lecture publique pour settings/current et i18n/live

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Besoin d'afficher le thème, la navigation et les traductions sans authentification.

### Décision
- `/app/settings/current` : lecture publique
- `/app/i18n/live/{locale}` : lecture publique
- Écriture réservée aux rôles admin/editor

### Raison
- Performance : pas d'authentification nécessaire pour la consultation
- Simplicité : une seule requête pour charger les paramètres
- Sécurité : aucune donnée sensible n'est stockée dans ces chemins

### Conséquences
- Les secrets ne doivent JAMAIS être stockés dans ces chemins
- Les clés API, tokens, etc. doivent rester côté backend ou environment variables

---

## 2. Système de rôles hybride

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Besoin de gérer les permissions pour l'accès au CMS.

### Décision
Utiliser un système de rôles simple stocké dans `/users/{uid}/role` :
- `user` : utilisateur standard
- `editor` : peut éditer settings et i18n
- `admin` : accès complet + gestion des rôles

Possibilité d'étendre avec des custom claims Firebase si nécessaire.

### Raison
- Simplicité de mise en œuvre
- Extensible vers claims granulaires si besoin
- Centralisation dans la DB (single source of truth)

### Conséquences
- Les guards doivent vérifier le rôle en DB
- Légère latence au premier chargement (cache possible)

---

## 3. i18n avec clés dot-case namespacées

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Besoin d'une structure i18n claire et éditable dans le CMS.

### Décision
Format de clés : `namespace.section.key`  
Exemples : `nav.home`, `forms.contact.email.label`, `errors.required`

### Raison
- Lisibilité et organisation
- Facilite l'édition dans l'interface CMS
- Compatible avec vue-i18n
- Permet le tri et la recherche

### Conséquences
- Convention à respecter strictement
- Documentation nécessaire (voir i18n-schema.md)

---

## 4. Snapshots complets pour l'audit

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Besoin de restaurer des versions antérieures de settings ou i18n.

### Décision
Stocker des snapshots complets dans `/app/settings/audit/{timestamp}` et `/app/i18n/audit/{timestamp}` :
```json
{
  "timestamp": 1234567890,
  "summary": "Mise à jour du thème bleu",
  "data": { /* snapshot complet */ }
}
```

### Raison
- Restauration instantanée (pas de reconstruction)
- Simplicité conceptuelle
- Historique traçable

### Conséquences
- Augmentation du stockage DB
- Politique de rétention nécessaire (ex: 20 derniers snapshots)
- Backend de nettoyage requis

---

## 5. Format i18n plat pour l'édition

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Édition des traductions dans le CMS.

### Décision
Stocker en JSON plat :
```json
{
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "forms.contact.email.label": "Email"
}
```

Au lieu d'un format arborescent.

### Raison
- Plus facile à éditer dans une table clé/valeur
- Import/export simple
- Recherche facilitée
- Compatible avec structure arborescente via transformation

### Conséquences
- Transformation nécessaire si import depuis structure arborescente
- Délimiteur `.` réservé pour le namespace

---

## 6. Preview sans publication

**Date**: 2024-03  
**Statut**: Validé  

### Contexte
Besoin de tester les changements avant publication.

### Décision
Mode preview applique les changements en mémoire uniquement :
- Thème : injecte CSS vars temporairement
- Navbar/Footer : utilise draft au lieu de current
- i18n : merge draft dans runtime

### Raison
- Validation visuelle sans impact
- Annulation simple (reload)
- Pas de pollution de la DB

### Conséquences
- État preview à gérer dans le store
- Indicateur visuel nécessaire
- Reset manuel après preview

---

## Évolutions futures

### Envisagées
- Custom claims Firebase pour permissions granulaires
- Cache Redis pour settings/current
- API REST pour import/export massif i18n
- Versioning sémantique pour les snapshots
- Diff visuel entre versions d'audit

### Rejetées
- Stockage des settings en Firestore (Realtime DB suffit)
- Édition collaborative temps réel (complexité vs besoin)
- Support de plus de 2 locales (YAGNI pour le moment)
